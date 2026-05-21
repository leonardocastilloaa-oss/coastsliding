import { EmailMessage } from "cloudflare:email";

const PRIMARY_HOST = 'coastslide.com';
const OLD_HOSTS = new Set(['coastsliding.com', 'www.coastsliding.com', 'www.coastslide.com']);
const CONTACT_EMAIL = 'coastsliding@gmail.com';
const FROM_EMAIL = 'forms@coastslide.com';
const PHONE_DISPLAY = '(786) 659-3290';
const PHONE_SMS = '+17866593290';
const PHOTO_EXTENSIONS = ['avif', 'webp', 'jpg', 'jpeg', 'png', 'AVIF', 'WEBP', 'JPG', 'JPEG', 'PNG'];
const PHOTO_DIRS = ['images', 'imagenes'];
const OPTIMIZED_PHOTO_NUMBERS = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
const REGION_PHOTO_ALTS = /Miami-Dade sliding door repair|Broward County sliding door repair|Palm Beach luxury door repair/i;
const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2211%22 viewBox=%220 0 16 11%22%3E%3Crect width=%2216%22 height=%2211%22 fill=%22%23EBF5FC%22/%3E%3C/svg%3E';

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
  [/\['miami', 'broward', 'palm', 'keys'\]/g, "['miami', 'broward', 'palm']"],
  [/<option>Florida Keys<\/option>/g, ''],
  [/Miami-Dade, Broward, Palm Beach and the Florida Keys/g, 'Miami-Dade, Broward and Palm Beach']
];

const HTML_FIXES = `<style id="cs-worker-performance-fixes">
img.cs-lazy-img{background:#EBF5FC;transition:filter .25s ease,opacity .25s ease}.svc-img img.cs-lazy-img,.ps-cell img.cs-lazy-img{filter:blur(5px);opacity:.72}.svc-img img.cs-lazy-img.cs-loaded,.ps-cell img.cs-lazy-img.cs-loaded{filter:none;opacity:1}.photo-strip{grid-template-columns:repeat(3,minmax(0,1fr))!important}.rp-photo img,.rp-photo-overlay{display:none!important}@media(max-width:768px){.photo-strip{grid-template-columns:1fr!important}.ps-cell{aspect-ratio:16/10!important}}
</style>
<script id="cs-worker-performance-script">
(function(){function load(img){if(!img||!img.dataset.src)return;img.src=img.dataset.src;img.removeAttribute('data-src');img.addEventListener('load',function(){img.classList.add('cs-loaded')},{once:true})}function init(){var imgs=[].slice.call(document.querySelectorAll('img[data-src]'));if(!imgs.length)return;if('IntersectionObserver'in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){load(entry.target);io.unobserve(entry.target)}})},{rootMargin:'650px 0px',threshold:.01});imgs.forEach(function(img){io.observe(img)})}else imgs.forEach(load)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
</script>`;

function shouldRewrite(contentType) {
  return /text\/html/i.test(contentType || '');
}

function clean(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 1200);
}

function slug(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function unique(list) {
  const seen = new Set();
  return list.filter((item) => item && !seen.has(item) && seen.add(item));
}

function firstFormValue(form, names) {
  for (const name of names) {
    const value = clean(form.get(name));
    if (value) return value;
  }
  return '';
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*'
    }
  });
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
}

async function withTimeout(promise, ms) {
  return Promise.race([promise, timeout(ms)]);
}

function assetUrl(request, path) {
  const url = new URL(request.url);
  url.pathname = '/' + path.replace(/^\/+/, '');
  url.search = '';
  return url;
}

async function assetLooksReal(env, request, path) {
  const response = await env.ASSETS.fetch(new Request(assetUrl(request, path), request));
  if (!response.ok) return false;
  const type = (response.headers.get('content-type') || '').toLowerCase();
  if (type.includes('text/html') || type.includes('svg')) return false;
  const size = Number(response.headers.get('content-length') || 0);
  return !size || size >= 1024;
}

function photoCandidates(src, alt) {
  const match = src.match(/(?:^|\/)(?:images|imagenes)\/([^\/]+?)\.(?:jpg|jpeg|png|webp|avif)(?:\?.*)?$/i);
  if (!match) return [];
  const rawName = match[1];
  const number = (rawName.match(/^\d+/) || [rawName])[0];
  const names = unique([number, rawName, slug(alt)]);
  const paths = [];
  for (const dir of PHOTO_DIRS) for (const name of names) for (const ext of PHOTO_EXTENSIONS) paths.push(`${dir}/${name}.${ext}`);
  return unique(paths);
}

