/**
 * viz.js
 * =======
 * File used to define a visualization section.
 */

import * as d3 from 'd3';
import histogramSettings from './histogrammeScripts/main';
import testRectangle from './testRect'


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


const startDate = "20/01/26";

/**
 * Initializes the visualization
 *
 * @returns {Promise<*>}  A promise that contains a list of callbacks.
 */ 
export async function initialize() {
  // const data = await d3.csv('./data/data.csv');
  const data = await d3.csv('./data/dates.csv'); 
 
  
  // let histogram = new histogramSettings(d3, startDate);
  // // histogram.createHistSvg();
  // histogram.initializeHistogram();
  // await histogram.histCreateDataset();
  // console.log(histogram.dataset);
  // // histogram.initHistTip();
  // histogram.histCreateVisualisation();

  // const rect = testRectangle(g);
  // rect.initializeRect(g);

  const rect = g.append('rect')
    .attr('width', 500)
    .attr('height', 500)
    .style('fill', 'green');

  return data.map(d => {
    return direction => {
      console.log(direction); // Log the current scroll direction.
      console.log(d)
      // histogram.bubbleChartGroup.transition()
      //   .duration(300)
      //   .style('fill', d.color);
    }
  });
}
