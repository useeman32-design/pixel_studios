#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rootDir = path.resolve(__dirname, '..');
const libraryContext = { window: { console } };
vm.createContext(libraryContext);
for (const file of ['nfc-site/assets/js/profile-templates.js','nfc-site/assets/js/profile-expansion.js']) {
  vm.runInContext(fs.readFileSync(path.join(rootDir,file),'utf8'),libraryContext,{filename:file});
}
const library = libraryContext.window.PSProfileTemplates;
const profiles = library.profiles;
const original = ['cedarstone-realty','northline-property','formline-architects','aro-interiors','bridgepoint-buildworks','kora-legal','meridia-accounting','havenbridge-finance','peoplenorth-talent','steadfast-risk','motif-house','olu-frame-photo','lightwell-film','studio-tide-social','gatherwell-events','kinetik-software','halo-product-labs','ifeoma-product-design','sentinel-grid','northstar-it','cedarcare-family','clearview-dental','greenline-pharmacy','motionwell-physio','pulsefit-coaching','saffron-bowl','common-ground-cafe','rise-crumb-bakery','table-thyme-catering','nuru-stay','everyday-edit','sable-thread','aster-beauty','crown-coil','dewdrop-botanics','brightsteps-academy','northstar-learning','lingua-house','mariam-academic','rooted-futures','route-roam','swiftline-dispatch','autohaus-service','savanna-trails','cityline-transfers','greenfields-produce','sunpath-energy','reliable-home-services','amara-career-coaching','manifold-engineering'];
assert.strictEqual(library.count,200,'library count metadata');
assert.strictEqual(profiles.length,200,'exactly 200 profiles');
assert.strictEqual(new Set(profiles.map(p=>p.id)).size,200,'unique stable IDs');
assert.strictEqual(new Set(profiles.map(p=>p.family)).size,51,'51 distinct niche-layout families');
for (const id of original) assert(profiles.some(p=>p.id===id),'preserves original profile '+id);
const groupCounts = new Map();
for (const p of profiles) {
  groupCounts.set(p.group,(groupCounts.get(p.group)||0)+1);
  for (const key of ['id','group','category','brand','owner','role','city','tagline','bio','layoutName','focus','art','artAlt','family']) assert(p[key],p.id+' has '+key);
  assert(Array.isArray(p.services)&&p.services.length>=2,p.id+' has useful service/menu items');
  assert(Array.isArray(p.highlights)&&p.highlights.length>=2,p.id+' has sections');
  assert(Array.isArray(p.team),p.id+' has team data');
  assert(library.families[p.family],p.id+' uses a known layout family');
  const artPath=path.join(rootDir,'nfc-site/assets/profile-art',p.art+'.svg');
  assert(fs.existsSync(artPath),p.id+' image exists: '+p.art);
  const svg=fs.readFileSync(artPath,'utf8');
  assert(svg.startsWith('<?xml')&&svg.includes('<svg ')&&svg.includes('viewBox="0 0 800 520"'),p.art+' is valid local SVG artwork');
}
assert.strictEqual(groupCounts.size,10,'ten industry groups');
for (const [group,count] of groupCounts) assert.strictEqual(count,20,group+' has twenty concepts');
assert.strictEqual(new Set(profiles.map(p=>p.art)).size,143,'143 different local sample illustrations');

// Minimal DOM harness: exercises the production card/search/filter/render logic without external packages.
const registry = Object.create(null);
function createNode(key) {
  if (registry[key]) return registry[key];
  const listeners = Object.create(null), attrs = Object.create(null), children = Object.create(null);
  const node = {
    key, tagName:'DIV', value:'', textContent:'', innerHTML:'', hidden:false, open:false, offsetWidth:0,
    style:{cssText:'',setProperty:function(){}}, attributes:attrs, _listeners:listeners, classList:{
      add:function(){},remove:function(){},toggle:function(){return false;}
    },
    addEventListener:function(type,fn){(listeners[type]||(listeners[type]=[])).push(fn);},
    setAttribute:function(name,value){attrs[name]=String(value);},
    getAttribute:function(name){return attrs[name] || null;},
    removeAttribute:function(name){delete attrs[name];},
    querySelector:function(selector){return children[selector]||(children[selector]=createNode(key+' '+selector));},
    querySelectorAll:function(){return [];},
    closest:function(){return null;},
    focus:function(){},select:function(){},remove:function(){},appendChild:function(){},
    showModal:function(){this.open=true;},close:function(){this.open=false;},
    getBoundingClientRect:function(){return {width:390,height:600};}
  };
  if (key==='#profileGrid') {
    node.cardNodes=Object.create(null);
    node.querySelector=function(selector){return this.cardNodes[selector]||(this.cardNodes[selector]=createNode('card '+selector));};
  }
  registry[key]=node;
  return node;
}
const document = {
  title:'Sample Profile Library — Pixel Studios', activeElement:createNode('active'), body:createNode('body'),
  querySelector:function(selector){return createNode(selector);},
  querySelectorAll:function(){return [];}, addEventListener:function(){}, contains:function(){return true;},
  createElement:function(tag){const n=createNode('created '+tag);n.tagName=String(tag).toUpperCase();return n;},
  execCommand:function(){return true;}
};
const window = {
  location:{href:'https://sample.example/profiles/'}, console,
  matchMedia:function(){return {matches:false};},
  setTimeout:function(){return 1;},clearTimeout:function(){},
  requestAnimationFrame:function(fn){fn();},addEventListener:function(){},
  PSProfileTemplates:library
};
window.window=window;
const context={window,document,console,URL,history:{state:null,replaceState:function(){}},navigator:{},setTimeout:window.setTimeout,clearTimeout:window.clearTimeout,Array,String,Math,encodeURIComponent};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(rootDir,'nfc-site/profiles/profiles.js'),'utf8'),context,{filename:'nfc-site/profiles/profiles.js'});
const api=window.PSProfileLibrary;
assert.strictEqual(api.count,200,'browser library exposes all 200 profiles');
assert.strictEqual(api.profileIds.length,200,'browser profile index has 200 IDs');
const grid=createNode('#profileGrid');
assert.strictEqual((grid.innerHTML.match(/class="library-card"/g)||[]).length,200,'renders 200 library cards');
assert.strictEqual((grid.innerHTML.match(/--profile-accent-deep:/g)||[]).length,200,'every profile card receives a contrast-safe accent for its initials');
const filters=createNode('#profileFilters');
assert.strictEqual((filters.innerHTML.match(/class="profile-filter"/g)||[]).length,11,'renders All plus ten industry filters');

