/**
 * app.js
 * ======
 * Main file of the application. This file is used to initialize the scroller and imports the visualizations used.
 */

'use strict';

import '../assets/styles/style.scss';

import stickyBits from 'stickybits'
import { scroller } from './scroller';
import { initialize as histogramVisualization } from './histogrammeScripts/viz';
import { initialize as mapVisualization } from './mapScripts/viz.js';
import { initialize as matrixVisualizatiom } from './matrixScripts/viz.js';

// Fallback for old browsers to support sticky positioning.
let elements = [];
['.viz'].forEach(selector => {
  elements = elements.concat(Array.from(document.querySelectorAll(selector)));
});
stickyBits(elements, { stickyBitStickyOffset: 0 });

// Initializes the scroller and the visualizations.
Promise.all([v1(),v2(),v3()]).then(([callbacksV1, callbacksV2, callbacksV3]) => {
  scroller([callbacksV1, callbacksV2, callbacksV3])
    .initialize();
});
/*
// Initializes the scroller and the visualizations.
Promise.all([v2()]).then(([callbacksV2]) => {
  scroller([callbacksV2])
    .initialize();
});

// Initializes the scroller and the visualizations.
Promise.all([v3()]).then(([callbacksV3]) => {
  scroller([callbacksV3])
    .initialize();
});
*/
