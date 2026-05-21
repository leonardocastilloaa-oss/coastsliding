import { EmailMessage } from "cloudflare:email";

const PRIMARY_HOST = 'coastslide.com';
const OLD_HOSTS = new Set(['coastsliding.com', 'www.coastsliding.com', 'www.coastslide.com']);
const CONTACT_EMAIL = 'coastsliding@gmail.com';
const FROM_EMAIL = 'forms@coastslide.com';
const PHONE_DISPLAY = '(786) 659-3290';
const PHONE_TEL = '+17866593290';
const PHONE_WA = '17866593290';

function clean(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 1200);
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

function firstFormValue(form, names) {
  for (const name of names) {
    const value = clean(form.get(name));
    if (value) return value;
  }
  return '';
}

function leadBody(lead) {
  return [
    'New CoastSlide contact request', '',
    'Name: ' + lead.name,
    'Phone: ' + lead.phone,
    'Email: ' + lead.email,
    'City or Area: ' + (lead.area || 'Not provided'),
    'Type of Problem: ' + lead.problem,
    'Details: ' + (lead.details || 'Not provided'),
    'Source Page: ' + lead.source
  ].join('\n');
}

function emailRaw(lead) {
  const safeReply = clean(lead.email).replace(/[<>]/g, '');
  return [
    'From: CoastSlide Website <' + FROM_EMAIL + '>',
    'To: CoastSlide Leads <' + CONTACT_EMAIL + '>',
    'Reply-To: ' + safeReply,
    'Subject: New CoastSlide Contact Request',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit', '',
    leadBody(lead)
  ].join('\r\n');
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
}

function withTimeout(promise, ms) {
  return Promise.race([promise, timeout(ms)]);
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

async function sendLeadWithCloudflare(lead, env) {
  if (!env.LEAD_EMAIL || typeof env.LEAD_EMAIL.send !== 'function') return false;
  await withTimeout(env.LEAD_EMAIL.send(new EmailMessage(FROM_EMAIL, CONTACT_EMAIL, emailRaw(lead))), 8500);
  return true;
}

async function sendLeadWithFormSubmit(lead) {
  const payload = {
    _subject: 'New CoastSlide Contact Request',
    _template: 'table',
    _captcha: 'false',
    _replyto: lead.email,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    area: lead.area || 'Not provided',
    problem: lead.problem,
    details: lead.details || 'Not provided',
    message: leadBody(lead),
    source_page: lead.source
  };
  const response = await withTimeout(fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }), 8500);
  let result = {};
  try { result = await response.json(); } catch (error) { result = {}; }
  return response.ok && String(result.success).toLowerCase() === 'true';
}

async function handleContact(request, env) {
  if (request.method === 'OPTIONS') return json({ ok: true });
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  const form = await parseForm(request);
  if (clean(form.get('company'))) return json({ ok: true, skipped: 'bot_field' });

  const lead = buildLead(form, request);
  if (!lead.name || !lead.phone || !lead.email || !lead.problem) {
    return json({ ok: false, error: 'missing_required_fields', message: 'Please complete name, phone, email and type of problem.' }, 400);
  }

  try {
    if (await sendLeadWithCloudflare(lead, env)) return json({ ok: true, delivery: 'cloudflare_email' });
  } catch (error) {
    console.log('Cloudflare Email failed:', error && error.message ? error.message : error);
  }

  try {
    if (await sendLeadWithFormSubmit(lead)) return json({ ok: true, delivery: 'formsubmit_fallback' });
  } catch (error) {
    console.log('FormSubmit failed:', error && error.message ? error.message : error);
  }

  return json({ ok: false, error: 'email_delivery_failed', message: 'Email delivery failed.' }, 502);
}

