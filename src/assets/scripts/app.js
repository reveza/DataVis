/**
 * app.js
 * ======
 * Main file of the application. This file is used to initialize the scroller and imports the visualizations used.
 */

'use strict';

// import '../styles/style.scss';

// import { scroller } from './scroller';
// import stickyBits from 'stickybits'
// import { initialize as v1 } from './viz';

// Fallback for old browsers to support sticky positioning.
(function(L, d3, topojson, localization){
  let elements = [];
  ['.viz'].forEach(selector => {
    elements = elements.concat(Array.from(document.querySelectorAll(selector)));
  });
  // stickyBits(elements, { stickyBitStickyOffset: 0 });
  
  // Initializes the scroller and the visualizations.
  Promise.all([initialize(L, d3, topojson, localization)]).then(([callbacksV1]) => {
    scroller([callbacksV1])
      .initialize(L, d3, topojson, localization);
  });

})(L, d3, topojson, localization);
