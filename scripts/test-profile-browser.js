#!/usr/bin/env node
'use strict';

/*
 * Reusable Chromium regression checks for the 200-profile browser library.
 * Covers library axe scans in both themes, Cedarstone's four tabs in both
 * themes, core interactions, and the 612-case family/tab/viewport layout matrix.
 *
 * Prerequisites: Playwright, axe-core, and a running static server for nfc-site.
 * Example setup and run:
 *   npm install --prefix /tmp/profile-qa playwright axe-core
 *   /tmp/profile-qa/node_modules/.bin/playwright install chromium
 *   python3 -m http.server 8000 --bind 0.0.0.0 --directory nfc-site
 *   NODE_PATH=/tmp/profile-qa/node_modules node scripts/test-profile-browser.js
 *
 * Override PROFILE_TEST_URL, AXE_SCRIPT, PLAYWRIGHT_MODULE, or
 * PLAYWRIGHT_BROWSERS_PATH when your local setup differs.
 */
const assert = require('assert');

const baseUrl = (process.env.PROFILE_TEST_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const libraryUrl = baseUrl + '/profiles/';
const axePath = process.env.AXE_SCRIPT || require.resolve('axe-core/axe.min.js');
const playwrightModule = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = require(playwrightModule);
const pageTabs = ['overview', 'services', 'sections', 'team'];
const viewports = [320, 390, 1440];

function shortViolations(violations) {
  return violations.map(v => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary }))
  }));
}

async function setTheme(page, theme) {
  await page.evaluate(value => window.PSTheme.set(value), theme);
  const expectedText = theme === 'dark' ? 'rgb(242, 245, 245)' : 'rgb(16, 20, 24)';
  await page.waitForFunction(expected => {
    const card = document.querySelector('.library-card');
    return card && getComputedStyle(card).color === expected;
  }, expectedText);
}

async function assertAxeClean(page, label) {
  const result = await page.evaluate(async () => {
    const scan = await axe.run(document);
    return {
      violations: scan.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map(n => ({ target: n.target, failureSummary: n.failureSummary }))
      })),
      passes: scan.passes.length,
      incomplete: scan.incomplete.reduce((counts, rule) => {
        counts[rule.id] = (counts[rule.id] || 0) + rule.nodes.length;
        return counts;
      }, {})
    };
  });
  assert.deepStrictEqual(result.violations, [], `${label} axe violations:\n${JSON.stringify(shortViolations(result.violations), null, 2)}`);
  console.log(`PASS axe ${label}: ${result.passes} rules passed; 0 violations${result.incomplete['color-contrast'] ? `; ${result.incomplete['color-contrast']} contrast cases marked incomplete for manual review` : ''}.`);
  return result;
}

