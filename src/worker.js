const PRIMARY_HOST = 'coastslide.com';
const OLD_HOSTS = new Set(['coastsliding.com', 'www.coastsliding.com', 'www.coastslide.com']);
const CONTACT_EMAIL = 'coastsliding@gmail.com';

const REPLACEMENTS = [
  [/https:\/\/coastsliding\.com/g, 'https://coastslide.com'],
  [/http:\/\/coastsliding\.com/g, 'https://coastslide.com'],
  [/www\.coastsliding\.com/g, 'coastslide.com'],
  [/coastsliding\.com/g, 'coastslide.com'],
  [/\+1-305-555-7543/g, '+17866593290'],
  [/\+13055557543/g, '+17866593290'],
  [/13055557543/g, '17866593290'],
  [/3055557543/g, '17866593290'],
  [/\(305\) 555-7543/g, '(786) 659-3290'],
  [/\(954\) 555-7543/g, '(786) 659-3290'],
  [/\(561\) 555-7543/g, '(786) 659-3290'],
  [/305-555-7543/g, '786-659-3290'],
  [/954-555-7543/g, '786-659-3290'],
  [/561-555-7543/g, '786-659-3290'],
  [/305\.555\.7543/g, '786.659.3290'],
  [/\s*link\('pages\/florida-keys\.html', 'Florida Keys'\) \+/g, ''],
  [/\s*mob\('pages\/florida-keys\.html', 'Florida Keys'\) \+/g, ''],
  [/var extensions = \['avif', 'webp', 'png', 'jpeg', 'jpg', 'AVIF', 'WEBP', 'PNG', 'JPEG', 'JPG'\];/g,
    "var extensions = ['AVIF', 'WEBP', 'PNG', 'JPEG', 'JPG', 'avif', 'webp', 'png', 'jpeg', 'jpg'];"],
  [/\['miami', 'broward', 'palm', 'keys'\]/g, "['miami', 'broward', 'palm']"],
  [/<option>Florida Keys<\/option>/g, ''],
  [/Miami-Dade, Broward, Palm Beach and the Florida Keys/g, 'Miami-Dade, Broward and Palm Beach'],
  [/Miami-Dade, Broward, and Palm Beach counties from Homestead to Jupiter — plus the Florida Keys/g, 'Miami-Dade, Broward and Palm Beach counties from Homestead to Jupiter']
];

