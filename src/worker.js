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
  [/305\.555\.7543/g, '786.659.3290']
];

const PATCH_CSS = `
/* CoastSlide production fixes */
.nav-links>li>a{padding:8px 12px;font-size:13.5px}.btn-wa{color:#fff!important}.btn-wa:hover{color:#fff!important}.phone-card.btn-wa{background:var(--wa)!important;border-color:var(--wa)!important;color:#fff!important}.phone-card.btn-wa .pc-area,.phone-card.btn-wa .pc-num{color:#fff!important}.rpanel.active{grid-template-columns:.95fr 1.05fr}.rp-photo{background:linear-gradient(145deg,var(--blue-deep),var(--blue) 58%,var(--teal))!important}.rp-photo img{display:none!important}.rp-photo-overlay{background:linear-gradient(160deg,rgba(7,63,95,.96) 0%,rgba(8,125,135,.76) 100%)!important}.rp-photo-content{justify-content:center!important}.form-success.form-error{background:#FFF4F2!important;border-color:#F0B8AC!important;color:#8A2418!important}
@media(max-width:1024px){.rpanel.active{grid-template-columns:1fr}.rp-photo{min-height:280px}}
`;

function patchComponentsJs(text) {
  let next = text.replace(
    "'<li>' + link('pages/about.html', 'About') + '</li>' +\n      '</ul>' +",
    "'<li>' + link('pages/about.html', 'About') + '</li>' +\n      '<li>' + link('pages/contact.html', 'Contact Us') + '</li>' +\n      '</ul>' +"
  );
  next = next.replace(
    "mob('pages/contact.html', 'Contact & Free Estimate') +",
    "mob('pages/contact.html', 'Contact Us') +"
  );
  next = next.replace(
    /form\.addEventListener\('submit', function \(event\) \{[\s\S]*?if \(ok\) ok\.style\.display = 'block';\n      \}\);/,
    "form.addEventListener('submit', async function (event) {\n        event.preventDefault();\n        var btn = form.querySelector('button[type=submit]');\n        var status = document.getElementById('form-success');\n        var original = btn ? btn.textContent : '';\n        if (status) {\n          status.style.display = 'none';\n          status.classList.remove('form-error');\n        }\n        if (btn) {\n          btn.textContent = 'Sending request...';\n          btn.disabled = true;\n        }\n        try {\n          var response = await fetch('/api/contact', {\n            method: 'POST',\n            headers: { 'Accept': 'application/json' },\n            body: new FormData(form)\n          });\n          if (!response.ok) throw new Error('Contact request failed');\n          if (btn) {\n            btn.textContent = 'Sent. We will contact you shortly.';\n            btn.style.background = '#27AE60';\n          }\n          if (status) {\n            status.textContent = 'Thank you. Your request was sent and CoastSlide will contact you shortly.';\n            status.style.display = 'block';\n          }\n          form.reset();\n        } catch (error) {\n          if (btn) {\n            btn.textContent = original || 'Send Request';\n            btn.disabled = false;\n          }\n          if (status) {\n            status.textContent = 'The form could not be sent right now. Please call or text (786) 659-3290.';\n            status.classList.add('form-error');\n            status.style.display = 'block';\n          }\n        }\n      });"
  );
  return next;
}

function patchHtml(text) {
  let next = text;
  next = next.replace(/name="county"/g, 'name="area"');
  next = next.replace(/name="repair"/g, 'name="problem" required');
  next = next.replace(/<input id="home-email" name="email" type="email" placeholder=/g, '<input id="home-email" name="email" type="email" required placeholder=');
  next = next.replace(/<button type="submit" class="btn btn-blue" style="width:100%;justify-content:center;font-size:16px;padding:16px">[^<]*Request Free Estimate<\/button>/g, '<button type="submit" class="btn btn-blue" style="width:100%;justify-content:center;font-size:16px;padding:16px">Send Request</button>');
  next = next.replace(/<div class="form-success" id="form-success">[\s\S]*?<\/div>/g, '<div class="form-success" id="form-success" role="status" aria-live="polite"></div>');
  next = next.replace(/class="phone-card btn-wa" style="color:#fff;border:none"/g, 'class="phone-card btn-wa"');
  next = next.replace(/style="color:rgba\(255,255,255,\.7\)">WhatsApp/g, '>WhatsApp');
  return next;
}

function patchCss(text) {
  if (text.includes('CoastSlide production fixes')) return text;
  return text + PATCH_CSS;
}

function normalizeText(text, contentType = '') {
  let next = REPLACEMENTS.reduce((value, pair) => value.replace(pair[0], pair[1]), text);
  if (/javascript/i.test(contentType)) next = patchComponentsJs(next);
  if (/text\/html/i.test(contentType)) next = patchHtml(next);
  if (/text\/css/i.test(contentType)) next = patchCss(next);
  return next;
}

function shouldRewrite(contentType) {
  return /text\/html|text\/css|application\/javascript|text\/javascript|application\/json|text\/plain|application\/xml|text\/xml/i.test(contentType || '');
}

function clean(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 1200);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

async function handleContact(request) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  const form = await request.formData();
  if (clean(form.get('company'))) return json({ ok: true });

  const lead = {
    name: clean(form.get('name')),
    phone: clean(form.get('phone')),
    email: clean(form.get('email')),
    area: clean(form.get('area')),
    problem: clean(form.get('problem')),
    details: clean(form.get('details'))
  };

  if (!lead.name || !lead.phone || !lead.email || !lead.problem) {
    return json({ ok: false, error: 'Missing required fields' }, 400);
  }

  const payload = new FormData();
  payload.set('_subject', 'New CoastSlide Contact Request');
  payload.set('_template', 'table');
  payload.set('_captcha', 'false');
  payload.set('Name', lead.name);
  payload.set('Phone', lead.phone);
  payload.set('Email', lead.email);
  payload.set('City or Area', lead.area || 'Not provided');
  payload.set('Type of Problem', lead.problem);
  payload.set('Details', lead.details || 'Not provided');
  payload.set('Source Page', request.headers.get('referer') || 'Direct website form');

  const response = await fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: payload
  });

  if (!response.ok) return json({ ok: false, error: 'Email service failed' }, 502);
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (OLD_HOSTS.has(url.hostname)) {
      url.hostname = PRIMARY_HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/api/contact') return handleContact(request);

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!shouldRewrite(contentType)) return response;

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    headers.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0');

    return new Response(normalizeText(await response.text(), contentType), {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
