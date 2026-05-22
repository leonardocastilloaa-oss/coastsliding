(function () {
  var PHONE_DISPLAY = '(786) 659-3290';
  var PHONE_TEL = '+17866593290';
  var PHONE_WA = '17866593290';
  var PHONE_SMS = '+17866593290';
  var path = window.location.pathname;
  var ROOT = path.includes('/cities/') || path.includes('/blog/') ? '../../' : path.includes('/pages/') ? '../' : './';

  function installImageFallbacks() {
    document.addEventListener('error', function (event) {
      var img = event.target;
      if (!img || img.tagName !== 'IMG') return;
      var src = img.getAttribute('src') || '';
      if (src.indexOf('/cdn-cgi/image/') === -1 || img.dataset.directFallback) return;
      img.dataset.directFallback = '1';
      var direct = src.replace(/^\/cdn-cgi\/image\/[^/]+\//, '/');
      img.src = direct;
    }, true);
  }
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

  installImageFallbacks();
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
      link('pages/palm-beach.html', 'Palm Beach County') +      '</div></li>' +
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
      mob('pages/palm-beach.html', 'Palm Beach County') +      '<div class="mob-section">Company</div>' +
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

  function ensureTextFloat() {
    if (document.querySelector('.cs-sms-float')) return;
    var sms = document.createElement('a');
    sms.href = 'sms:' + PHONE_SMS + '?body=Hi%20CoastSlide%2C%20I%20need%20help%20with%20a%20sliding%20door%20or%20window.';
    sms.className = 'cs-sms-float';
    sms.setAttribute('aria-label', 'Send CoastSlide a text message');
    sms.innerHTML = '<span aria-hidden="true">&#9993;</span><span>Text Us</span>';
    document.body.appendChild(sms);
  }

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
      form.setAttribute('action', '/api/contact');
      form.setAttribute('method', 'post');
      form.setAttribute('accept-charset', 'UTF-8');
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
      if (!form.querySelector('[name="source_page"]')) {
        var source = document.createElement('input');
        source.type = 'hidden';
        source.name = 'source_page';
        source.value = window.location.href;
        form.appendChild(source);
      }
      if (!form.querySelector('[name="problem"]')) {
        var problem = document.createElement('input');
        problem.type = 'hidden';
        problem.name = 'problem';
        problem.value = 'Website contact request';
        form.appendChild(problem);
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
          var result = {};
          try { result = await response.json(); } catch (jsonError) {}
          if (!response.ok || !result.ok) throw new Error('Contact request failed');
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

  function loadNumberedLazyPhotos() {
    var extensions = ['avif', 'webp', 'png', 'jpeg', 'jpg', 'AVIF', 'WEBP', 'PNG', 'JPEG', 'JPG'];
    var cache = {};
    function canLoad(url) {
      if (!cache[url]) cache[url] = new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () { resolve(true); };
        img.onerror = function () { resolve(false); };
        img.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'v=photos';
      });
      return cache[url];
    }
    async function load(img) {
      if (!img || !img.dataset.photo || img.dataset.loadedPhoto) return;
      img.dataset.loadedPhoto = '1';
      var number = img.dataset.photo;
      var prefix = ROOT + 'images/';
      for (var i = 0; i < extensions.length; i += 1) {
        var raw = prefix + number + '.' + extensions[i];
        if (await canLoad(raw)) {
          var absolute = raw.replace(/^\.\//, '/').replace(/^\.\.\//, '/');
          var width = number === '1' ? 1200 : (number === '4' || number === '8' ? 760 : 820);
          img.src = '/cdn-cgi/image/width=' + width + ',quality=68,format=auto/' + absolute.replace(/^\//, '');
          img.classList.add('cs-loaded');
          return;
        }
      }
    }
    var lazyImages = Array.from(document.querySelectorAll('img[data-photo]'));
    if (!lazyImages.length) return;
    if ('IntersectionObserver' in window) {
      var loader = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            load(entry.target);
            loader.unobserve(entry.target);
          }
        });
      }, { rootMargin: '650px 0px', threshold: 0.01 });
      lazyImages.forEach(function (img) { loader.observe(img); });
    } else lazyImages.forEach(load);
  }
  function resolveNumberedPhotos() {
    var extensions = ['avif', 'webp', 'png', 'jpeg', 'jpg', 'AVIF', 'WEBP', 'PNG', 'JPEG', 'JPG'];
    var cache = {};

    function canLoad(url) {
      if (!cache[url]) {
        cache[url] = new Promise(function (resolve) {
          var img = new Image();
          img.onload = function () { resolve(true); };
          img.onerror = function () { resolve(false); };
          img.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'v=photos';
        });
      }
      return cache[url];
    }

    document.querySelectorAll('img[src*="/images/"], img[src*="images/"]').forEach(function (img) {
      var src = img.getAttribute('src') || '';
      var match = src.match(/^(.*\/images\/)(\d+)\.(?:jpg|jpeg|png|webp|avif)(\?.*)?$/i);
      if (!match) return;

      var base = match[1];
      var number = match[2];
      var current = src.split('?')[0];
      var candidates = extensions.map(function (ext) { return base + number + '.' + ext; });

      (async function () {
        for (var i = 0; i < candidates.length; i += 1) {
          if (await canLoad(candidates[i])) {
            if (current !== candidates[i]) img.src = candidates[i];
            return;
          }
        }
      })();
    });
  }

  function simplifyContactPhoneBlock() {
    var block = document.querySelector('.contact-info-phones');
    if (!block || block.classList.contains('contact-one-number')) return;
    var labels = Array.from(block.querySelectorAll('.pc-area')).map(function (node) {
      return node.textContent.trim().toLowerCase();
    });
    if (!labels.includes('miami-dade') || !labels.includes('broward county') || !labels.includes('palm beach')) return;
    block.className = 'contact-info-phones contact-one-number';
    block.style.cssText = 'display:grid;gap:14px;max-width:540px';
    block.innerHTML =
      '<a href="tel:' + PHONE_TEL + '" class="phone-card contact-main-phone" style="display:block;padding:22px;border:1px solid #B8D6ED;border-radius:14px;background:#fff;box-shadow:0 8px 28px rgba(11,98,141,.10);text-decoration:none">' +
        '<div><div class="pc-area" style="color:#084F73;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;font-size:12px">One Number for South Florida</div>' +
        '<div class="pc-num" style="font-size:clamp(28px,4vw,40px);line-height:1.1;font-weight:950;color:#073F5F;margin:7px 0 6px">' + PHONE_DISPLAY + '</div>' +
        '<div class="pc-note" style="color:#2D4B60;font-size:14px;line-height:1.55">Miami-Dade, Broward and Palm Beach. Call, text or WhatsApp the same number for every service area.</div></div>' +
      '</a>' +
      '<div class="contact-quick-actions" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">' +
        '<a href="tel:' + PHONE_TEL + '" class="btn btn-blue" style="justify-content:center;padding:13px 10px;text-align:center">Call Now</a>' +
        '<a href="sms:' + PHONE_SMS + '" class="btn btn-outline" style="justify-content:center;padding:13px 10px;text-align:center;background:#fff">Text Us</a>' +
        '<a href="https://wa.me/' + PHONE_WA + '" class="btn btn-wa" target="_blank" rel="noopener" style="justify-content:center;padding:13px 10px;text-align:center;color:#fff!important">WhatsApp</a>' +
      '</div>';
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
    var index = ['miami', 'broward', 'palm'].indexOf(id);
    if (tabs[index]) tabs[index].classList.add('active');
  };

  document.addEventListener('DOMContentLoaded', function () {
    ensureTextFloat();
    ensureMainLandmark();
    loadNumberedLazyPhotos();
    resolveNumberedPhotos();
    simplifyContactPhoneBlock();
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
