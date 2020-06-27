/**
 * viz.js
 * =======
 * File used to define a visualization section.
 */

import * as d3 from 'd3';
import { initializeHistogram, histCreateDataset } from './histogrammeScripts/main';
import { histInitializeData, histDomainX, histDomainY, histSetStatus, histDomainColor } from './histogrammeScripts/preprocessing';
import { histCreateAxes, histCreateBarChart, histLegend } from './histogrammeScripts/chart';

var dateParser = d3.timeParse("%Y-%m-%d");

const config = {
  height: 500,
  margin: {
    bottom: 100,
    left: 100,
    right: 100,
    top: 100
  },
  width: 500
}

const fullWidth = config.margin.left + config.width + config.margin.right;
const fullHeight = config.margin.top + config.height + config.margin.bottom;

const visContainer = d3.select('#viz');

const svg = visContainer.append('svg')
  .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
  .attr('preserveAspectRatio', 'xMidYMid');

const g = svg.append('g')
  .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

/**
 * Initializes the visualization
 *
 * @returns {Promise<*>}  A promise that contains a list of callbacks.
 */ 
export async function initialize() {
  // Dates used for Timeline
  const timelineDates = await d3.csv('./data/dates.csv');

  // Dataset for Histogram (Bubble Bar Chart)
  var filepath = "./data/Stats_de_nerds.csv";
  const rawDataset = await d3.csv(filepath);
  var histogramDataset = histInitializeData(rawDataset);

  // Initialize Histogram
  var startDate = "2020-01-15";
  var initialDataset = filterDatasetBetweenDates(histogramDataset, startDate, "2020-01-15");
  // initializeHistogram(g, config, initialDataset);

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

  histCreateBarChart(g, initialDataset, x, y, r, color, tip);

 
  return timelineDates.map(d => {
    return direction => {
      var subDataset = filterDatasetBetweenDates(histogramDataset, startDate, d.date);

      var y_iterators = [0,0,0,0,0,0,0];
      var x_iterators = [0,0,0,0,0,0,0];
      var maxCircle = 0;

      g.selectAll(".bar,.label")
        .remove()
        .exit()
        .data(subDataset)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) {
          var index = x.domain().findIndex(function(n) { return n == d.ageGroup });
          var position = 2 * r * x_iterators[index];
          
          if (position < x.bandwidth() - 10) {
            x_iterators[index] += 1;
            return x(d.ageGroup) + position;
          } else {
            maxCircle = x_iterators[index];
            x_iterators[index] = 1;
            return x(d.ageGroup);
          }
        })
        .attr("cy", function (d) {
          var index = x.domain().findIndex(function(n) { return n == d.ageGroup });
          var position = 2 * r * Math.floor(y_iterators[index] / (maxCircle));
          y_iterators[index] += 1;
          return y(position + r);
        })
        .attr("r", r)
        .style("fill", function(d) {
            return color(d.status);
        })
        
    }
  });
}

function filterDatasetBetweenDates(dataset, startDate, endDate) {
  startDate = dateParser(startDate);
  endDate = dateParser(endDate);
  return dataset.filter(function(row) {
    return dateParser(row.date) >= startDate && dateParser(row.date) <= endDate;
  });
}