const DESIGN_FIX_CSS = `
<style id="cs-worker-fixes">
.photo-strip{grid-template-columns:repeat(3,minmax(0,1fr))!important;max-width:1180px;margin:0 auto;background:#fff;box-shadow:0 2px 12px rgba(11,98,141,.12)}
.ps-cell{aspect-ratio:16/11!important;min-height:230px;background:linear-gradient(135deg,#EBF5FC,#fff)}
.ps-cell img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;filter:brightness(.86)!important}
.ps-cell:hover img{filter:brightness(1)!important}
.ps-label{padding:18px!important;background:linear-gradient(180deg,transparent 0%,rgba(4,47,73,.92) 100%)!important}
.ps-title{font-size:15px!important;color:#fff!important}.ps-sub{font-size:12px!important;color:rgba(255,255,255,.86)!important}
.region-tabs{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px;align-items:center}.rtab{min-height:44px;white-space:nowrap}
.rpanel.active{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr);align-items:stretch;border-radius:14px!important;overflow:hidden!important}
.rp-photo{min-height:520px;background:linear-gradient(145deg,#073F5F,#0B628D 58%,#087D87)!important}.rp-photo img{display:block!important;opacity:1!important;visibility:visible!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;filter:brightness(.72) saturate(1.05)!important}.rp-photo-overlay{background:linear-gradient(160deg,rgba(4,47,73,.84) 0%,rgba(8,125,135,.42) 100%)!important}.rp-photo-content{justify-content:flex-end!important;padding:44px 38px!important}.rp-stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px!important}.rp-stat{min-width:0;padding:14px 12px!important;background:rgba(0,29,49,.48)!important;border-color:rgba(255,255,255,.34)!important}.rp-stat-n{font-size:clamp(18px,1.8vw,22px)!important;line-height:1.05!important;white-space:nowrap;color:#fff!important;text-shadow:0 2px 8px rgba(0,0,0,.35)}.rp-stat-l{font-size:9px!important;line-height:1.25!important;color:#fff!important;opacity:.94!important;letter-spacing:.7px;overflow-wrap:anywhere}.rp-tag,.rp-city{color:#fff!important;text-shadow:0 1px 5px rgba(0,0,0,.32)}.rp-city{background:rgba(255,255,255,.18)!important;border-color:rgba(255,255,255,.32)!important}
.contact-info-phones{gap:12px}.phone-card{min-width:0;overflow:hidden;align-items:center}.phone-card>div:last-child{min-width:0;flex:1}.pc-area{color:#355064!important;line-height:1.25;letter-spacing:1px;white-space:normal}.pc-num{font-size:clamp(17px,2.2vw,20px);line-height:1.15;white-space:nowrap;color:#0f2230!important}.btn-wa .pc-area,.btn-wa .pc-num{color:#fff!important}
@media(max-width:1024px){.rpanel.active{grid-template-columns:1fr}.rp-photo{min-height:380px}.photo-strip{grid-template-columns:1fr!important}.ps-cell{aspect-ratio:16/10!important}}@media(max-width:768px){.photo-strip .ps-cell:nth-child(3){display:block!important}.rp-photo-content{padding:30px 22px!important}.rp-stats{grid-template-columns:1fr 1fr!important}}@media(max-width:520px){.rp-stats{grid-template-columns:1fr!important}.rp-stat-n{white-space:normal}.region-tabs{gap:8px}.rtab{flex:1 1 100%;justify-content:center}}
</style>
<script id="cs-photo-fixes">
(function(){
  var exts=['AVIF','WEBP','PNG','JPEG','JPG','avif','webp','png','jpeg','jpg'];
  var memo={};
  function head(url){if(!memo[url]) memo[url]=fetch(url,{method:'HEAD',cache:'no-store'}).then(function(r){if(!r.ok)return false;var len=parseInt(r.headers.get('content-length')||'0',10);var type=(r.headers.get('content-type')||'').toLowerCase();if(type.indexOf('svg')>-1)return false;if(len&&len<4096)return false;return true;}).catch(function(){return false});return memo[url];}
  function fix(){document.querySelectorAll('img[src*=\"/images/\"],img[src*=\"images/\"]').forEach(function(img){var src=img.getAttribute('src')||'';var m=src.match(/^(.*\/images\/)(\d+)\.(?:jpg|jpeg|png|webp|avif)(\?.*)?$/i);if(!m)return;var base=m[1],num=m[2];(async function(){for(var i=0;i<exts.length;i++){var next=base+num+'.'+exts[i];if(await head(next)){if(img.src.indexOf(next)===-1)img.src=next+'?v=coastslide-photos';return;}}})();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();setTimeout(fix,400);setTimeout(fix,1400);
})();
</script>`;

function normalizeText(text, contentType = '') {
  let value = REPLACEMENTS.reduce((current, pair) => current.replace(pair[0], pair[1]), text);
  if (/text\/css/i.test(contentType)) {
    value = value
      .replace(/\.photo-strip\{display:grid;grid-template-columns:repeat\(4,1fr\);/g, '.photo-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));')
      .replace(/\.rp-photo img\{display:none!important\}/g, '.rp-photo img{display:block!important;opacity:1!important;visibility:visible!important}')
      .replace(/\.ps-cell\{position:relative;overflow:hidden;aspect-ratio:3\/4\}/g, '.ps-cell{position:relative;overflow:hidden;aspect-ratio:16/11;min-height:230px}');
  }
  if (/text\/html/i.test(contentType) && !value.includes('cs-worker-fixes')) {
    value = value.replace('</head>', DESIGN_FIX_CSS + '</head>');
  }
  return value;
}

function shouldRewrite(contentType) {
  return /text\/html|text\/css|application\/javascript|text\/javascript|application\/json|text\/plain|application\/xml|text\/xml/i.test(contentType || '');
}

function clean(value) { return String(value || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 1200); }
function firstFormValue(form, names) { for (const name of names) { const value = clean(form.get(name)); if (value) return value; } return ''; }
function json(body, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'access-control-allow-origin': '*' } }); }

