import * as d3 from "d3";
import d3Tip from "d3-tip"

import {createHistogram} from "./histogram.js"
import {createBubbleMatrix} from "./matrix-chart"
import {initializeData, domainX, domainY, domainColor} from "./preproc"
import {getToolTipText} from "./tooltip"
import {createBubbles, getLegend, addXAxis} from "./viz-setup"


import * as L from 'leaflet';
import * as localization from '../../assets/libs/localization-fr.js';


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

const visContainer = d3.select('#viz3');

const svg = visContainer.append('svg')
  .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
  .attr('preserveAspectRatio', 'xMidYMid');

const g = svg.append('g')
  .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);


export async function initialize() {
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
    // var svg = d3.select("body")
    // .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom);



    var files = ["./data/Stats_de_nerds.csv"]
    var dataset=[];
    /***** Data loading *****/
    Promise.all(files.map(url => d3.csv(url))).then(function (results) {
        var currentViz = "Histogram"
        // var currentData = results[0]
        var tip = d3Tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0]);

        /***** Data preprocessing *****/
        results.forEach(function (data) {
        dataset = initializeData(data);
        data.sort(function(a, b) {
            return d3.ascending(a.date, b.date);
        })
        });
    
        domainX(x);
        domainY(y);
        domainColor(color, results, null);
        //domainRadius(r, currentData);
        
        /***** Creation of the chart *****/
        addXAxis(g, xAxis, yAxis, height, width);
        getLegend(g, width, height, color, results, null);
        createBubbles(g, dataset, x, y, r);

        //Addition of the force through the creation o the bubble matrix
        var simulationForce = createBubbleMatrix(g, dataset, width, height, r, color, tip, x.domain(), y.domain())
        simulationForce.stop();
        d3.selectAll("text.transmissionTitle").attr("opacity", 0);
        createHistogram(g, dataset, x, y, r, color, tip);

        /***** Transitions between Histogram & Bubble Chart. *****/
        var toggleButtons = d3.selectAll(".toggle-buttons > button");
        toggleButtons.on("click", function(d, i) {

        currentViz = d3.select(this).text();
            toggleButtons.classed("active", function() {
            return currentViz === d3.select(this).text();
            });

            if(currentViz == "Histogram"){            
            createHistogram(g, dataset, x, y, r,color, tip);
            d3.selectAll("text.transmissionTitle").attr("opacity", 0);
            if(simulationForce != null){ simulationForce.alpha(0)}
            } else {
            d3.selectAll("text.transmissionTitle").attr("opacity", 1);
            simulationForce = createBubbleMatrix(g, dataset, width, height, r, color, tip, x.domain(), y.domain());
            }
        });
        

        
        /***** Creation of the tooltip *****/
        tip.html(function(d) {
        return getToolTipText.call(this, d)
        });
        g.call(tip);
    });

  // Logic to initialize the visualization...

  return [
    () => console.log('Called when section 1 is visible.'),
    () => console.log('Called when section 2 is visible.'),
    () => console.log('Called when section 3 is visible.'),
    () => console.log('Called when section 4 is visible.')
  ]
}