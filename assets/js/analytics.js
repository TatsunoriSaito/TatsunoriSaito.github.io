/* Pageview analytics. Dashboard access is controlled in GoatCounter settings. */
(function () {
  'use strict';

  // This is a public collection URL, never an API key or dashboard secret token.
  var endpoint = 'https://tatsunorisaito.goatcounter.com/count';

  if (!endpoint || window.location.hostname !== 'tatsunorisaito.github.io') return;

  window.goatcounter = {
    // Group visits by page, without query strings or fragment identifiers.
    path: window.location.pathname,
    no_events: true
  };

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.setAttribute('data-goatcounter', endpoint);
  document.head.appendChild(script);
})();