async function runResponsiveMatrix(page) {
  const families = await page.evaluate(() => {
    const seen = new Set();
    return window.PSProfileTemplates.profiles
      .filter(profile => {
        if (seen.has(profile.family)) return false;
        seen.add(profile.family);
        return true;
      })
      .map(profile => ({ id: profile.id, family: profile.family, palette: profile.palette || 'teal' }));
  });
  assert.strictEqual(families.length, 51, 'the browser preview should expose all 51 layout families');

  let checks = 0;
  const failures = [];
  for (const width of viewports) {
    await page.setViewportSize({ width, height: 1050 });
    const measured = await page.evaluate(({ width, families, tabs }) => {
      const root = document.querySelector('#profilePageLive');
      const preview = document.querySelector('#previewWindow');
      const desktop = width >= 1200;
      preview.classList.toggle('is-desktop', desktop);
      document.querySelectorAll('[data-preview-size]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-preview-size') === (desktop ? 'desktop' : 'mobile')));
      });

      const failures = [];
      let checks = 0;
      for (const profile of families) {
        root.setAttribute('data-palette', profile.palette);
        root.setAttribute('data-family', profile.family);
        for (const tab of tabs) {
          root.classList.remove('sample-playing');
          root.innerHTML = window.PSProfileLibrary.renderSample(profile.id, tab);
          root.querySelectorAll('[data-page]').forEach(button => {
            const selected = button.getAttribute('data-page') === tab;
            button.setAttribute('aria-selected', String(selected));
            button.setAttribute('tabindex', selected ? '0' : '-1');
          });
          const sample = root.querySelector('.sample-site');
          if (!sample) {
            failures.push({ width, id: profile.id, family: profile.family, tab, reason: 'sample page did not render' });
            checks++;
            continue;
          }
          // Reading layout metrics forces style/layout after each deterministic render.
          const sampleClientWidth = sample.clientWidth;
          const sampleScrollWidth = sample.scrollWidth;
          const rootClientWidth = root.clientWidth;
          const rootScrollWidth = root.scrollWidth;
          const previewClientWidth = preview.clientWidth;
          const previewScrollWidth = preview.scrollWidth;
          if (sampleScrollWidth > sampleClientWidth + 1 || rootScrollWidth > rootClientWidth + 1 || previewScrollWidth > previewClientWidth + 1) {
            failures.push({
              width, id: profile.id, family: profile.family, tab,
              sample: `${sampleScrollWidth}/${sampleClientWidth}`,
              liveRoot: `${rootScrollWidth}/${rootClientWidth}`,
              previewWindow: `${previewScrollWidth}/${previewClientWidth}`
            });
          }
          checks++;
        }
      }
      return { checks, failures };
    }, { width, families, tabs: pageTabs });
    checks += measured.checks;
    failures.push(...measured.failures);
    console.log(`PASS responsive matrix at ${width}px: ${measured.checks} layout-family/tab checks.`);
  }
  assert.strictEqual(checks, 612, 'responsive matrix covers 51 families × 4 tabs × 3 widths');
  assert.deepStrictEqual(failures, [], `horizontal overflow in responsive matrix:\n${JSON.stringify(failures.slice(0, 30), null, 2)}`);
  console.log(`PASS responsive matrix: ${checks} checks; zero horizontal overflows.`);
}

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
  try {
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(baseUrl).origin });
    } catch (_) {
      // The app's copy-link control has a visible fallback if clipboard access is unavailable.
    }
    const page = await context.newPage();
    const pageErrors = [];
    const localHttpErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(baseUrl) && response.status() >= 400) {
        localHttpErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => localStorage.setItem('ps_theme', 'light'));
    const response = await page.goto(libraryUrl, { waitUntil: 'domcontentloaded' });
    assert(response && response.ok(), `library page should return HTTP 200 (${response && response.status()})`);
    await page.locator('.library-card').first().waitFor();
    await page.addScriptTag({ path: axePath });

    assert.strictEqual(await page.locator('.library-card').count(), 200, 'renders all 200 profile cards');
    assert.strictEqual(await page.locator('.profile-filter').count(), 11, 'renders All plus ten industry filters');
    assert.strictEqual(await page.locator('.profile-card-art img').count(), 200, 'renders local card artwork for all concepts');
    await assertAxeClean(page, 'library, light theme');
    await setTheme(page, 'dark');
    await assertAxeClean(page, 'library, dark theme');
    await setTheme(page, 'light');

    // Search and industry filters compose, and a reset restores the full result set.
    await page.locator('.profile-filter[data-group="Property & Built Environment"]').click();
    assert.strictEqual(await page.locator('.library-card:visible').count(), 20, 'industry filter shows its 20 concepts');
    await page.locator('#profileSearch').fill('Cedarstone');
    assert.strictEqual(await page.locator('#profileResultCount').textContent(), '1', 'search intersects with the active industry');
    await page.locator('#profileSearch').fill('no-profile-matches-this');
    assert.strictEqual(await page.locator('.library-card:visible').count(), 0, 'no-result query hides every card');
    await page.locator('#resetProfileFilters').click();
    assert.strictEqual(await page.locator('.library-card:visible').count(), 200, 'reset restores all concepts');
    assert.strictEqual(await page.locator('#profileSearch').inputValue(), '', 'reset clears the search field');

    // Slash focuses search unless a text-entry control already owns focus.
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await page.keyboard.press('/');
    assert.strictEqual(await page.evaluate(() => document.activeElement && document.activeElement.id), 'profileSearch', 'slash shortcut focuses search');
    await page.locator('#profileSearch').fill('');

    // Preview open/close, tab semantics, accessible contrast/names, sharing, and motion state.
    const opener = page.locator('[data-preview-profile="cedarstone-realty"]');
    await opener.click();
    assert.strictEqual(await page.locator('#profilePreview').evaluate(dialog => dialog.open), true, 'preview dialog opens');
    assert.match(await page.title(), /Cedarstone Realty — Fictional Sample Profile/);
    assert.match(await page.locator('#copyProfileLink').getAttribute('aria-label'), /Copy link/i);

    for (const theme of ['light', 'dark']) {
      await setTheme(page, theme);
      for (const tab of pageTabs) {
        await page.locator(`#previewPageTabs [data-page="${tab}"]`).click();
        assert.strictEqual(await page.locator('#profilePageLive [data-active-page]').getAttribute('data-active-page'), tab, `${tab} page renders`);
        assert.strictEqual(await page.locator(`#previewPageTabs [data-page="${tab}"]`).getAttribute('aria-selected'), 'true', `${tab} sidebar tab is selected`);
        assert.strictEqual(await page.locator(`#profilePageLive .sample-site-tabs [data-page="${tab}"]`).getAttribute('aria-selected'), 'true', `${tab} sample-page tab is selected`);
        await assertAxeClean(page, `Cedarstone ${tab}, ${theme} theme`);
      }
    }

    // Arrow keys move between page tabs and keep the two tablists synchronized.
    await page.locator('#previewPageTabs [data-page="services"]').focus();
    await page.keyboard.press('ArrowRight');
    assert.strictEqual(await page.locator('#previewPageTabs [data-page="sections"]').getAttribute('aria-selected'), 'true');
    assert.strictEqual(await page.locator('#profilePageLive [data-active-page]').getAttribute('data-active-page'), 'sections');

    // Device-size controls, clipboard feedback, and sample-only CTA feedback.
    await page.locator('[data-preview-size="desktop"]').click();
    assert.strictEqual(await page.locator('[data-preview-size="desktop"]').getAttribute('aria-pressed'), 'true');
    assert(await page.locator('#previewWindow').evaluate(element => element.classList.contains('is-desktop')));
    await page.locator('[data-preview-size="mobile"]').click();
    assert.strictEqual(await page.locator('[data-preview-size="mobile"]').getAttribute('aria-pressed'), 'true');
    await page.locator('#copyProfileLink').click();
    await page.waitForFunction(() => document.querySelector('#previewToast').classList.contains('show'));
    assert.match(await page.locator('#previewToast').textContent(), /copied|copy it to share/i, 'copy action provides visible status feedback');
    const copiedUrl = await page.evaluate(async () => {
      try { return await navigator.clipboard.readText(); } catch (_) { return ''; }
    });
    if (copiedUrl) assert(copiedUrl.includes('profile=cedarstone-realty'), 'clipboard link points to the selected sample');
    await page.locator('#previewPageTabs [data-page="overview"]').click();
    await page.locator('#profilePageLive [data-preview-action]').first().click();
    await page.waitForFunction(() => document.querySelector('#previewToast').classList.contains('show'));
    assert.match(await page.locator('#previewToast').textContent(), /Sample action only/i, 'sample CTA explains that it is not connected');

    const motion = page.locator('#previewMotionToggle');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => !matchMedia('(prefers-reduced-motion: reduce)').matches && !document.querySelector('#previewMotionToggle').disabled);
    assert.strictEqual(await motion.getAttribute('aria-pressed'), 'true', 'motion starts on without a reduced-motion preference');
    await motion.click();
    assert.strictEqual(await motion.getAttribute('aria-pressed'), 'false', 'motion toggle turns sample motion off');
    assert.strictEqual(await page.locator('#profilePageLive .sample-site').getAttribute('data-motion-enabled'), 'false');
    assert.match(await motion.getAttribute('aria-label'), /Motion off/i);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => matchMedia('(prefers-reduced-motion: reduce)').matches && document.querySelector('#previewMotionToggle').disabled);
    assert.strictEqual(await motion.isDisabled(), true, 'system reduced-motion preference disables the override');
    assert.strictEqual(await motion.getAttribute('aria-pressed'), 'false');
    assert.strictEqual(await motion.locator('[data-motion-label]').textContent(), 'Motion reduced');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => !matchMedia('(prefers-reduced-motion: reduce)').matches && !document.querySelector('#previewMotionToggle').disabled);
    assert.strictEqual(await motion.isDisabled(), false, 'motion control returns when the system preference allows motion');
    assert.strictEqual(await motion.getAttribute('aria-pressed'), 'false', 'the explicit off choice is retained');

    await runResponsiveMatrix(page);

    await page.locator('[data-close-preview]').first().click();
    assert.strictEqual(await page.locator('#profilePreview').evaluate(dialog => dialog.open), false, 'preview closes');
    assert.strictEqual(await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-preview-profile')), 'cedarstone-realty', 'focus returns to the card that opened the preview');

    assert.deepStrictEqual(pageErrors, [], `uncaught browser errors:\n${pageErrors.join('\n')}`);
    assert.deepStrictEqual(localHttpErrors, [], `local HTTP errors:\n${localHttpErrors.join('\n')}`);
    console.log('PASS browser functional checks: filtering/search, slash shortcut, modal/focus, tabs/arrow keys, device size, copy status, sample CTA, and reduced motion.');
    console.log(`PASS browser health: ${pageErrors.length} page errors; ${localHttpErrors.length} local HTTP errors.`);
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch(error => {
  console.error(error && error.stack || error);
  process.exitCode = 1;
});
