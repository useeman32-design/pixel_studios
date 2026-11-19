#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rootDir = path.resolve(__dirname, '..');
const dataContext = { window: { console } };
vm.createContext(dataContext);
for (const file of ['nfc-site/assets/js/profile-templates.js','nfc-site/assets/js/profile-expansion.js']) {
  vm.runInContext(fs.readFileSync(path.join(rootDir,file),'utf8'),dataContext,{filename:file});
}
const library = dataContext.window.PSProfileTemplates;
const decode = value => String(value).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const attributes = tag => {
  const result = Object.create(null), re = /([\w:-]+)="([^"]*)"/g;
  let match;
  while ((match = re.exec(tag))) result[match[1]] = decode(match[2]);
  return result;
};
function runtime(reducedMotion) {
  const registry = Object.create(null), frames = [], timers = [], clipboardWrites = [];
  let doc;
  function makeNode(key) {
    if (registry[key]) return registry[key];
    const attrs = Object.create(null), listeners = Object.create(null), children = Object.create(null), classes = new Set();
    const node = {
      key, tagName:'DIV', value:'', textContent:'', hidden:false, open:false, disabled:false, offsetWidth:0,
      attributes:attrs, _listeners:listeners, _classes:classes, _filters:[], _tabs:[], _cards:Object.create(null), _inSampleTabs:false,
      style:{cssText:'',setProperty:function(name,value){this[name]=String(value);}},
      classList:{
        add:function(name){classes.add(name);},
        remove:function(name){classes.delete(name);},
        contains:function(name){return classes.has(name);},
        toggle:function(name,force){const on=force===undefined?!classes.has(name):!!force;if(on)classes.add(name);else classes.delete(name);return on;}
      },
      addEventListener:function(type,fn){(listeners[type]||(listeners[type]=[])).push(fn);},
      dispatch:function(type,event){event=event||{};if(!event.target)event.target=this;for(const fn of (listeners[type]||[]).slice())fn(event);},
      setAttribute:function(name,value){attrs[name]=String(value);},
      getAttribute:function(name){return Object.prototype.hasOwnProperty.call(attrs,name)?attrs[name]:null;},
      removeAttribute:function(name){delete attrs[name];},
      closest:function(selector){
        if(selector==='[data-group]'&&this.getAttribute('data-group')!==null)return this;
        if(selector==='[data-preview-profile]'&&this.getAttribute('data-preview-profile')!==null)return this;
        if(selector==='[data-motion-toggle]'&&this.getAttribute('data-motion-toggle')!==null)return this;
        if(selector==='[data-preview-action]'&&this.getAttribute('data-preview-action')!==null)return this;
        if(selector==='[data-close-preview]'&&this.getAttribute('data-close-preview')!==null)return this;
        if(selector==='[data-page]'&&this.getAttribute('data-page')!==null)return this;
        if(selector==='[role="tab"][data-page]'&&this.getAttribute('role')==='tab'&&this.getAttribute('data-page')!==null)return this;
        if(selector==='.sample-site-tabs'&&this._inSampleTabs)return makeNode('#profilePageLive .sample-site-tabs');
        return null;
      },
      focus:function(){if(doc)doc.activeElement=this;},
      select:function(){}, remove:function(){}, appendChild:function(){},
      showModal:function(){this.open=true;},
      close:function(){if(!this.open)return;this.open=false;this.dispatch('close',{target:this});},
      querySelector:function(selector){
        if(this.key==='#profileGrid'){
          const m=selector.match(/data-profile-card=["']([^"']+)["']/);
          return m?(this._cards[m[1]]||(this._cards[m[1]]=makeNode('card:'+m[1]))):null;
        }
        if(this.key==='#profilePageLive .sample-site-tabs'){
          const m=selector.match(/data-page=["']([^"']+)["']/);
          return m?this._tabs.find(tab=>tab.getAttribute('data-page')===m[1])||null:null;
        }
        if(this.key==='#previewPageTabs'){
          const m=selector.match(/data-page=["']([^"']+)["']/);
          return m?this._tabs.find(tab=>tab.getAttribute('data-page')===m[1])||null:null;
        }
        return children[selector]||(children[selector]=makeNode(key+' '+selector));
      },
      querySelectorAll:function(selector){
        if(selector==='.profile-filter')return this._filters;
        if(selector==='[data-page]'||selector==='[role="tab"][data-page]')return this._tabs;
        return [];
      },
      getBoundingClientRect:function(){return {width:390,height:600};}
    };
    let markup='';
    Object.defineProperty(node,'innerHTML',{
      get:function(){return markup;},
      set:function(value){
        markup=String(value);
        if(key==='#profileGrid'){
          node._cards=Object.create(null);
          const re=/<article\b[^>]*data-profile-card="([^"]+)"[^>]*>/g;let m;
          while((m=re.exec(markup))){const card=makeNode('card:'+decode(m[1]));card.setAttribute('data-profile-card',decode(m[1]));node._cards[decode(m[1])]=card;}
        } else if(key==='#profileFilters'){
          node._filters=[];
          const re=/<button\b[^>]*class="profile-filter"[^>]*>/g;let m,n=0;
          while((m=re.exec(markup))){const a=attributes(m[0]),button=makeNode('filter:'+(n++));Object.keys(a).forEach(k=>button.setAttribute(k,a[k]));node._filters.push(button);}
        } else if(key==='#previewPageTabs'||key==='#profilePageLive'){
          node._tabs=[];
          const re=/<button\b[^>]*data-page="([^"]+)"[^>]*>/g;let m,n=0;
          while((m=re.exec(markup))){const a=attributes(m[0]),tab=makeNode(key+':tab:'+(n++));Object.keys(a).forEach(k=>tab.setAttribute(k,a[k]));tab._inSampleTabs=key==='#profilePageLive';node._tabs.push(tab);}
          if(key==='#profilePageLive')makeNode('#profilePageLive .sample-site-tabs')._tabs=node._tabs;
        }
      }
    });
    registry[key]=node;
    return node;
  }
  const media={matches:!!reducedMotion,listeners:[],addEventListener:function(type,fn){if(type==='change')this.listeners.push(fn);},addListener:function(fn){this.listeners.push(fn);},change:function(matches){this.matches=!!matches;this.listeners.forEach(fn=>fn({matches:this.matches}));}};
  doc={
    title:'Sample Profile Library — Pixel Studios',activeElement:null,body:null,
    querySelector:function(selector){if(selector==='#profilePageLive .sample-site-tabs')return makeNode(selector);return makeNode(selector);},
    querySelectorAll:function(selector){
      if(selector==='#profilePreview [data-page]')return makeNode('#previewPageTabs')._tabs.concat(makeNode('#profilePageLive')._tabs);
      if(selector==='.preview-size-switch [data-preview-size]')return [makeNode('size:mobile'),makeNode('size:desktop')];
      return makeNode(selector).querySelectorAll(selector);
    },
    addEventListener:function(type,fn){makeNode('document').addEventListener(type,fn);},
    dispatch:function(type,event){makeNode('document').dispatch(type,event);},
    contains:function(){return true;},
    createElement:function(tag){const el=makeNode('created:'+tag);el.tagName=String(tag).toUpperCase();return el;},
    execCommand:function(){return true;}
  };
  doc.activeElement=makeNode('active');doc.body=makeNode('body');
  const navigator={clipboard:{writeText:function(text){clipboardWrites.push(text);return {then:function(fn){fn();return {catch:function(){}};}};}}};
  const location={href:'https://sample.example/profiles/'};
  const history={state:null,replaceState:function(){}};
  const window={location,console,matchMedia:function(){return media;},setTimeout:function(fn,ms){const timer={fn,ms:ms||0,cancelled:false};timers.push(timer);return timers.length;},clearTimeout:function(id){if(timers[id-1])timers[id-1].cancelled=true;},requestAnimationFrame:function(fn){frames.push(fn);return frames.length;},addEventListener:function(){},PSProfileTemplates:library};
  window.window=window;
  const context={window,document:doc,console,URL,history,navigator,setTimeout:window.setTimeout,clearTimeout:window.clearTimeout};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(rootDir,'nfc-site/profiles/profiles.js'),'utf8'),context,{filename:'nfc-site/profiles/profiles.js'});
  const dialog=makeNode('#profilePreview');
  const close=dialog.querySelector('[data-close-preview]');close.setAttribute('data-close-preview','');
  const motion=makeNode('#previewMotionToggle');motion.setAttribute('data-motion-toggle','');
  const mobile=makeNode('size:mobile');mobile.setAttribute('data-preview-size','mobile');
  const desktop=makeNode('size:desktop');desktop.setAttribute('data-preview-size','desktop');
  const copy=makeNode('#copyProfileLink');
  const search=makeNode('#profileSearch');search.tagName='INPUT';
  return {registry,doc,window,history,navigator,media,frames,timers,clipboardWrites,dialog,motion,mobile,desktop,copy,grid:makeNode('#profileGrid'),filters:makeNode('#profileFilters'),search,tabs:makeNode('#previewPageTabs'),live:makeNode('#profilePageLive'),previewWindow:makeNode('#previewWindow'),filterHint:makeNode('#filterHint'),count:makeNode('#profileResultCount'),results:makeNode('#profileResultsText'),empty:makeNode('#profileEmpty'),clear:makeNode('#clearProfileSearch'),reset:makeNode('#resetProfileFilters'),toast:makeNode('#previewToast')};
}
function click(parent,target){parent.dispatch('click',{target,preventDefault:function(){this.defaultPrevented=true;}});}
function keydown(parent,target,key){const event={target,key,preventDefault:function(){this.defaultPrevented=true;}};parent.dispatch('keydown',event);return event;}
function visibleCount(grid){return Object.values(grid._cards).filter(card=>!card.hidden).length;}

