/* ==========================================================================
   AARONGANTT.COM — mobile slide-in menu
   --------------------------------------------------------------------------
   The site is a static Wix export, so Wix's own thunderbolt runtime never
   runs and its dropdown menu has no behaviour of its own. This builds a plain
   hamburger + slide-in panel instead.

   The panel is *cloned* from the existing menu (#DrpDwnMn0itemsContainer)
   rather than hard-coded, so the links stay in sync with the Wix markup on
   all seven pages and there's nothing to update twice.

   Everything it injects is prefixed `agm-` and is `display:none` above the
   979px breakpoint (see css/mobile.css), so the desktop layout is untouched.
   ========================================================================== */

(function () {
  'use strict';

  var OPEN_CLASS = 'agm-open';

  function build() {
    // Guard against double-init (e.g. if the script is included twice).
    if (document.querySelector('.agm-panel')) return;

    var source = document.getElementById('DrpDwnMn0itemsContainer');
    if (!source) return;

    var anchors = source.querySelectorAll('li a[href]');
    if (!anchors.length) return;

    /* ---- panel ---------------------------------------------------------- */
    var panel = document.createElement('nav');
    panel.className = 'agm-panel';
    panel.setAttribute('aria-label', 'Site');

    var list = document.createElement('ul');
    list.className = 'agm-list';

    for (var i = 0; i < anchors.length; i++) {
      var source_a = anchors[i];
      var label = (source_a.textContent || '').replace(/\s+/g, ' ').trim();
      if (!label) continue;

      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = source_a.getAttribute('href');
      link.textContent = label;

      if (source_a.getAttribute('aria-current') === 'page') {
        link.className = 'agm-current';
        link.setAttribute('aria-current', 'page');
      }

      item.appendChild(link);
      list.appendChild(item);
    }
    panel.appendChild(list);

    /* ---- backdrop + button ---------------------------------------------- */
    var backdrop = document.createElement('div');
    backdrop.className = 'agm-backdrop';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'agm-btn';
    button.innerHTML = '<span class="agm-bars"></span>';

    function setOpen(open) {
      document.documentElement.classList[open ? 'add' : 'remove'](OPEN_CLASS);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
      // Closed, the panel is visibility:hidden, so its links leave the tab order.
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    setOpen(false);

    button.addEventListener('click', function () {
      setOpen(!document.documentElement.classList.contains(OPEN_CLASS));
    });

    backdrop.addEventListener('click', function () {
      setOpen(false);
    });

    // Tapping a link navigates; close so the panel isn't mid-slide on return
    // via the back button (pages are served from cache).
    panel.addEventListener('click', function (event) {
      if (event.target && event.target.tagName === 'A') setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' || event.keyCode === 27) setOpen(false);
    });

    // If the viewport grows past the breakpoint while the menu is open, drop
    // the open state so the desktop nav isn't left with a scroll lock on.
    if (window.matchMedia) {
      var wide = window.matchMedia('(min-width: 980px)');
      var onChange = function (mq) { if (mq.matches) setOpen(false); };
      if (wide.addEventListener) wide.addEventListener('change', onChange);
      else if (wide.addListener) wide.addListener(onChange);
    }

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.body.appendChild(button);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