function buildLead(form, request) {
  return {
    name: firstFormValue(form, ['name', 'home-name', 'contact-name', 'cs-field-0-0', 'cs-field-1-0']),
    phone: firstFormValue(form, ['phone', 'home-phone', 'contact-phone', 'cs-field-0-1', 'cs-field-1-1']),
    email: firstFormValue(form, ['email', 'home-email', 'contact-email', 'cs-field-0-2', 'cs-field-1-2']),
    area: firstFormValue(form, ['area', 'county', 'city', 'home-county', 'contact-area', 'cs-field-0-3', 'cs-field-1-3']),
    problem: firstFormValue(form, ['problem', 'repair', 'issue', 'home-repair', 'contact-problem', 'cs-field-0-4', 'cs-field-1-4']),
    details: firstFormValue(form, ['details', 'message', 'notes', 'home-details', 'contact-details', 'cs-field-0-5', 'cs-field-1-5']),
    source: request.headers.get('referer') || 'Direct website form'
  };
}

function leadBody(lead) {
  return ['New CoastSlide contact request', '', 'Name: ' + lead.name, 'Phone: ' + lead.phone, 'Email: ' + lead.email, 'City or Area: ' + (lead.area || 'Not provided'), 'Type of Problem: ' + lead.problem, 'Details: ' + (lead.details || 'Not provided'), 'Source Page: ' + lead.source].join('\n');
}

async function sendLeadWithFormSubmit(lead) {
  const payload = { _subject: 'New CoastSlide Contact Request', _template: 'table', _captcha: 'false', _replyto: lead.email, name: lead.name, phone: lead.phone, email: lead.email, area: lead.area || 'Not provided', problem: lead.problem, details: lead.details || 'Not provided', message: leadBody(lead), source_page: lead.source };
  const response = await fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  let result = {}; try { result = await response.json(); } catch (error) { result = { success: String(response.ok), message: 'No JSON response from email service' }; }
  return { ok: response.ok && String(result.success).toLowerCase() === 'true', status: response.status, result };
}

async function handleContact(request) {
  if (request.method === 'OPTIONS') return json({ ok: true });
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);
  const form = await request.formData();
  if (clean(form.get('company'))) return json({ ok: true });
  const lead = buildLead(form, request);
  if (!lead.name || !lead.phone || !lead.email || !lead.problem) return json({ ok: false, error: 'missing_required_fields' }, 400);
  const delivery = await sendLeadWithFormSubmit(lead);
  if (delivery.ok) return json({ ok: true, delivery: 'formsubmit' });
  const message = clean(delivery.result && delivery.result.message);
  const activationRequired = /activation/i.test(message);
  return json({ ok: false, error: activationRequired ? 'activation_required' : 'email_delivery_failed', message: activationRequired ? 'The email form needs one-time activation.' : 'Email delivery failed.' }, activationRequired ? 503 : 502);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (OLD_HOSTS.has(url.hostname)) { url.hostname = PRIMARY_HOST; url.protocol = 'https:'; return Response.redirect(url.toString(), 301); }
    if (url.pathname === '/api/contact') return handleContact(request);
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!shouldRewrite(contentType)) return response;
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    headers.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
    return new Response(normalizeText(await response.text(), contentType), { status: response.status, statusText: response.statusText, headers });
  }
};
