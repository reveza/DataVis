/**
 * Main file allowing to display the required chart. This file uses the other files that you have to complete.
 */

import * as d3 from 'd3';
import * as d3Tip from 'd3-tip';
import { histInitializeData, histDomainX, histDomainY, histSetStatus, histDomainColor } from './preprocessing';
import { histCreateAxes, histCreateBarChart, histLegend } from './chart';
import { histTransition } from './transition';
import { histGetToolTipText } from './tooltip'

export default class HistogramSettings {
  constructor(width, height, r) {
    this.width = width;
    this.height = height;
    this.r = r;
    this.status = histSetStatus();
    this.color = histDomainColor(this.status);
    this.x = d3.scaleBand().range([0, width]).padding(0.1);
    this.y = d3.scaleLinear().range([height, 0]);
    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y);

    histDomainX(this.x);
    histDomainY(this.y);
    histDomainColor(this.color);
  }
}
//   /***** Creation and initialization of tip *****/
//   initHistTip() {
//     this.tip = d3Tip()
//       .attr('class', 'd3-tip')
//       .offset([-10, 0]);

//     this.tip.html(function(d) {
//       return histGetToolTipText.call(this, d);
//     });
//     this.bubbleChartGroup.call(this.tip  );
//   }
// }