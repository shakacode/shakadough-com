// ShakaDough — small bits of vanilla JS
(function () {
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

  // -------- Plan / zone selectors --------
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
  const getZone = bindPicker('zone-row', 'zone', 'selected');

  // -------- Subscribe form --------
  const form = document.getElementById('subscribe-form');
  const success = document.getElementById('subscribe-success');
  const reset = document.getElementById('reset-form');
  const emailErr = document.getElementById('email-err');

  if (form && success) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements.namedItem('name').value.trim();
      const email = form.elements.namedItem('email').value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!ok) {
        emailErr.hidden = false;
        return;
      }
      emailErr.hidden = true;

      const zoneLabels = {
        paia: 'Pāʻia',
        haiku: 'Hāʻikū',
        kuau: 'Kūʻau',
        other: 'your area',
      };
      const zoneVal = getZone() || 'paia';
      const zoneLabel = zoneLabels[zoneVal] || 'your area';

      document.getElementById('success-name').textContent = name || 'friend';
      document.getElementById('success-email').textContent = email;
      document.getElementById('success-zone').textContent = zoneLabel;

      // Plan + zone are visual-only at launch; once a backend exists, POST
      // { name, email, plan: getPlan(), zone: getZone() } here.

      form.classList.add('hidden');
      success.classList.remove('hidden');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
