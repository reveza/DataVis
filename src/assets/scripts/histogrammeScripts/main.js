/**
 * Main file allowing to display the required chart. This file uses the other files that you have to complete.
 */

class histogramSettings{
  constructor(d3, localization, date){
    this.d3 = d3;
    this.localization = localization
    this.date = date;
  }

  /***** Configuration *****/
  configHistogram() {
    this.margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 80
    };
    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;
  
  }

  /***** Scales *****/
  setScales(){
    //var colors = ["#2ca02c","#ff7f0e","#d62728","#9467bd"]
    this.status=histSetStatus();
    this.color =histDomainColor(this.status);
    this.x = d3.scaleBand().range([0, this.width]).padding(0.1);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.r = 5;
    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y).tickFormat(this.localization.getFormattedNumber);
  }
  
  /***** Creation of the required svg elements *****/
  createHistSvg(){    
    this.svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
 
    this.bubbleChartGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  /***** Loading of data *****/
  async histCreateDataset(){
    var files = ["./data/Stats_de_nerds.csv"]
    var results =  await Promise.all(files.map(url => d3.csv(url)));
    results.forEach((data) => {
      this.dataset=histInitializeData(data);
      console.log(this.dataset)
      this.dataset.sort((a,b) => {
          
          return this.status.indexOf(a.status)-this.status.indexOf(b.status);
        })
      });
  }

  /***** Creation and initialization of tip *****/
  initHistTip() {
    this.tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0]);

    this.tip.html(function(d) {
      return histGetToolTipText.call(this, d, localization.getFormattedNumber)
    });
    this.bubbleChartGroup.call(this.tip);
  }
}

(function (d3, localization) {
  "use strict";

  /***** Configuration *****/
  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 80
  };
  var width = 1000 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  /***** Scales *****/

  //var colors = ["#2ca02c","#ff7f0e","#d62728","#9467bd"]
  var status=histSetStatus();
  var color =histDomainColor(status);
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);
  var r = 5;

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y).tickFormat(localization.getFormattedNumber);

  /***** Creation of the required svg elements *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var bubbleChartGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var files = ["./data/Stats_de_nerds.csv"]
  var dataset=[];
  /***** Data loading *****/
  Promise.all(files.map(url => d3.csv(url))).then(function (results) {
      console.log(results)
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);

      /***** Data preprocessing *****/
      results.forEach(function (data) {
      dataset=histInitializeData(data);
      dataset.sort(function(a, b) {
          return status.indexOf(a.status)-status.indexOf(b.status);
        })
      });

      histDomainX(x);
      histDomainY(y);
      histDomainColor(color);

      /***** Creation of the bubble chart *****/
      histCreateAxes(bubbleChartGroup, xAxis, yAxis, height, width);
      histCreateBarChart(bubbleChartGroup, dataset, x, y, r, color, tip);

      /***** Creation of the legend *****/
      histLegend(svg, dataset, color);
      
      /***** Creation of the tooltip *****/
      tip.html(function(d) {
        return histGetToolTipText.call(this, d, localization.getFormattedNumber)
      });
      bubbleChartGroup.call(tip);
    });

})(d3, localization);
