/**
 * Main file allowing to display the required chart. This file uses the other files that you have to complete.
 */
(function (d3, localization) {
  "use strict";

  /***** Configuration *****/
  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 80
  };
  var width = 1300 - margin.left - margin.right;
  var height = 800 - margin.top - margin.bottom;

  /***** Scales *****/
  var color = d3.scaleOrdinal();
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleBand().range([height, 0]).padding(0.1);
  var r = 5;

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  /***** Creation of the required svg elements *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var vizChartGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var files = ["./data/Stats_de_nerds.csv"]
  var dataset = [];

  /***** Data loading *****/
  Promise.all(files.map(url => d3.csv(url))).then(function (results) {
      var currentViz = "Histogram"
      // var currentData = results[0]
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);

      /***** Data preprocessing *****/
      results.forEach(function (data) {
        dataset = matrixInitializeData(data);
        data.sort(function(a, b) {
          return d3.ascending(a.date, b.date);
        })
      });
    
      matrixDomainX(x);
      matrixDomainY(y);
      matrixDomainColor(color, results, null);
      //domainRadius(r, currentData);
      
      /***** Creation of the chart *****/
      matrixAddXAxis(vizChartGroup, xAxis, yAxis, height, width);
      matrixGetLegend(vizChartGroup, width, height, color, results, null);
      matrixCreateBubbles(vizChartGroup, dataset, x, y, r);

      //Addition of the force through the creation o the bubble matrix
      var simulationForce = matrixCreateBubbleMatrix(vizChartGroup, dataset, width, height, r, color, tip, x.domain(), y.domain())
      simulationForce.stop();
      d3.selectAll("text.transmissionTitle").attr("opacity", 0);
      matrixCreateHistogram(vizChartGroup, dataset, x, y, r, color, tip);

      /***** Transitions between Histogram & Bubble Chart. *****/
      var toggleButtons = d3.selectAll(".toggle-buttons > button");
      toggleButtons.on("click", function(d, i) {

        currentViz = d3.select(this).text();
          toggleButtons.classed("active", function() {
            return currentViz === d3.select(this).text();
          });

          if (currentViz == "Histogram") {            
            matrixCreateHistogram(vizChartGroup, dataset, x, y, r,color, tip);
            d3.selectAll("text.transmissionTitle").attr("opacity", 0);
            if (simulationForce != null) { 
              simulationForce.alpha(0)
            }
          } else {
            d3.selectAll("text.transmissionTitle").attr("opacity", 1);
            simulationForce = matrixCreateBubbleMatrix(vizChartGroup, dataset, width, height, r, color, tip, x.domain(), y.domain());
          }
        });
      
      /***** Creation of the tooltip *****/
      tip.html(function(d) {
        return matrixGetToolTipText.call(this, d)
      });
      vizChartGroup.call(tip);
    });

}) (d3, localization);
