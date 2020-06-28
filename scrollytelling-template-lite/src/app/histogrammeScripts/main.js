/**
 * Main file allowing to display the required chart. This file uses the other files that you have to complete.
 */

import * as d3 from 'd3';
import * as d3Tip from 'd3-tip';
import { histInitializeData, histDomainX, histDomainY, histSetStatus, histDomainColor } from './preprocessing';
import { histCreateAxes, histCreateBarChart, histLegend } from './chart';
import { histTransition } from './transition';
import { histGetToolTipText } from './tooltip'

export async function initializeHistogram(g, config, dataset) {
  var margin = config.margin;

  var width = config.height;
  var height = config.width;

  var r = 5;

  const status = histSetStatus();
  const color = histDomainColor(status);

  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);
  
  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  var tip = null; // TODO, reimplement tip

  histDomainX(x);
  histDomainY(y);
  histDomainColor(color);
  histCreateAxes(g, xAxis, yAxis, height, width);
  histLegend(g, histogramDataset, color);
}

function sortDataset(dataset) {
  dataset.sort((a,b) => {
    return status.indexOf(a.status) - status.indexOf(b.status);
  });
  return dataset;
}


async function histCreateDataset(status, x, y, color, filepath) {
  var files = ["./data/Stats_de_nerds.csv"]
  var results = await Promise.all(files.map(url => d3.csv(url)));
  var dataset = null;
  
  results.forEach((file) => {
    dataset = histInitializeData(file);
    dataset.sort((a,b) => {
      return status.indexOf(a.status) - status.indexOf(b.status);
    })
  });

  histDomainX(x);
  histDomainY(y);
  histDomainColor(color);

  return dataset;
}

// export default class histogramSettings {
//   constructor(d3, date) {
//     this.d3 = d3;
//     this.localization = d3.localization;
//     this.date = date;
//   }

//   initializeHistogram() {
//     this.status = histSetStatus();
//     this.color = histDomainColor(this.status);
//     this.configHistogram();
//     this.setScales();
//     this.createHistSvg();
//   }

//   /***** Configuration *****/
//   configHistogram() {
//     this.margin = {
//       top: 50,
//       right: 50,
//       bottom: 50,
//       left: 80
//     };

//     this.width = 1000 - this.margin.left - this.margin.right;
//     this.height = 600 - this.margin.top - this.margin.bottom;
//   }

//   /***** Scales *****/
//   setScales() {
//     //var colors = ["#2ca02c","#ff7f0e","#d62728","#9467bd"]
//     this.x = this.d3.scaleBand().range([0, this.width]).padding(0.1);
//     this.y = this.d3.scaleLinear().range([this.height, 0]);
//     this.r = 5;
//     this.xAxis = this.d3.axisBottom(this.x);
//     this.yAxis = this.d3.axisLeft(this.y);
//     // this.yAxis = this.d3.axisLeft(this.y).tickFormat(this.localization.numberFormat("$,.2f"));
//   }
  
//   /***** Creation of the required svg elements *****/
//   createHistSvg() {    
//     this.svg = this.d3.select("body")
//       .append("svg")
//       .attr("width", this.width + this.margin.left + this.margin.right)
//       .attr("height", this.height + this.margin.top + this.margin.bottom);
 
//     this.bubbleChartGroup = this.svg.append("g")
//       .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

//   }

//   /***** Loading of data *****/
//   async histCreateDataset(filepath) {
//     var files = ["./data/Stats_de_nerds.csv"]
//     var results =  await Promise.all(files.map(url => this.d3.csv(url)));
    
//     results.forEach((data) => {
//       this.dataset = histInitializeData(data);
//       this.dataset.sort((a,b) => {
//           return this.status.indexOf(a.status) - this.status.indexOf(b.status);
//       })
//     });

//     histDomainX(this.x);
//     histDomainY(this.y);
//     histDomainColor(this.color);
//   }
  
//   histCreateVisualisation() {

//     /***** Creation of the bubble chart *****/
//     histCreateAxes(this.bubbleChartGroup, this.xAxis, this.yAxis, this.height, this.width);
//     histCreateBarChart(this.bubbleChartGroup, this.dataset, this.x, this.y, this.r, this.color, this.tip);
    
//     /***** Creation of the legend *****/
//     histLegend(this.svg, this.dataset, this.color);
//   }


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


// async function createDataset(filepath) {

  
//   var rawDataset = await d3.csv(filepath);
//   var dataset = histInitializeData(rawDataset);
//   console.log(dataset);
//   return dataset;

//   // d3.csv(filepath).then(function(data) {
//   //   console.log(data);
//   //   dataset = histInitializeData(data);
//   //   console.log(dataset);
//   //   return dataset;
//   // }, function(error, rows) {
//   //   console.log(rows);
//   // });
// }