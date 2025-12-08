(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (window.__DEVTOOLS_GUARD_INSTALLED__) {
    return;
  }

  window.__DEVTOOLS_GUARD_INSTALLED__ = true;

  const REDIRECT_PATH = '/generic-error.html';
  const THRESHOLD = 150;

  const isGenericErrorPage = () => {
    const path = window.location.pathname || '';
    return path.endsWith('/generic-error.html') || path === '/generic-error.html' || path === 'generic-error.html';
  };

  let redirectTriggered = false;
  const redirectToSecurityPage = () => {
    if (redirectTriggered) {
      return;
    }

    redirectTriggered = true;

    if (!isGenericErrorPage()) {
      window.location.replace(REDIRECT_PATH);
    }
  };

  const shouldHijackDevtools = event => {
    const { key, code, ctrlKey, shiftKey, metaKey, altKey } = event;
    const normalizedKey = (key || '').toLowerCase();
    const normalizedCode = (code || '').toLowerCase();
    const keyCode = event.keyCode || event.which;

    if (keyCode === 123 || normalizedKey === 'f12') {
      return true;
    }

    const comboKey = normalizedKey || normalizedCode.replace('key', '');
    const shiftCombos = ['i', 'j', 'c', 'k', 'm', 's', 'p'];
    const altCombos = ['i', 'j', 'c', 'k', 'm', 'p'];

    if (shiftKey && (ctrlKey || metaKey) && shiftCombos.includes(comboKey)) {
      return true;
    }

    if ((ctrlKey || metaKey) && altKey && altCombos.includes(comboKey)) {
      return true;
    }

    if ((ctrlKey || metaKey) && comboKey === 'u') {
      return true;
    }

    if ((metaKey || ctrlKey) && shiftKey && ['c', 'i', 'j'].includes(comboKey)) {
      return true;
    }

    if (ctrlKey && altKey && shiftKey && ['i', 'j', 'c', 'k'].includes(comboKey)) {
      return true;
    }

    if (metaKey && altKey && shiftKey && ['c', 'i', 'j', 'k'].includes(comboKey)) {
      return true;
    }

    if (normalizedCode === 'keyi' && event.getModifierState?.('Meta') && event.getModifierState?.('Alt')) {
      return true;
    }

    return false;
  };

  const listeners = [
    [document, 'contextmenu', event => event.preventDefault(), true],
    [
      window,
      'keydown',
      event => {
        if (shouldHijackDevtools(event)) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          redirectToSecurityPage();
        }
      },
      true,
    ],
  ];

  listeners.forEach(([target, eventName, handler, options]) => {
    target.addEventListener(eventName, handler, options);
  });

  window.addEventListener(
    'pagehide',
    () => {
      listeners.forEach(([target, eventName, handler, options]) => {
        target.removeEventListener(eventName, handler, options);
      });
      window.__DEVTOOLS_GUARD_INSTALLED__ = false;
    },
    { once: true }
  );
})();
