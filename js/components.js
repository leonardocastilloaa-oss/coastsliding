(function () {
  var PHONE_DISPLAY = '(786) 659-3290';
  var PHONE_TEL = '+17866593290';
  var PHONE_WA = '17866593290';
  var path = window.location.pathname;
  var ROOT = path.includes('/cities/') || path.includes('/blog/') ? '../../' : path.includes('/pages/') ? '../' : './';

  function installDesignFixes() {
    if (document.getElementById('cs-design-fixes')) return;
    var style = document.createElement('style');
    style.id = 'cs-design-fixes';
    style.textContent =
      '.brand-logo{display:block;width:auto;height:54px;max-width:210px;object-fit:contain}' +
      '.nav-logo .brand-logo{height:52px;max-width:190px}' +
      'footer .brand-logo{height:58px;max-width:220px;background:#fff;border-radius:8px;padding:5px 10px}' +
      '.cta-section{background:linear-gradient(135deg,#042f49 0%,#075070 54%,#087D87 100%)!important}' +
      '.cta-section .cta-chip,.cta-section .chip{color:#fff!important;background:rgba(255,255,255,.20)!important;border-color:rgba(255,255,255,.50)!important}' +
      '.cta-section .chip .dot{background:#6EF2A6!important}' +
      '.cta-section .title,.cta-section .title.white,.cta-section .title.white em,.cta-section .lead,.cta-section .lead.center,.cta-section .cta-lead,.cta-section .cta-phone-area,.cta-section .cta-phone-num,.cta-section .cta-note{color:#fff!important;opacity:1!important}' +
      '.cta-section .cta-lead{font-size:19px!important;font-weight:800!important;line-height:1.75!important;text-shadow:0 2px 8px rgba(0,0,0,.35)}' +
      '.cta-section .cta-phone{background:rgba(255,255,255,.20)!important;border-color:rgba(255,255,255,.55)!important;box-shadow:0 12px 36px rgba(0,0,0,.22)!important}' +
      '.cta-section .cta-phone:hover{background:rgba(255,255,255,.30)!important}';
    document.head.appendChild(style);
  }

  installDesignFixes();

  function brand() {
    return '<img class="brand-logo" src="' + ROOT + 'logo.svg" alt="CoastSlide" width="420" height="120">';
  }

  function link(href, text, cls) {
    return '<a href="' + ROOT + href + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + text + '</a>';
  }

  function city(slug, name, county) {
    return '<a href="' + ROOT + 'pages/cities/' + slug + '.html" class="mega-item"><span class="mi-icon" aria-hidden="true">&#9656;</span><div><div class="mi-name">' + name + '</div><div class="mi-desc">' + county + '</div></div></a>';
  }

  function mob(href, text) {
    return '<a class="mob-link" href="' + ROOT + href + '">' + text + '</a>';
  }

  function footCol(title, items) {
    return '<div><div class="footer-heading">' + title + '</div><ul class="footer-links">' +
      items.map(function (item) { return '<li>' + link(item[0], item[1]) + '</li>'; }).join('') +
      '</ul></div>';
  }

  var nav = document.getElementById('nav');
  if (nav) {
    nav.innerHTML =
      '<a href="' + ROOT + 'index.html" class="nav-logo" aria-label="CoastSlide home">' + brand() + '</a>' +
      '<ul class="nav-links">' +
      '<li class="has-drop">' + link('pages/services.html', 'Services') +
      '<div class="drop-menu">' +
      link('pages/roller-replacement.html', 'Roller Replacement') +
      link('pages/track-repair.html', 'Track Repair') +
      link('pages/impact-glass.html', 'Impact Glass') +
      link('pages/lock-security.html', 'Lock & Security') +
      link('pages/window-repair.html', 'Window Repair') +
      link('pages/hoa-commercial.html', 'HOA & Commercial') +
      '</div></li>' +
      '<li class="has-drop"><a href="#" aria-label="Service regions">Regions</a>' +
      '<div class="drop-menu">' +
      link('pages/miami-dade.html', 'Miami-Dade County') +
      link('pages/broward.html', 'Broward County') +
      link('pages/palm-beach.html', 'Palm Beach County') +
      link('pages/florida-keys.html', 'Florida Keys') +
      '</div></li>' +
      '<li class="has-mega"><a href="#" aria-label="Service cities">Cities</a>' +
      '<div class="mega-menu">' +
      city('homestead', 'Homestead', 'Miami-Dade') +
      city('miami', 'Miami', 'Miami-Dade') +
      city('miami-beach', 'Miami Beach', 'Miami-Dade') +
      city('hialeah', 'Hialeah', 'Miami-Dade') +
      city('doral', 'Doral', 'Miami-Dade') +
      city('coral-gables', 'Coral Gables', 'Miami-Dade') +
      city('kendall', 'Kendall', 'Miami-Dade') +
      city('aventura', 'Aventura', 'Miami-Dade') +
      city('hollywood', 'Hollywood', 'Broward') +
      city('fort-lauderdale', 'Fort Lauderdale', 'Broward') +
      city('pembroke-pines', 'Pembroke Pines', 'Broward') +
      city('weston', 'Weston', 'Broward') +
      city('coral-springs', 'Coral Springs', 'Broward') +
      city('boca-raton', 'Boca Raton', 'Palm Beach') +
      city('delray-beach', 'Delray Beach', 'Palm Beach') +
      city('west-palm-beach', 'West Palm Beach', 'Palm Beach') +
      city('palm-beach-gardens', 'Palm Beach Gardens', 'Palm Beach') +
      city('jupiter', 'Jupiter', 'Palm Beach') +
      '</div></li>' +
      '<li>' + link('pages/blog.html', 'Blog') + '</li>' +
      '<li>' + link('pages/reviews.html', 'Reviews') + '</li>' +
      '<li>' + link('pages/about.html', 'About') + '</li>' +
      '<li>' + link('pages/contact.html', 'Contact Us') + '</li>' +
      '</ul>' +
      '<div class="nav-right">' +
      '<a href="tel:' + PHONE_TEL + '" class="nav-phone"><span aria-hidden="true">&#128222;</span> ' + PHONE_DISPLAY + '</a>' +
      link('pages/contact.html', 'Free Estimate', 'nav-cta') +
      '<button class="nav-burger" id="burger" type="button" aria-label="Open menu" onclick="csToggleMobile()">&#9776;</button>' +
      '</div>';

    var mobile = document.createElement('div');
    mobile.className = 'mobile-nav';
    mobile.id = 'mob-nav';
    mobile.innerHTML =
      '<div class="mob-section">Services</div>' +
      mob('pages/services.html', 'All Services') +
      mob('pages/roller-replacement.html', 'Roller Replacement') +
      mob('pages/track-repair.html', 'Track Repair') +
      mob('pages/impact-glass.html', 'Impact Glass') +
      mob('pages/lock-security.html', 'Lock & Security') +
      mob('pages/window-repair.html', 'Window Repair') +
      mob('pages/hoa-commercial.html', 'HOA & Commercial') +
      '<div class="mob-section">Regions</div>' +
      mob('pages/miami-dade.html', 'Miami-Dade County') +
      mob('pages/broward.html', 'Broward County') +
      mob('pages/palm-beach.html', 'Palm Beach County') +
      mob('pages/florida-keys.html', 'Florida Keys') +
      '<div class="mob-section">Company</div>' +
      mob('pages/blog.html', 'Blog') +
      mob('pages/reviews.html', 'Reviews') +
      mob('pages/about.html', 'About Us') +
      mob('pages/faq.html', 'FAQ') +
      mob('pages/contact.html', 'Contact Us') +
      '<div style="margin-top:20px;padding-bottom:30px">' +
      '<a href="tel:' + PHONE_TEL + '" class="btn btn-blue" style="display:block;text-align:center;margin-bottom:12px">Call ' + PHONE_DISPLAY + '</a>' +
      '<a href="https://wa.me/' + PHONE_WA + '" class="btn btn-wa" style="display:block;text-align:center" target="_blank" rel="noopener">WhatsApp Us</a>' +
      '</div>';
    document.body.appendChild(mobile);
  }

  var footer = document.getElementById('footer');
  if (footer) {
    footer.innerHTML =
      '<div class="container"><div class="footer-grid">' +
      '<div><a href="' + ROOT + 'index.html" aria-label="CoastSlide home">' + brand() + '</a>' +
      '<p class="footer-desc">South Florida bilingual sliding door and window repair. Miami-Dade NOA certified. Licensed FL contractor. Homestead to Jupiter.</p>' +
      '<div class="footer-socials"><a href="#" class="fsoc" aria-label="CoastSlide on Facebook">f</a><a href="#" class="fsoc" aria-label="CoastSlide on Instagram">in</a><a href="#" class="fsoc" aria-label="CoastSlide on YouTube">yt</a><a href="#" class="fsoc" aria-label="CoastSlide Google reviews">g</a></div></div>' +
      footCol('Services', [
        ['pages/roller-replacement.html', 'Roller Replacement'],
        ['pages/track-repair.html', 'Track Repair'],
        ['pages/impact-glass.html', 'Impact Glass'],
        ['pages/lock-security.html', 'Lock & Security'],
        ['pages/window-repair.html', 'Window Repair'],
        ['pages/hoa-commercial.html', 'HOA & Commercial']
      ]) +
      footCol('Cities', [
        ['pages/cities/homestead.html', 'Homestead'],
        ['pages/cities/miami.html', 'Miami'],
        ['pages/cities/miami-beach.html', 'Miami Beach'],
        ['pages/cities/fort-lauderdale.html', 'Fort Lauderdale'],
        ['pages/cities/boca-raton.html', 'Boca Raton'],
        ['pages/cities/west-palm-beach.html', 'West Palm Beach'],
        ['pages/cities/jupiter.html', 'Jupiter']
      ]) +
      footCol('Company', [
        ['pages/about.html', 'About CoastSlide'],
        ['pages/blog.html', 'Blog'],
        ['pages/reviews.html', 'Reviews'],
        ['pages/faq.html', 'FAQ'],
        ['pages/contact.html', 'Contact Us'],
        ['pages/privacy.html', 'Privacy Policy']
      ]) +
      '</div><div class="footer-bottom">' +
      '<div class="footer-copy">&copy; 2026 CoastSlide LLC &middot; Licensed Florida Contractor &middot; Homestead to Jupiter</div>' +
      '<div class="footer-legal">' + link('pages/privacy.html', 'Privacy') + link('pages/terms.html', 'Terms') + '<a href="' + ROOT + 'sitemap.xml">Sitemap</a></div>' +
      '</div></div>';
  }

  var trust = document.getElementById('trust-bar');
  if (trust) {
    trust.outerHTML = '<div class="trust-bar"><div class="trust-inner">' +
      '<div class="trust-item"><span class="ti" aria-hidden="true">&#127942;</span> Licensed & Insured</div>' +
      '<div class="trust-item"><span class="ti" aria-hidden="true">&#9889;</span> Same-Day Service</div>' +
      '<div class="trust-item"><span class="ti" aria-hidden="true">&#128172;</span> English &amp; Espa&ntilde;ol</div>' +
      '<div class="trust-item"><span class="ti" aria-hidden="true">&#10003;</span> Miami-Dade NOA</div>' +
      '<div class="trust-item"><span class="ti" aria-hidden="true">&#128274;</span> Lifetime Warranty</div>' +
      '<div class="trust-item"><span class="ti" aria-hidden="true">&#128656;</span> Parts on Every Truck</div>' +
      '</div></div>';
  }

  var cta = document.getElementById('cta-section');
  if (cta) {
    cta.outerHTML = '<section class="cta-section"><div class="cta-wave"><svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true"><path d="M0,0 C360,60 1080,0 1440,40 L1440,0 L0,0 Z" fill="white"/></svg></div>' +
      '<div class="container"><div class="cta-inner">' +
      '<div class="chip cta-chip" style="background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.25);color:#fff;margin:0 auto 20px"><span class="dot"></span> Free Estimate - Same Day Available</div>' +
      '<h2 class="title white center">Your Door Fixed.<br/><em>Today.</em></h2>' +
      '<p class="lead center cta-lead" style="color:#fff;margin:16px auto 0">Flat-rate pricing. Bilingual. Licensed & insured. No surprises.</p>' +
      '<div class="cta-phones"><a href="tel:' + PHONE_TEL + '" class="cta-phone"><div class="cta-phone-area">One Number for South Florida</div><div class="cta-phone-num">' + PHONE_DISPLAY + '</div></a></div>' +
      '<p class="cta-note">Mon-Sat 7am-8pm &middot; Emergency 24/7 &middot; Text OK &middot; Se Habla Espa&ntilde;ol</p>' +
      '</div></div></section>';
  }

  var wa = document.createElement('a');
  wa.href = 'https://wa.me/' + PHONE_WA + '?text=Hello%20CoastSlide!%20I%20need%20a%20free%20estimate%20for%20my%20sliding%20door.';
  wa.className = 'wa-float';
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'WhatsApp CoastSlide');
  wa.innerHTML = '<span aria-hidden="true">&#9742;</span><span class="wa-tooltip">Chat on WhatsApp</span>';
  document.body.appendChild(wa);

  function replacePhoneText(text) {
    return text
      .replace(/\+1-305-555-7543/g, PHONE_TEL)
      .replace(/\+13055557543/g, PHONE_TEL)
      .replace(/13055557543/g, PHONE_WA)
      .replace(/3055557543/g, PHONE_WA)
      .replace(/\(305\) 555-7543/g, PHONE_DISPLAY)
      .replace(/\(954\) 555-7543/g, PHONE_DISPLAY)
      .replace(/\(561\) 555-7543/g, PHONE_DISPLAY)
      .replace(/305-555-7543/g, '786-659-3290')
      .replace(/954-555-7543/g, '786-659-3290')
      .replace(/561-555-7543/g, '786-659-3290')
      .replace(/305\.555\.7543/g, '786.659.3290');
  }

  function normalizePhones() {
    document.querySelectorAll('[href]').forEach(function (node) {
      var href = node.getAttribute('href') || '';
      var next = replacePhoneText(href).replace(/wa\.me\/13055557543/g, 'wa.me/' + PHONE_WA);
      if (next !== href) node.setAttribute('href', next);
    });
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var current;
    while ((current = walker.nextNode())) {
      var nextText = replacePhoneText(current.nodeValue);
      if (nextText !== current.nodeValue) current.nodeValue = nextText;
    }
  }

  function prepareForms() {
    document.querySelectorAll('form').forEach(function (form, formIndex) {
      if (!form.id) form.id = 'contact-form-' + formIndex;
      if (!form.querySelector('input[name="company"]')) {
        var trap = document.createElement('input');
        trap.type = 'text';
        trap.name = 'company';
        trap.autocomplete = 'off';
        trap.tabIndex = -1;
        trap.setAttribute('aria-hidden', 'true');
        trap.style.cssText = 'position:absolute;left:-9999px;opacity:0';
        form.insertBefore(trap, form.firstChild);
      }
      form.querySelectorAll('.form-field').forEach(function (field, fieldIndex) {
        var label = field.querySelector('label');
        var control = field.querySelector('input,select,textarea');
        if (!control) return;
        if (!control.id) control.id = 'cs-field-' + formIndex + '-' + fieldIndex;
        if (label) label.setAttribute('for', control.id);
      });
      var text = form.textContent.toLowerCase();
      var controls = form.querySelectorAll('input,select,textarea');
      controls.forEach(function (control) {
        var label = '';
        if (control.id) {
          var labelNode = form.querySelector('label[for="' + control.id + '"]');
          if (labelNode) label = labelNode.textContent.toLowerCase();
        }
        var hint = (label + ' ' + (control.placeholder || '') + ' ' + text).toLowerCase();
        if (!control.name) {
          if (hint.includes('name')) control.name = 'name';
          else if (hint.includes('phone')) control.name = 'phone';
          else if (hint.includes('email')) control.name = 'email';
          else if (hint.includes('county') || hint.includes('city') || hint.includes('area')) control.name = 'area';
          else if (hint.includes('repair') || hint.includes('problem') || control.tagName === 'SELECT') control.name = 'problem';
          else if (hint.includes('detail') || control.tagName === 'TEXTAREA') control.name = 'details';
        }
      });
    });
  }

  function wireContactForms() {
    document.querySelectorAll('form').forEach(function (form) {
      if (form.dataset.csReady) return;
      form.dataset.csReady = '1';
      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        var btn = form.querySelector('button[type=submit]');
        var status = form.querySelector('.form-success') || document.getElementById('form-success');
        var original = btn ? btn.textContent : 'Send Request';
        if (status) {
          status.style.display = 'none';
          status.classList.remove('form-error');
        }
        if (btn) {
          btn.textContent = 'Sending request...';
          btn.disabled = true;
        }
        try {
          var response = await fetch('/api/contact', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form)
          });
          if (!response.ok) throw new Error('Contact request failed');
          if (btn) {
            btn.textContent = 'Sent. We will contact you shortly.';
            btn.style.background = '#27AE60';
          }
          if (status) {
            status.textContent = 'Thank you. Your request was sent and CoastSlide will contact you shortly.';
            status.style.display = 'block';
          }
          form.reset();
        } catch (error) {
          if (btn) {
            btn.textContent = original;
            btn.disabled = false;
          }
          if (status) {
            status.textContent = 'The form could not be sent right now. Please call or text ' + PHONE_DISPLAY + '.';
            status.classList.add('form-error');
            status.style.display = 'block';
          }
        }
      });
    });
  }

  function ensureMainLandmark() {
    if (document.querySelector('main, [role="main"]')) return;
    var body = document.body;
    var firstAnchor = document.getElementById('nav') || body.firstElementChild;
    var footerNode = document.getElementById('footer');
    var main = document.createElement('main');
    main.id = 'main-content';
    main.setAttribute('role', 'main');
    if (firstAnchor && firstAnchor.nextSibling) body.insertBefore(main, firstAnchor.nextSibling);
    else body.insertBefore(main, body.firstChild);
    var node = main.nextSibling;
    while (node && node !== footerNode) {
      var next = node.nextSibling;
      if (node.nodeType !== 1 || (node.id !== 'mob-nav' && !node.classList.contains('mobile-nav') && !node.classList.contains('wa-float'))) {
        main.appendChild(node);
      }
      node = next;
    }
  }

  window.csToggleMobile = function () {
    var menu = document.getElementById('mob-nav');
    var btn = document.getElementById('burger');
    if (!menu) return;
    menu.classList.toggle('open');
    if (btn) {
      btn.textContent = menu.classList.contains('open') ? 'X' : '\u2630';
      btn.setAttribute('aria-label', menu.classList.contains('open') ? 'Close menu' : 'Open menu');
    }
  };

  window.showReg = function (id) {
    document.querySelectorAll('.rpanel').forEach(function (panel) { panel.classList.remove('active'); });
    document.querySelectorAll('.rtab').forEach(function (tab) { tab.classList.remove('active'); });
    var panel = document.getElementById('rp-' + id);
    if (panel) panel.classList.add('active');
    var tabs = document.querySelectorAll('.rtab');
    var index = ['miami', 'broward', 'palm', 'keys'].indexOf(id);
    if (tabs[index]) tabs[index].classList.add('active');
  };

  document.addEventListener('DOMContentLoaded', function () {
    ensureMainLandmark();
    normalizePhones();
    prepareForms();
    wireContactForms();
    document.querySelectorAll('.faq-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var open = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function (node) { node.classList.remove('open'); });
        if (!open) item.classList.add('open');
      });
    });
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
    }
  });
})();