let renders=0;
for (const p of profiles) {
  for (const page of ['overview','services','sections','team']) {
    const html=api.renderSample(p.id,page);
    assert(html.includes('class="sample-site '),p.id+' '+page+' has a niche-specific page');
    assert(html.includes('FICTIONAL SAMPLE')&&html.includes('not a real client'),p.id+' '+page+' keeps the fictional distinction visible');
    assert(html.includes('data-family="'+p.family+'"'),p.id+' '+page+' uses its assigned design family');
    assert(html.includes('id="profilePageBody"')&&html.includes('aria-labelledby="profile-preview-heading"'),p.id+' '+page+' labels its main panel');
    assert(html.includes('role="tabpanel"')&&html.includes('--profile-accent-deep:#'),p.id+' '+page+' exposes its tab panel and accessible accent tokens');
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
    assert.strictEqual(new Set(ids).size,ids.length,p.id+' '+page+' has unique DOM IDs');
    assert(html.includes('data-motion-enabled="true"'),p.id+' '+page+' has motion state in its preview');
    const imageTags=html.match(/<img\b[^>]*>/g)||[];
    if (page==='overview') assert(imageTags.length>0,p.id+' overview includes sample imagery');
    for (const img of imageTags) {
      assert(/\balt="/.test(img),p.id+' '+page+' image has an alt attribute');
      assert(/\bsrc="\.\.\/assets\/profile-art\//.test(img),p.id+' '+page+' image is local');
      assert(!/https?:\/\//.test(img),p.id+' '+page+' does not depend on remote image hosting');
    }
    if(page==='overview') assert(html.includes('PAGE DESIGN NOTE')||html.includes('SAMPLE'),p.id+' overview has page-specific detail');
    renders++;
  }
}
assert.strictEqual(renders,800,'renders all four pages for all 200 concepts');
assert.strictEqual(new Set(profiles.map(p=>library.families[p.family].renderer)).size>=15,true,'designs use a broad set of composition renderers');

const htmlFile=fs.readFileSync(path.join(rootDir,'nfc-site/profiles/index.html'),'utf8');
const cssFile=fs.readFileSync(path.join(rootDir,'nfc-site/profiles/profiles-designs.css'),'utf8');
const libraryCss=fs.readFileSync(path.join(rootDir,'nfc-site/profiles/profiles.css'),'utf8');
assert(htmlFile.includes('profile-expansion.js')&&htmlFile.includes('profiles-designs.css'),'page loads the data expansion and design system');
assert(htmlFile.includes('previewMotionToggle')&&htmlFile.includes('previewLayoutFocus'),'page exposes motion and visitor-needs controls');
assert(htmlFile.includes('aria-label="Mobile preview"')&&htmlFile.includes('aria-label="Desktop preview"'),'size controls retain accessible names at icon-only widths');
assert(htmlFile.includes('aria-label="Copy link to this profile preview"'),'copy-link control retains an accessible name containing its visible label');
assert(!/id="profileGrid"\s+aria-live=/.test(htmlFile),'the 200-card gallery is not one enormous live region');
assert(cssFile.includes('@container (max-width:540px)'),'preview compositions adapt to their mobile preview width');
assert(libraryCss.includes('.profile-card-avatar {')&&libraryCss.includes('color:var(--profile-accent-deep,var(--ink))'),'card initials use a high-contrast palette color');
assert(libraryCss.includes(':root[data-theme="dark"] .profile-card-avatar { color:var(--ink); }'),'dark-theme card initials use the readable surface ink');
assert(!/\.profile-filter small\s*\{[^}]*opacity:/.test(libraryCss),'filter counts retain the same readable contrast as their button label');
assert(cssFile.includes('background:var(--sample-paper);color:var(--sample-muted);font-size:7px'),'sample footer respects the sample page palette in both site themes');
assert(cssFile.includes('background:var(--sample-accent-deep,var(--sample-accent));color:#fff'),'sample CTAs use a contrast-safe deep accent');
assert(cssFile.includes('@media (max-width:390px)'),'toolbar controls have a narrow-phone layout');
assert(cssFile.includes('prefers-reduced-motion:reduce')&&cssFile.includes('animation:none!important'),'reduced-motion preference disables motion');
assert(fs.readFileSync(path.join(rootDir,'nfc-site/profiles/profiles.js'),'utf8').includes('Motion reduced — animations are disabled by your reduced-motion preference'),'motion control accurately reflects the system preference and visible label');
assert(cssFile.includes('sample-route-grow')&&cssFile.includes('sample-image-reveal'),'purposeful finite motion is defined');

console.log('PASS — 200 profiles (20 in each of 10 groups), 51 layout families, 143 local SVG illustrations, 800 preview pages, local image alternatives, dynamic cards/filters, reduced-motion and responsive CSS checks.');
