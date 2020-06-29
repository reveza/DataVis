/**
 * Main file allowing to display the required chart. This file uses the other files that you have to complete.
 */

import * as d3 from 'd3';
import { histDomainX, histDomainY, histSetStatus, histDomainColor } from './preprocessing';

export default class HistogramSettings {
  constructor(width, height, r) {
    this.width = width;
    this.height = height;
    this.r = r;
    this.status = histSetStatus();
    this.color = histDomainColor(this.status);
    this.x = d3.scaleBand().range([0, width]).padding(0.1);
    this.y = d3.scaleBand().range([height, 0]).padding(0.1);
    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y);
    histDomainX(this.x);
    histDomainY(this.y);
    histDomainColor(this.color);
  }
}