async function resolvePhotoSrc(env, request, src, alt) {
  for (const path of photoCandidates(src, alt)) {
    if (await assetLooksReal(env, request, path)) return '/' + path;
  }
  return src.replace(/^\.\//, '/');
}

function photoNumber(src) {
  const match = src.match(/(?:^|\/)images\/(\d+)\.(?:jpg|jpeg|png|webp|avif)/i);
  return match ? match[1] : '';
}

function optimizedImageSrc(src, number) {
  const cleanSrc = src.split('?')[0].replace(/^\.\//, '').replace(/^\//, '');
  if (!number || !OPTIMIZED_PHOTO_NUMBERS.has(number)) return '/' + cleanSrc;
  const width = number === '1' ? 1200 : (['4', '8'].includes(number) ? 760 : 820);
  return `/cdn-cgi/image/width=${width},quality=68,format=auto/${cleanSrc}`;
}

function attrValue(attrs, name) {
  const match = attrs.match(new RegExp('\\b' + name + '=(["\\'])(.*?)\\1', 'i'));
  return match ? match[2] : '';
}

function removeAttr(attrs, name) {
  return attrs.replace(new RegExp('\\s*' + name + '=(["\\']).*?\\1', 'ig'), '');
}

async function rewriteImageSources(html, env, request) {
  const imgPattern = /<img\b([^>]*?)\bsrc=(['"])(.*?)\2([^>]*)>/gi;
  const matches = [...html.matchAll(imgPattern)];
  let rewritten = html;
  for (const match of matches) {
    const full = match[0];
    const src = match[3];
    const attrs = `${match[1]} ${match[4]}`;
    const alt = attrValue(attrs, 'alt');
    if (REGION_PHOTO_ALTS.test(alt)) {
      rewritten = rewritten.replace(full, '');
      continue;
    }
    if (!/(?:^|\/)images\//i.test(src.replace(/^\.\//, ''))) continue;
    const resolved = await resolvePhotoSrc(env, request, src, alt);
    const number = photoNumber(resolved);
    if (!number || !OPTIMIZED_PHOTO_NUMBERS.has(number)) continue;
    const optimized = optimizedImageSrc(resolved, number);
    let nextAttrs = attrs;
    nextAttrs = removeAttr(nextAttrs, 'src');
    nextAttrs = removeAttr(nextAttrs, 'loading');
    nextAttrs = removeAttr(nextAttrs, 'decoding');
    nextAttrs = removeAttr(nextAttrs, 'sizes');
    nextAttrs = removeAttr(nextAttrs, 'data-src');
    nextAttrs = removeAttr(nextAttrs, 'class');
    const eager = number === '1';
    const className = eager ? '' : ' class="cs-lazy-img"';
    const srcPart = eager ? `src="${optimized}" loading="eager" fetchpriority="high"` : `src="${PLACEHOLDER}" data-src="${optimized}" loading="lazy"`;
    const sizePart = `decoding="async" sizes="(max-width: 768px) 92vw, 370px"`;
    const updated = `<img${className} ${srcPart} ${sizePart}${nextAttrs}>`;
    rewritten = rewritten.replace(full, updated);
  }
  return rewritten;
}

function hardenForms(html) {
  return html.replace(/<form\b([^>]*)>/gi, (full, attrs) => {
    const next = attrs.replace(/\saction=(['"]).*?\1/i, '').replace(/\smethod=(['"]).*?\1/i, '').replace(/\saccept-charset=(['"]).*?\1/i, '');
    return `<form${next} action="/api/contact" method="post" accept-charset="UTF-8">`;
  });
}

async function normalizeHtml(text, env, request) {
  let value = REPLACEMENTS.reduce((current, pair) => current.replace(pair[0], pair[1]), text);
  value = value.replace(/<img\b[^>]*\balt=["'][^"']*(?:Miami-Dade sliding door repair|Broward County sliding door repair|Palm Beach luxury door repair)[^"']*["'][^>]*>/gi, '');
  value = await rewriteImageSources(value, env, request);
  value = hardenForms(value);
  if (!value.includes('cs-worker-performance-fixes')) value = value.replace('</head>', HTML_FIXES + '</head>');
  return value;
}

async function parseForm(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    const data = await request.json();
    return { get: (name) => data[name] };
  }
  if (type.includes('application/x-www-form-urlencoded')) {
    const data = new URLSearchParams(await request.text());
    return { get: (name) => data.get(name) };
  }
  return request.formData();
}

function buildLead(form, request) {
  return {
    name: firstFormValue(form, ['name', 'full_name', 'home-name', 'contact-name', 'cs-field-0-0', 'cs-field-1-0']),
    phone: firstFormValue(form, ['phone', 'tel', 'phone_number', 'home-phone', 'contact-phone', 'cs-field-0-1', 'cs-field-1-1']),
    email: firstFormValue(form, ['email', 'mail', 'home-email', 'contact-email', 'cs-field-0-2', 'cs-field-1-2']),
    area: firstFormValue(form, ['area', 'county', 'city', 'service_area', 'home-county', 'contact-area', 'cs-field-0-3', 'cs-field-1-3']),
    problem: firstFormValue(form, ['problem', 'repair', 'issue', 'service', 'home-repair', 'contact-problem', 'cs-field-0-4', 'cs-field-1-4']),
    details: firstFormValue(form, ['details', 'message', 'notes', 'home-details', 'contact-details', 'cs-field-0-5', 'cs-field-1-5']),
    source: firstFormValue(form, ['source_page']) || request.headers.get('referer') || 'Direct website form'
  };
}

function leadBody(lead) {
  return ['New CoastSlide contact request', '', 'Name: ' + lead.name, 'Phone: ' + lead.phone, 'Email: ' + lead.email, 'City or Area: ' + (lead.area || 'Not provided'), 'Type of Problem: ' + lead.problem, 'Details: ' + (lead.details || 'Not provided'), 'Source Page: ' + lead.source].join('\n');
}

function emailRaw(lead) {
  const safeReply = clean(lead.email).replace(/[<>]/g, '');
  return ['From: CoastSlide Website <' + FROM_EMAIL + '>', 'To: CoastSlide Leads <' + CONTACT_EMAIL + '>', 'Reply-To: ' + safeReply, 'Subject: New CoastSlide Contact Request', 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: 8bit', '', leadBody(lead)].join('\r\n');
}

async function sendLeadWithCloudflare(lead, env) {
  if (!env.LEAD_EMAIL || typeof env.LEAD_EMAIL.send !== 'function') return { ok: false, skipped: true };
  await withTimeout(env.LEAD_EMAIL.send(new EmailMessage(FROM_EMAIL, CONTACT_EMAIL, emailRaw(lead))), 8500);
  return { ok: true, method: 'cloudflare_email' };
}

async function sendLeadWithFormSubmit(lead) {
  const payload = { _subject: 'New CoastSlide Contact Request', _template: 'table', _captcha: 'false', _replyto: lead.email, name: lead.name, phone: lead.phone, email: lead.email, area: lead.area || 'Not provided', problem: lead.problem, details: lead.details || 'Not provided', message: leadBody(lead), source_page: lead.source };
  const response = await withTimeout(fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }), 8500);
  let result = {};
  try { result = await response.json(); } catch (error) { result = {}; }
  return { ok: response.ok && String(result.success).toLowerCase() === 'true', message: clean(result.message) };
}

async function handleContact(request, env) {
  if (request.method === 'OPTIONS') return json({ ok: true });
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);
  const form = await parseForm(request);
  if (clean(form.get('company'))) return json({ ok: true, skipped: 'bot_field' });
  const lead = buildLead(form, request);
  if (!lead.name || !lead.phone || !lead.email || !lead.problem) return json({ ok: false, error: 'missing_required_fields', message: 'Please complete name, phone, email and type of problem.' }, 400);
  try {
    const cloudflareDelivery = await sendLeadWithCloudflare(lead, env);
    if (cloudflareDelivery.ok) return json({ ok: true, delivery: 'cloudflare_email' });
  } catch (error) {
    console.log('Cloudflare Email failed:', error && error.message ? error.message : error);
  }
  try {
    const fallback = await sendLeadWithFormSubmit(lead);
    if (fallback.ok) return json({ ok: true, delivery: 'formsubmit_fallback' });
    return json({ ok: false, error: 'email_delivery_failed', message: fallback.message || 'Email delivery failed.' }, 502);
  } catch (error) {
    return json({ ok: false, error: error && error.message === 'timeout' ? 'email_delivery_timeout' : 'email_delivery_failed', message: 'Email delivery failed.' }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (OLD_HOSTS.has(url.hostname)) {
      url.hostname = PRIMARY_HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === '/api/contact') return handleContact(request, env);
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!shouldRewrite(contentType)) return response;
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    headers.set('cache-control', 'public, max-age=300, must-revalidate');
    return new Response(await normalizeHtml(await response.text(), env, request), { status: response.status, statusText: response.statusText, headers });
  }
};
