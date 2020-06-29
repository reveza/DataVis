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
Promise.all([histogramVisualization(), mapVisualization()]).then(([callbacksV1, callbacksV2]) => {
  scroller([callbacksV1, callbacksV2])
    .initialize();
});
