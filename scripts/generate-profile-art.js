#!/usr/bin/env node
/* Generate local, original SVG sample artwork used by the fictional profile library. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'nfc-site/assets/profile-art');
const browser = { window: { console } };
vm.createContext(browser);
for (const file of ['nfc-site/assets/js/profile-templates.js', 'nfc-site/assets/js/profile-expansion.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), browser, { filename: file });
}
const profiles = browser.window.PSProfileTemplates.profiles;
const arts = [...new Set(profiles.map(p => p.art))].sort();
fs.mkdirSync(outDir, { recursive: true });

const memberships = {
  architecture: ['construction','facility','inspection','materials','property','roof','stay','survey','urban','venue','workspace','bridge','engineering'],
  blueprint: ['blueprint'],
  interior: ['interior','homegoods'],
  digital: ['ai','analytics','automation','cloud','code','iot','mobile','network','product','security','software','support','web'],
  health: ['care','calm','clinic','dental','eye','fitness','lab','maternal','movement','nutrition','pharmacy','salon','spa','speech','veterinary','yoga','nails','hair','barber'],
  food: ['agriculture','bakery','catering','coffee','dessert','farm','food','fooddelivery','foodtruck','juice','market','mealprep','produce','seeds','tea','kitchen'],
  fashion: ['accessory','atelier','bag','bridal','fashion','fragrance','gift','jewelry','shoes','skincare','sportswear','vintage'],
  travel: ['bike','boat','bus','car','city','concierge','ev','mountain','move','parcel','travel','travelphoto','shipping'],
  energy: ['generator','recycle','solar','water'],
  garden: ['garden'],
  learning: ['books','child','craft','language','language2','learning','research','school','scholarship','speech2','sports','training','youth'],
  business: ['career','desk','document','finance','ledger','legal','meeting'],
  creative: ['art','audio','brand','camera','film','gallery','illustration','media','microphone','motion','mural','music','print','social','writing'],
  tools: ['cleaning','electrical','farmtools','pest','plumbing','repair','tools','wood'],
  event: ['event'],
  audio: [],
  mobility: ['auto-detail','fooddelivery','parcel'],
  community: ['community','people']
};
const paletteSets = {
  architecture: ['#edf0e9','#243d3a','#d58158','#d4b796'],
  blueprint: ['#112a3b','#f3f0df','#7dd4ca','#e5a45f'],
  interior: ['#eee1d0','#274541','#c27b58','#d9c093'],
  digital: ['#e7eef1','#152f3c','#24a99c','#8268bd'],
  health: ['#e8f0e9','#245b58','#db8e79','#f3d7b0'],
  food: ['#f6e8cf','#563a27','#db7546','#e0b34f'],
  fashion: ['#f0e7e6','#51334c','#bf7581','#d3a669'],
  travel: ['#e0ecec','#1b4b54','#dc8754','#e2c575'],
  energy: ['#e7eee0','#244b3f','#dfb84f','#a0c8aa'],
  garden: ['#e8eddf','#345a46','#bf8054','#e0c183'],
  learning: ['#e9edf4','#2d3d64','#da9a54','#84b8bf'],
  business: ['#e9edf0','#22364b','#bf9256','#85a9a5'],
  creative: ['#eee6f0','#4a345b','#df795e','#e3bd62'],
  tools: ['#ecece4','#2e4145','#cf7755','#d4ae69'],
  event: ['#f2e6df','#4d3b45','#cf825d','#d9be82'],
  audio: ['#e9e9f2','#302e4b','#d58667','#8b8bc7'],
  mobility: ['#e8eeed','#263e4a','#da8956','#e0bd65'],
  community: ['#eaf0e5','#315546','#d6845d','#ddc87e']
};
function hash(value) {
  let h = 2166136261;
  for (const ch of value) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function sceneFor(key) {
  for (const [scene, keys] of Object.entries(memberships)) if (keys.includes(key)) return scene;
  return 'business';
}
function svgFor(key) {
  const scene = sceneFor(key);
  const colors = paletteSets[scene];
  const seed = hash(key);
  const [paper, ink, accent, secondary] = colors;
  const shiftX = 35 + (seed % 85);
  const shiftY = 48 + ((seed >>> 7) % 90);
  const art = {
    architecture: `<path d="M0 367 Q180 330 350 365T800 348V520H0Z" fill="${secondary}" opacity=".48"/><circle cx="650" cy="100" r="52" fill="${accent}" opacity=".4"/><rect x="172" y="186" width="390" height="250" rx="5" fill="${paper}"/><path d="M145 195 364 69l226 126Z" fill="${ink}"/><path d="M145 195h445" stroke="${accent}" stroke-width="9"/><rect x="223" y="236" width="99" height="93" rx="3" fill="${secondary}"/><rect x="405" y="236" width="99" height="93" rx="3" fill="${secondary}"/><path d="M365 436V314h52v122" fill="${accent}"/><path d="M223 273h99M272 236v93M405 273h99M454 236v93" stroke="${ink}" stroke-width="5" opacity=".48"/><path d="M91 420q27-82 54 0m-54 0q-17-50-35 0m602 0q31-108 62 0m-62 0q-21-58-42 0" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><rect x="72" y="426" width="670" height="8" fill="${ink}" opacity=".17"/>`,
    blueprint: `<rect width="800" height="520" fill="${ink}"/><path d="M0 42H800M0 102H800M0 162H800M0 222H800M0 282H800M0 342H800M0 402H800M0 462H800M42 0V520M102 0V520M162 0V520M222 0V520M282 0V520M342 0V520M402 0V520M462 0V520M522 0V520M582 0V520M642 0V520M702 0V520M762 0V520" stroke="${paper}" stroke-width="1" opacity=".09"/><path d="M178 373V222l187-108 187 108v151M240 373V254h94v119M405 373V254h94v119M178 222h374" fill="none" stroke="${paper}" stroke-width="8" stroke-linejoin="round"/><path d="m150 218 215-126 215 126M365 83V48M163 218h-33M576 218h43M205 402h321" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/><circle cx="668" cy="130" r="38" fill="${accent}" opacity=".85"/><path d="M668 108v44M646 130h44" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>`,
    interior: `<rect x="0" y="0" width="800" height="520" fill="${paper}"/><path d="M0 380 800 320V520H0Z" fill="${secondary}" opacity=".65"/><rect x="475" y="70" width="210" height="218" rx="7" fill="${ink}"/><rect x="491" y="87" width="178" height="184" fill="${paper}"/><path d="M580 87v184M491 179h178" stroke="${secondary}" stroke-width="8"/><circle cx="614" cy="130" r="29" fill="${accent}" opacity=".75"/><rect x="147" y="278" width="352" height="116" rx="27" fill="${ink}"/><rect x="174" y="246" width="302" height="79" rx="24" fill="${accent}"/><path d="M190 382v50m265-50v50" stroke="${ink}" stroke-width="13" stroke-linecap="round"/><rect x="115" y="425" width="407" height="16" rx="8" fill="${ink}" opacity=".2"/><path d="M83 350V205m0 0q-43 16-42 56 42 8 42-56Zm0 35q44 18 45 58-46 7-45-58Z" fill="${accent}"/><path d="M70 425h29" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>`,
    digital: `<rect x="104" y="70" width="592" height="367" rx="20" fill="${ink}"/><rect x="121" y="87" width="558" height="331" rx="11" fill="${paper}"/><rect x="121" y="87" width="124" height="331" rx="11" fill="${ink}"/><circle cx="158" cy="127" r="15" fill="${accent}"/><path d="M146 173h74M146 205h54M146 237h65M146 269h46" stroke="${paper}" stroke-width="8" stroke-linecap="round" opacity=".55"/><rect x="274" y="116" width="165" height="78" rx="10" fill="${secondary}"/><rect x="458" y="116" width="187" height="78" rx="10" fill="${accent}" opacity=".85"/><rect x="274" y="211" width="371" height="176" rx="12" fill="${paper}" stroke="${secondary}" stroke-width="4"/><path d="M304 348 361 304l48 20 74-70 63 36 57-54" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M304 366h312" stroke="${ink}" stroke-width="3" opacity=".18"/><circle cx="631" cy="113" r="8" fill="${accent}"/>`,
    health: `<rect width="800" height="520" fill="${paper}"/><circle cx="620" cy="129" r="80" fill="${secondary}" opacity=".55"/><rect x="168" y="95" width="450" height="330" rx="26" fill="#fff" stroke="${secondary}" stroke-width="7"/><rect x="207" y="132" width="122" height="122" rx="26" fill="${accent}"/><path d="M268 155v76m-38-38h76" stroke="${paper}" stroke-width="18" stroke-linecap="round"/><rect x="360" y="143" width="208" height="17" rx="8" fill="${ink}" opacity=".82"/><rect x="360" y="178" width="164" height="12" rx="6" fill="${secondary}"/><rect x="207" y="286" width="370" height="89" rx="16" fill="${paper}" stroke="${secondary}" stroke-width="4"/><circle cx="255" cy="330" r="20" fill="${accent}" opacity=".82"/><path d="M298 318h235M298 344h181" stroke="${ink}" stroke-width="9" stroke-linecap="round" opacity=".35"/><path d="M114 434h570" stroke="${ink}" stroke-width="8" stroke-linecap="round" opacity=".18"/>`,
    food: `<rect width="800" height="520" fill="${paper}"/><circle cx="400" cy="279" r="182" fill="${ink}" opacity=".09"/><circle cx="400" cy="270" r="154" fill="#fff" stroke="${secondary}" stroke-width="10"/><circle cx="400" cy="270" r="112" fill="${paper}"/><path d="M308 256q37-63 101-33 34 18 57 58-37 56-102 45-53-8-70-70Z" fill="${accent}"/><circle cx="351" cy="230" r="14" fill="${secondary}"/><circle cx="411" cy="227" r="16" fill="#86a77c"/><circle cx="459" cy="280" r="17" fill="${secondary}"/><path d="M330 309q44-22 89 0t83-5" fill="none" stroke="#86a77c" stroke-width="16" stroke-linecap="round"/><path d="M188 110q28-22 56 0m-29-24v53M556 119q27-19 54 0" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/><circle cx="208" cy="408" r="27" fill="${secondary}" opacity=".7"/><circle cx="594" cy="413" r="34" fill="${accent}" opacity=".7"/>`,
    fashion: `<rect width="800" height="520" fill="${paper}"/><rect x="89" y="70" width="622" height="385" rx="18" fill="#fff"/><path d="M400 101v63m0 0q-45-42-91-9l-95 83 62 54 49-35-24 150h198l-24-150 49 35 62-54-95-83q-46-33-91 9Z" fill="${accent}"/><path d="M354 172q46 39 92 0M327 276h146M311 323h178" stroke="${paper}" stroke-width="8" opacity=".78"/><path d="M185 430h430" stroke="${ink}" stroke-width="5" opacity=".15"/><circle cx="153" cy="115" r="24" fill="${secondary}"/><circle cx="647" cy="398" r="28" fill="${secondary}" opacity=".76"/>`,
    travel: `<rect width="800" height="520" fill="${paper}"/><circle cx="618" cy="114" r="66" fill="${accent}" opacity=".8"/><path d="M0 290q160-92 327 3t473-8v235H0Z" fill="${secondary}" opacity=".8"/><path d="M0 367q194-115 388-2t412-21v176H0Z" fill="${ink}" opacity=".78"/><path d="M70 437q115-28 198-112 71-70 156-67 85 3 132-78" fill="none" stroke="${paper}" stroke-width="9" stroke-dasharray="14 16" stroke-linecap="round"/><path d="M558 181c0-42 60-42 60 0 0 26-30 61-30 61s-30-35-30-61Z" fill="${accent}"/><circle cx="588" cy="181" r="10" fill="${paper}"/><path d="M105 105h104m-52-52v104" stroke="${ink}" stroke-width="5" opacity=".26"/>`,
    energy: `<rect width="800" height="520" fill="${paper}"/><circle cx="625" cy="115" r="74" fill="${accent}"/><path d="M0 329q170-66 339 0t461-18v209H0Z" fill="${secondary}" opacity=".7"/><path d="M84 345 312 266l113 51-228 84Zm252-26 228-80 112 48-228 82Z" fill="${ink}"/><path d="m124 342 180-63m-120 84 179-64m-76 84 179-64m-105 40 180-63m-80 84 179-64" stroke="${accent}" stroke-width="5" opacity=".9"/><path d="M0 427h800" stroke="${ink}" stroke-width="9" opacity=".28"/><path d="M625 29V3m0 224v-25M539 115h-27m226 0h-25m-158-60-18-18m154 155-18-18m0-119 18-18m-154 155 18-18" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>`,
    garden: `<rect width="800" height="520" fill="${paper}"/><path d="M0 357q199-73 405-3t395-28v194H0Z" fill="${secondary}" opacity=".7"/><path d="M0 418q170-70 350-3t450-39v144H0Z" fill="${ink}" opacity=".7"/><path d="M110 431V237m0 101q-68-8-73-71 66-12 73 71Zm0-49q71-11 79-78-70-15-79 78Zm163 74V198m0 144q-61-10-68-67 64-15 68 67Zm0-66q64-11 71-70-64-16-71 70Zm204 79V254m0 115q-57-8-62-62 58-14 62 62Zm0-55q61-10 70-67-65-12-70 67Z" fill="${accent}"/><circle cx="628" cy="149" r="53" fill="${paper}" opacity=".92"/><path d="M579 149h98M628 100v98" stroke="${accent}" stroke-width="8" opacity=".65"/>`,
    learning: `<rect width="800" height="520" fill="${paper}"/><rect x="148" y="95" width="502" height="318" rx="18" fill="#fff" stroke="${secondary}" stroke-width="7"/><path d="M400 142v222q-93-60-185-8V134q92-44 185 8Zm0 0v222q94-60 185-8V134q-92-44-185 8Z" fill="${accent}"/><path d="M251 194h111m-111 34h104m-104 35h98m88-69h111m-111 34h104m-104 35h98" stroke="${paper}" stroke-width="9" stroke-linecap="round" opacity=".8"/><path d="M115 433h570" stroke="${ink}" stroke-width="8" stroke-linecap="round" opacity=".18"/><circle cx="675" cy="119" r="36" fill="${secondary}"/><path d="m659 119 12 12 22-27" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
    business: `<rect width="800" height="520" fill="${paper}"/><rect x="129" y="87" width="542" height="344" rx="20" fill="#fff"/><rect x="167" y="126" width="210" height="25" rx="12" fill="${ink}" opacity=".84"/><rect x="167" y="174" width="286" height="13" rx="6" fill="${secondary}"/><rect x="167" y="201" width="236" height="13" rx="6" fill="${secondary}" opacity=".65"/><rect x="167" y="264" width="144" height="121" rx="12" fill="${paper}"/><path d="M193 355v-36m35 36v-64m35 64v-90m35 90v-48" stroke="${accent}" stroke-width="18" stroke-linecap="round"/><path d="M354 362 422 310l47 22 77-81 53 41" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="598" cy="166" r="32" fill="${accent}"/><path d="M583 166h30m-15-15v30" stroke="${paper}" stroke-width="6" stroke-linecap="round"/><path d="M356 381h232" stroke="${secondary}" stroke-width="4"/>`,
    creative: `<rect width="800" height="520" fill="${paper}"/><rect x="103" y="67" width="594" height="391" rx="20" fill="#fff"/><rect x="141" y="106" width="270" height="303" rx="6" fill="${ink}"/><circle cx="274" cy="234" r="89" fill="${accent}"/><path d="M185 311q91-133 179 0" fill="none" stroke="${paper}" stroke-width="20" stroke-linecap="round"/><path d="m267 142 17 74 69 19-69 17-17 72-17-72-69-17 69-19z" fill="${secondary}"/><rect x="445" y="106" width="211" height="140" rx="12" fill="${secondary}"/><rect x="445" y="266" width="97" height="143" rx="12" fill="${accent}"/><rect x="559" y="266" width="97" height="143" rx="12" fill="${paper}" stroke="${secondary}" stroke-width="4"/><path d="M464 130h173M463 157h120" stroke="${paper}" stroke-width="8" stroke-linecap="round" opacity=".6"/><circle cx="492" cy="338" r="26" fill="${paper}" opacity=".75"/>`,
    tools: `<rect width="800" height="520" fill="${paper}"/><rect x="113" y="269" width="574" height="171" rx="21" fill="${ink}"/><path d="M286 269v-66q0-24 24-24h177q24 0 24 24v66" fill="none" stroke="${ink}" stroke-width="22"/><rect x="156" y="305" width="488" height="82" rx="12" fill="${secondary}"/><circle cx="400" cy="345" r="18" fill="${accent}"/><path d="m231 190 74-74m-93 51 33 33m247-22 69-69m-47 2 42 42" stroke="${accent}" stroke-width="18" stroke-linecap="round"/><path d="M205 158l31 31m283-62 42 42" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><circle cx="603" cy="125" r="42" fill="${secondary}" opacity=".7"/>`,
    event: `<rect width="800" height="520" fill="${paper}"/><circle cx="650" cy="123" r="65" fill="${secondary}" opacity=".65"/><path d="M0 367q190-71 401-5t399-36v194H0Z" fill="${secondary}" opacity=".4"/><rect x="132" y="272" width="536" height="105" rx="13" fill="#fff"/><path d="M174 377v57m451-57v57" stroke="${ink}" stroke-width="13" stroke-linecap="round"/><path d="M208 285q-10-82 30-118 43 31 28 118m79 0q-6-109 40-148 41 45 24 148m73 0q6-78 45-111 37 30 25 111" fill="${accent}"/><circle cx="238" cy="169" r="17" fill="${secondary}"/><circle cx="388" cy="136" r="17" fill="${secondary}"/><circle cx="526" cy="173" r="17" fill="${secondary}"/><rect x="204" y="306" width="392" height="23" rx="11" fill="${secondary}" opacity=".46"/><path d="M220 349h176" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>`,
    audio: `<rect width="800" height="520" fill="${paper}"/><rect x="137" y="81" width="526" height="358" rx="24" fill="${ink}"/><rect x="166" y="110" width="468" height="300" rx="14" fill="${paper}"/><path d="M215 260h34l18-73 34 145 30-109 32 69 27-105 32 149 32-87 30 39h77" fill="none" stroke="${accent}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><circle cx="400" cy="160" r="28" fill="${secondary}"/><path d="M400 188v83m-45-36v19a45 45 0 0 0 90 0v-19" fill="none" stroke="${ink}" stroke-width="12" stroke-linecap="round"/><path d="M283 359h234" stroke="${ink}" stroke-width="9" stroke-linecap="round" opacity=".2"/>`,
    mobility: `<rect width="800" height="520" fill="${paper}"/><path d="M0 369q200-76 408-7t392-25v183H0Z" fill="${secondary}" opacity=".5"/><path d="M0 430h800" stroke="${ink}" stroke-width="12" opacity=".22"/><path d="m184 321 47-94h239l69 94 58 22v69H140v-67z" fill="${accent}"/><path d="M258 246h144v73H221zM420 246h44l55 73H420z" fill="${paper}"/><circle cx="252" cy="409" r="34" fill="${ink}"/><circle cx="520" cy="409" r="34" fill="${ink}"/><circle cx="252" cy="409" r="15" fill="${secondary}"/><circle cx="520" cy="409" r="15" fill="${secondary}"/><path d="M89 143h102v66H89zM108 143v-24h65v24" fill="${secondary}"/><path d="M125 164h31" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`,
    community: `<rect width="800" height="520" fill="${paper}"/><path d="M95 393h610" stroke="${ink}" stroke-width="9" stroke-linecap="round" opacity=".2"/><circle cx="280" cy="188" r="54" fill="${accent}"/><circle cx="407" cy="164" r="62" fill="${secondary}"/><circle cx="536" cy="190" r="52" fill="${ink}"/><path d="M198 380q5-132 82-132t82 132m-9 0q8-160 93-160t90 160m-1 0q6-128 82-128t82 128" fill="${accent}" opacity=".68"/><path d="M397 351v-72m0 32q-50-5-56-47 51-7 56 47Zm0-28q49-7 56-48-50-8-56 48Z" fill="${paper}"/><circle cx="397" cy="266" r="14" fill="${accent}"/>`
  }[scene];
  const gradientId = `g-${key.replace(/[^a-z0-9-]/gi,'-')}`;
  const glowX = 120 + (seed % 560);
  const glowY = 40 + ((seed >>> 10) % 170);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" role="img" aria-label="Original vector sample artwork for ${key.replace(/&/g,'&amp;')}">\n<defs><linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${paper}"/><stop offset="1" stop-color="${secondary}" stop-opacity=".46"/></linearGradient><pattern id="grain" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="${ink}" opacity=".055"/></pattern></defs>\n<rect width="800" height="520" rx="28" fill="url(#${gradientId})"/><circle cx="${glowX}" cy="${glowY}" r="156" fill="${accent}" opacity=".075"/><rect width="800" height="520" rx="28" fill="url(#grain)"/>\n<g stroke-linecap="round" stroke-linejoin="round">${art}</g>\n<path d="M0 491q205-30 412 0t388-4" fill="none" stroke="${accent}" stroke-width="3" opacity=".35"/>\n</svg>\n`;
}
for (const key of arts) {
  fs.writeFileSync(path.join(outDir, `${key}.svg`), svgFor(key));
}
console.log(`Generated ${arts.length} original local SVG illustrations in ${path.relative(root, outDir)}/`);
