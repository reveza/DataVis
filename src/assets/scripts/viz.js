/**
 * viz.js
 * =======
 * File used to define a visualization section.
 */


/**
 * Initializes the visualization
 *
 * @returns {Promise<*>}  A promise that contains a list of callbacks.
 */
async function initialize(L, d3, topojson, localization){
  
  const dates = await d3.csv('./data/dates.csv');

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
  const mapContainer = d3.select('#map');

  const svg = mapContainer.append('svg')
    .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid');
  const g = svg.append('g')
    .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);
  
  const myMap = g.append('map')
    .attr('width', config.width)
    .attr('height', config.height)

  // console.log(myMap)  
  // const rect = g.append('rect')
  //   .attr('width', config.width)
  //   .attr('height', config.height)
  //   .style('fill', 'green');

  return dates.map(d => {
    return direction => {
      console.log(direction); // Log the current scroll direction.
      myMap.transition()
        .duration(300)
        .style('fill', d.color);
    }
  });
  return 
};