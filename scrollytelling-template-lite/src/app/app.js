/**
 * app.js
 * ======
 * Main file of the application. This file is used to initialize the scroller and imports the visualizations used.
 */

'use strict';

import '../assets/styles/style.scss';

import { scroller } from './scroller';
import stickyBits from 'stickybits'
import { initialize as v1 } from './histogrammeScripts/viz';
import { initialize as v2 } from './mapScripts/viz.js';
import { initialize as v3 } from './matrixScripts/viz.js';

// Fallback for old browsers to support sticky positioning.
let elements = [];
['.viz'].forEach(selector => {
  elements = elements.concat(Array.from(document.querySelectorAll(selector)));
});
stickyBits(elements, { stickyBitStickyOffset: 0 });

// Initializes the scroller and the visualizations.
Promise.all([v1()]).then(([callbacksV1]) => {
  scroller([callbacksV1])
    .initialize();
});

// Initializes the scroller and the visualizations.
Promise.all([v2()]).then(([callbacksV2]) => {
  scroller([callbacksV2])
    .initialize();
});

// // Initializes the scroller and the visualizations.
// Promise.all([v3()]).then(([callbacksV3]) => {
//   scroller([callbacksV3])
//     .initialize();
// });