const ui=runtime(false);
assert.strictEqual(ui.window.PSProfileLibrary.count,200);
assert.strictEqual(ui.grid.innerHTML.match(/class="library-card"/g).length,200,'all 200 cards render');
const filterButtons=ui.filters._filters;
assert.strictEqual(filterButtons.length,11,'All plus ten industry filters');
assert.deepStrictEqual(filterButtons.map(button=>button.getAttribute('data-group')),['All industries',...Array.from(new Set(library.profiles.map(p=>p.group)))]);
assert.strictEqual(visibleCount(ui.grid),200);
const property=filterButtons.find(button=>button.getAttribute('data-group')==='Property & Built Environment');
click(ui.filters,property);
assert.strictEqual(visibleCount(ui.grid),20,'industry filter shows exactly its 20 concepts');
assert.strictEqual(ui.count.textContent,'20');
assert.strictEqual(property.getAttribute('aria-pressed'),'true');
assert.strictEqual(filterButtons[0].getAttribute('aria-pressed'),'false');
ui.search.value='Abuja';ui.search.dispatch('input');
assert(visibleCount(ui.grid)>0&&visibleCount(ui.grid)<20,'search combines with the selected industry');
assert.strictEqual(ui.clear.hidden,false,'clear-search control appears while searching');
ui.search.value='zzzz-no-such-profile';ui.search.dispatch('input');
assert.strictEqual(visibleCount(ui.grid),0,'zero-result search hides all cards');
assert.strictEqual(ui.empty.hidden,false,'no-results message appears');
assert.strictEqual(ui.results.textContent,'Showing 0 of 200 concepts');
click(ui.reset,ui.reset);
assert.strictEqual(visibleCount(ui.grid),200,'reset restores the entire library');
assert.strictEqual(ui.search.value,'');
assert.strictEqual(ui.empty.hidden,true);
assert.strictEqual(ui.clear.hidden,true);
assert.strictEqual(filterButtons[0].getAttribute('aria-pressed'),'true');

