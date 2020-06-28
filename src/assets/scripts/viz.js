/**
 * viz.js
 * =======
 * File used to define a visualization section.
 */

// const { map } = require("core-js/fn/array");

/**
 * Initializes the visualization
 *
 * @returns {Promise<*>}  A promise that contains a list of callbacks.
 */
async function initialize(L, d3, localization){
  "use strict";
  
  const dates = await d3.csv('./data/dates.csv');
  let dateIndex = 0
  const startDate = "20/01/26";
  const startRegion = "canada";

  /***** Creation of map *****/
  mapSettings = new mapSettings(L, d3, startDate, startRegion);
  mapSettings.mapSettingsInitViz();
  await mapSettings.mapSettingsCreateSources();
  mapSettings.mapSettingsInitMap();
  mapSettings.mapSettingsCreateTooltip();
  
  /***** Creation of histogram *****/
  histogramSettings = new histogramSettings(d3, localization, startDate);
  histogramSettings.configHistogram();
  histogramSettings.setScales();
  histogramSettings.createHistSvg();
  await histogramSettings.histCreateDataset();
  histogramSettings.initHistTip();
  histogramSettings.histCreateVisualisation();

  /***** Creation of matrix *****/
  matrixSettings = new matrixSettings(d3, localization, startDate);
  matrixSettings.configMatrix();
  matrixSettings.setScales();
  matrixSettings.createMatrixSvg();
  await matrixSettings.matrixCreateDataset();
  matrixSettings.initMatrixTip();
  matrixSettings.matrixSetupToggleButton();
  matrixSettings.matrixCreateVisualisation();

  /***** Initialize viz *****/
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

  // const visContainer = d3.select('#viz');
  const mapContainer = d3.select('#map');

  const svg = mapContainer.append('svg')
    .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid');
  const g = svg.append('g')
    .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

  return dates.map(d => {

    return direction => {
      if (direction == "down"){
        dateIndex = dateIndex >= dates.length-1 ? dates.length-1 : dateIndex + 1
      }
      else{
        dateIndex = dateIndex <= 0 ? 0 : dateIndex - 1
      }
      console.log(direction)
      console.log(dateIndex); // Log the current scroll direction.
      mapSettings.mapSettingsUpdateDate(dates[dateIndex]["date"])
    }
  });
};