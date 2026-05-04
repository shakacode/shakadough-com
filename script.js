// ShakaDough — small bits of vanilla JS
(function () {
  // Web3Forms public access key. Safe to expose: Web3Forms restricts
  // submissions to the domain configured in their dashboard, and the
  // recipient email is set on their side, so the key cannot be repurposed
  // to send mail elsewhere.
  const WEB3FORMS_ACCESS_KEY = 'f68adbac-5ff9-4c4f-9492-bd74b7e7d9f4';
  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  // -------- Mobile nav toggle --------
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('nav-mobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      mobile.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    mobile.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        mobile.classList.remove('open');
        mobile.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
      })
    );
  }

  // -------- Ticker --------
  const ticker = document.getElementById('ticker');
  if (ticker) {
    const items = [
      'Naturally leavened',
      'Paia, Maui',
      'Wild starter',
      '72-hour cold ferment',
      'Organic high-protein flour',
      'North shore pickup',
      'Est. 2026',
    ];
    const loop = [...items, ...items, ...items];
    for (const t of loop) {
      const wrap = document.createElement('span');
      wrap.className = 'item';
      const text = document.createElement('span');
      text.textContent = t;
      const sep = document.createElement('span');
      sep.className = 'sep';
      sep.textContent = '✿';
      wrap.append(text, sep);
      ticker.appendChild(wrap);
    }
  }

  // -------- Plan selector --------
  function bindPicker(rootId, attr, selectedClass) {
    const root = document.getElementById(rootId);
    if (!root) return () => null;
    const buttons = Array.from(root.querySelectorAll(`[data-${attr}]`));
    buttons.forEach((b) =>
      b.addEventListener('click', () => {
        buttons.forEach((x) => x.classList.remove(selectedClass));
        b.classList.add(selectedClass);
      })
    );
    return () => {
      const cur = buttons.find((b) => b.classList.contains(selectedClass));
      return cur ? cur.dataset[attr] : null;
    };
  }
  const getPlan = bindPicker('plan-grid', 'plan', 'selected');

  // -------- Subscribe form --------
  const form = document.getElementById('subscribe-form');
  const success = document.getElementById('subscribe-success');
  const reset = document.getElementById('reset-form');
  const emailErr = document.getElementById('email-err');

  const formErr = document.getElementById('form-err');
  const submitBtn = form && form.querySelector('button[type="submit"]');
  const planLabels = {
    'loaf-weekly': 'Loaf, weekly',
    'loaf-biweekly': 'Loaf, every 2 weeks',
    'bagels-weekly': 'Bagels, weekly',
    bundle: 'The whole bundle',
  };

  if (form && success) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.elements.namedItem('name').value.trim();
      const email = form.elements.namedItem('email').value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (formErr) formErr.hidden = true;
      if (!ok) {
        emailErr.hidden = false;
        return;
      }
      emailErr.hidden = true;

      const planVal = getPlan() || 'loaf-weekly';
      const planLabel = planLabels[planVal] || planVal;

      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const payload = new FormData();
        payload.set('access_key', WEB3FORMS_ACCESS_KEY);
        payload.set(
          'subject',
          `ShakaDough Wave List — ${name || 'new signup'}`
        );
        payload.set('from_name', 'ShakaDough Wave List');
        payload.set('replyto', email);
        // Honeypot: real users won't fill this, bots that auto-fill every
        // field will, and Web3Forms drops those submissions.
        const botcheck = form.elements.namedItem('botcheck');
        if (botcheck && botcheck.checked) {
          payload.set('botcheck', 'true');
        }
        payload.set('Name', name || '');
        payload.set('Email', email);
        payload.set('Plan', planLabel);
        payload.set('Delivery area', 'Spreckelsville / Paia, Maui');

        const res = await fetch(WEB3FORMS_ENDPOINT, {
          method: 'POST',
          body: payload,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Submission failed');
        }

        document.getElementById('success-name').textContent =
          name || 'friend';
        document.getElementById('success-email').textContent = email;

        form.classList.add('hidden');
        success.classList.remove('hidden');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (err) {
        if (formErr) {
          formErr.textContent =
            '※ Something went wrong on our end. Please try again, or email contact@shakadough.com directly.';
          formErr.hidden = false;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    });
  }

  if (reset && form && success) {
    reset.addEventListener('click', () => {
      form.reset();
      success.classList.add('hidden');
      form.classList.remove('hidden');
      emailErr.hidden = true;
    });
  }
})();