function hardenForms(html) {
  return html.replace(/<form\b([^>]*)>/gi, (full, attrs) => {
    const next = attrs
      .replace(/\saction=(['"]).*?\1/i, '')
      .replace(/\smethod=(['"]).*?\1/i, '')
      .replace(/\saccept-charset=(['"]).*?\1/i, '');
    return `<form${next} action="/api/contact" method="post" accept-charset="UTF-8">`;
  });
}

function singleContactPhoneBlock() {
  return '<div class="contact-info-phones contact-one-number" style="display:grid;gap:14px;max-width:540px">' +
    '<a href="tel:' + PHONE_TEL + '" class="phone-card contact-main-phone" style="display:block;padding:22px;border:1px solid #B8D6ED;border-radius:14px;background:#fff;box-shadow:0 8px 28px rgba(11,98,141,.10);text-decoration:none">' +
      '<div><div class="pc-area" style="color:#084F73;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;font-size:12px">One Number for South Florida</div>' +
      '<div class="pc-num" style="font-size:clamp(28px,4vw,40px);line-height:1.1;font-weight:950;color:#073F5F;margin:7px 0 6px">' + PHONE_DISPLAY + '</div>' +
      '<div class="pc-note" style="color:#2D4B60;font-size:14px;line-height:1.55">Miami-Dade, Broward and Palm Beach. Call, text or WhatsApp the same number for every service area.</div></div>' +
    '</a>' +
    '<div class="contact-quick-actions" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">' +
      '<a href="tel:' + PHONE_TEL + '" class="btn btn-blue" style="justify-content:center;padding:13px 10px;text-align:center">Call Now</a>' +
      '<a href="sms:' + PHONE_TEL + '" class="btn btn-outline" style="justify-content:center;padding:13px 10px;text-align:center">Text Us</a>' +
      '<a href="https://wa.me/' + PHONE_WA + '" class="btn btn-wa" target="_blank" rel="noopener" style="justify-content:center;padding:13px 10px;text-align:center;color:#fff!important">WhatsApp</a>' +
    '</div>' +
  '</div>';
}

function simplifyContactPhones(html) {
  return html.replace(/<div class="contact-info-phones">[\s\S]*?<div class="form-wrap">/i, singleContactPhoneBlock() + '</div><div class="form-wrap">');
}

function normalizeHtml(html) {
  let value = html
    .replace(/https:\/\/coastsliding\.com/g, 'https://coastslide.com')
    .replace(/http:\/\/coastsliding\.com/g, 'https://coastslide.com')
    .replace(/www\.coastsliding\.com/g, 'coastslide.com')
    .replace(/coastsliding\.com/g, 'coastslide.com')
    .replace(/\+1-305-555-7543/g, '+17866593290')
    .replace(/\+13055557543/g, '+17866593290')
    .replace(/13055557543/g, '17866593290')
    .replace(/3055557543/g, '17866593290')
    .replace(/\(305\) 555-7543/g, PHONE_DISPLAY)
    .replace(/\(954\) 555-7543/g, PHONE_DISPLAY)
    .replace(/\(561\) 555-7543/g, PHONE_DISPLAY)
    .replace(/305-555-7543/g, '786-659-3290')
    .replace(/954-555-7543/g, '786-659-3290')
    .replace(/561-555-7543/g, '786-659-3290')
    .replace(/\/cdn-cgi\/image\/[^"'\s>]+\/images\//g, '/images/')
    .replace(/\s*link\('pages\/florida-keys\.html', 'Florida Keys'\) \+/g, '')
    .replace(/\s*mob\('pages\/florida-keys\.html', 'Florida Keys'\) \+/g, '')
    .replace(/\['miami', 'broward', 'palm', 'keys'\]/g, "['miami', 'broward', 'palm']")
    .replace(/<option>Florida Keys<\/option>/g, '')
    .replace(/Miami-Dade, Broward, Palm Beach and the Florida Keys/g, 'Miami-Dade, Broward and Palm Beach');

  value = value.replace(/<img\b[^>]*\balt=["'][^"']*(?:Miami-Dade sliding door repair|Broward County sliding door repair|Palm Beach luxury door repair)[^"']*["'][^>]*>/gi, '');
  value = value.replace(/src="data:image\/svg\+xml,[^"]+"\s+data-src="([^"]+)"/g, 'src="$1"');
  value = value.replace(/\sdata-src="[^"]+"/g, '');
  value = value.replace(/class="cs-lazy-img"/g, 'class="cs-lazy-img cs-loaded"');
  value = simplifyContactPhones(value);
  value = hardenForms(value);
  return value;
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
    if (!/text\/html/i.test(contentType)) return response;

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    headers.set('cache-control', 'public, max-age=300, must-revalidate');
    return new Response(normalizeHtml(await response.text()), {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
