/**
 * viz.js
 * =======
 * File used to define a visualization section.
 */

import * as d3 from 'd3';
import {mapConvertNumbers, mapCreateProportions, mapCreateSources} from './scripts/map/1-preproc';
import {initMap, createMapBorders, createMapCircles} from './scripts/map/2-map';

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
export async function initialize(){
  // const data = await d3.csv('./data/data.csv');

  /***** Loading data *****/
  let cases = {};
  cases['montreal'] = await d3.csv("./data/Montréal.csv");
  cases['quebec'] = await d3.csv("./data/Québec.csv");
  cases['canada'] = await d3.csv("./data/Canada.csv");

  let populations = {};
  populations['montreal'] = await d3.csv("./data/Montréal-Population.csv");
  populations['quebec'] = await d3.csv("./data/Québec-Population.csv");
  populations['canada'] = await d3.csv("./data/Canada-Population.csv");
  
  let canadaBorders = await d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson");
  let quebecBorders = await d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/quebec.geojson");
  let montrealBorders = await d3.json("./data/montreal_map.geojson");

      
  /***** Data preprocessing *****/
  mapConvertNumbers(cases, populations);

  let mtlAConfirmer = cases['montreal'].pop()['caseDates'];

  let data = mapCreateProportions(cases, populations);
  let sources = mapCreateSources(data)
  console.log(sources)

  /***** Map initialization *****/
  var mapSvg = initMap(L, map);
  var g = undefined;
  if (mapSvg) {
    g = mapSvg.select("g");
  }
  var path = createPath();

  createMapBorders(g, path, canadaBorders, showPanel);
  createMapCircles(g, canadaBorders, sources, path)
  map.on("moveend", function () {
    updateMap(mapSvg, g, path, canadaBorders, path);
  });
  updateMap(mapSvg, g, path, canadaBorders, path);

  //     /***** Information panel management *****/
  //     panel.select("button")
  //       .on("click", function () {
  //         reset(g);
  //         panel.style("display", "none");
  //       });

  // /**
  //  * Projects a point in the map.
  //  *
  //  * @param x   The point X to project.
  //  * @param y   The point Y to project.
  //  */
  // function projectPoint(x, y) {
  //   var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  //   this.stream.point(point.x, point.y);
  // }

  // /**
  //  * Traces a set of coordinates in the map
  //  *
  //  * @return {*}  The transformation to use
  //  */
  // function createPath() {
  //   var transform = d3.geoTransform({point: projectPoint});
  //   return d3.geoPath().projection(transform);
  // }

  


  
  // const rect = g.append('rect')
  //   .attr('width', config.width)
  //   .attr('height', config.height)
  //   .style('fill', 'green');

  // return data.map(d => {
  //   return direction => {
  //     console.log(direction); // Log the current scroll direction.
  //     rect.transition()
  //       .duration(300)
  //       .style('fill', d.color);
  //   }
  // });
  // return 
};