// The keyboard search shortcut does not steal focus from a text input.
ui.doc.activeElement=ui.doc.body;
const slash=keydown(ui.doc,ui.doc.body,'/');
assert.strictEqual(slash.defaultPrevented,true);
assert.strictEqual(ui.doc.activeElement,ui.search);
const slashInInput=keydown(ui.doc,ui.search,'/');
assert.strictEqual(slashInInput.defaultPrevented,undefined);

// A real card click opens the modal, builds the preview, and sets its share URL metadata.
const trigger=ui.grid._cards['cedarstone-realty'];trigger.setAttribute('data-preview-profile','cedarstone-realty');
ui.doc.activeElement=trigger;
click(ui.grid,trigger);
assert.strictEqual(ui.dialog.open,true,'profile preview dialog opens');
assert(ui.live.innerHTML.includes('FICTIONAL SAMPLE'));
assert(ui.live.innerHTML.includes('data-family="property-finder"'));
assert(ui.live.innerHTML.includes('data-active-page="overview"'));
assert(ui.live.innerHTML.includes('aria-labelledby="profile-preview-heading"'));
assert.strictEqual(ui.doc.title,'Cedarstone Realty — Fictional Sample Profile | Pixel Studios');
assert(ui.registry['#previewNumber'].textContent.includes('001 / 200'));
assert.strictEqual(ui.tabs._tabs.length,4,'sidebar exposes four preview tabs');
assert.strictEqual(ui.motion.getAttribute('aria-pressed'),'true');

// Page tabs synchronize, arrow keys move focus, and both tablists label the active panel.
const services=ui.tabs._tabs.find(tab=>tab.getAttribute('data-page')==='services');
click(ui.dialog,services);
assert(ui.live.innerHTML.includes('data-active-page="services"'));
assert.strictEqual(services.getAttribute('aria-selected'),'true');
assert(ui.live.innerHTML.includes('WHAT VISITORS CAN DO'));
const arrow=keydown(ui.dialog,services,'ArrowRight');
assert.strictEqual(arrow.defaultPrevented,true);
assert(ui.live.innerHTML.includes('data-active-page="sections"'));
const sectionTab=ui.live._tabs.find(tab=>tab.getAttribute('data-page')==='sections');
const innerArrow=keydown(ui.dialog,sectionTab,'ArrowRight');
assert.strictEqual(innerArrow.defaultPrevented,true);
assert(ui.live.innerHTML.includes('data-active-page="team"'));
assert.strictEqual(ui.doc.activeElement,ui.live._tabs.find(tab=>tab.getAttribute('data-page')==='team'),'focus follows the active in-preview tab');

// Motion is one-shot, can be disabled, and is stopped immediately when the control is switched off.
assert.strictEqual(ui.frames.length>0,true,'page render requests purposeful motion');
while(ui.frames.length)ui.frames.shift()();
assert.strictEqual(ui.live.classList.contains('sample-playing'),true,'one-shot entrance motion starts');
click(ui.dialog,ui.motion);
assert.strictEqual(ui.motion.getAttribute('aria-pressed'),'false');
assert.strictEqual(ui.live.classList.contains('sample-playing'),false,'turning motion off clears an in-flight animation class');
const pending=ui.timers.find(t=>t.ms===1300&&!t.cancelled);if(pending)pending.fn();
assert.strictEqual(ui.live.classList.contains('sample-playing'),false,'stale animation timeout cannot restart motion');
click(ui.dialog,ui.motion);
assert.strictEqual(ui.motion.getAttribute('aria-pressed'),'true');

// Device-size controls, copy-link action, sample-only CTA, close and focus restoration.
ui.desktop.dispatch('click');
assert.strictEqual(ui.desktop.getAttribute('aria-pressed'),'true');
assert.strictEqual(ui.mobile.getAttribute('aria-pressed'),'false');
assert.strictEqual(ui.previewWindow.classList.contains('is-desktop'),true);
click(ui.copy,ui.copy);
assert(ui.clipboardWrites[0].includes('profile=cedarstone-realty'));
const action={closest:function(selector){return selector==='[data-preview-action]'?this:null;}};
click(ui.dialog,action);
assert(ui.toast.textContent.includes('Sample action only'));
const back=ui.dialog.querySelector('[data-close-preview]');
click(ui.dialog,back);
assert.strictEqual(ui.dialog.open,false);
assert.strictEqual(ui.doc.title,'Sample Profile Library — Pixel Studios');
assert.strictEqual(ui.doc.activeElement,trigger,'closing returns focus to the card that opened the dialog');

// OS preference changes are followed while open; reduced motion disables the control and stays off.
ui.search.value='';
click(ui.grid,trigger);
ui.media.change(true);
assert.strictEqual(ui.motion.disabled,true);
assert.strictEqual(ui.motion.getAttribute('aria-pressed'),'false');
assert.strictEqual(ui.motion.querySelector('[data-motion-label]').textContent,'Motion reduced');
click(ui.dialog,ui.motion);
assert.strictEqual(ui.live.innerHTML.includes('data-motion-enabled="false"'),true);
ui.media.change(false);
assert.strictEqual(ui.motion.disabled,false);
assert.strictEqual(ui.motion.getAttribute('aria-pressed'),'true','an explicit choice is restored after the system preference changes back');

// A fresh page load with reduced motion starts in a truthful, non-animated state.
const reduced=runtime(true);
const reducedTrigger=reduced.grid._cards['cedarstone-realty'];reducedTrigger.setAttribute('data-preview-profile','cedarstone-realty');
click(reduced.grid,reducedTrigger);
assert.strictEqual(reduced.motion.disabled,true);
assert.strictEqual(reduced.motion.getAttribute('aria-pressed'),'false');
assert.strictEqual(reduced.motion.querySelector('[data-motion-label]').textContent,'Motion reduced');
assert(reduced.live.innerHTML.includes('data-motion-enabled="false"'));
click(reduced.dialog,reduced.motion);
assert.strictEqual(reduced.motion.getAttribute('aria-pressed'),'false','the system reduced-motion preference cannot be accidentally overridden');
assert.strictEqual(reduced.frames.length,0,'reduced motion never schedules an entrance animation');

console.log('PASS — search/filter intersection and reset; 200-card rendering; modal open/close and focus return; preview tabs and arrow-key navigation; mobile/desktop switch; clipboard link; sample-action notice; motion toggle and live reduced-motion changes.');
