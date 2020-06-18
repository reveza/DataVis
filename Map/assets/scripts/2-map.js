"use strict";

/**
 * File to generate the display of the map. 
 */


/**
 * Initializes the background of the map that must be used and the position of the initial display. 
 *
 * @param L     The Leaflet context.
 * @param map   The Leaflet map.
 *
 * @see https://gist.github.com/d3noob/9211665
 */
function initTileLayer(L, map) {

    /* TODO: Initialize the "tileLayer" with the following properties:
       - URL du fond de carte: https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png;
       - Zoom maximum: 10;
       - Zoom minimum: 1.

     Set the initial view of the map with the following values:
       - Coordonnées: [57.3, -94.7];
       - Niveau de zoom: 4.
   */

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      maxZoom: 10,
      minZoom: 1
  }).addTo(map);
  map.setView([57.3, -94.7], 4);
}

/**
 * Initializes the SVG context to be used on top of the Leaflet map. 
 *
 * @param map   The Leaflet map. 
 * @return      the created SVG element. 
 *
 * @see https://gist.github.com/d3noob/9211665
 */
function initSvgLayer(map) {
  // TODO: Create the SVG element basing yourself on the above example. Make sure to create a "g" element in the SVG element. 
  let svg = d3.select(map.getPanes().overlayPane).append("svg");
  svg.append("g").attr("class", "leaflet-zoom-hide");
      
  return svg;
}

/**
 * Creates the traces for the districts on the SVG context aboove the Leaflet map. 
 *
 * @param g             The group where you should create the traces for the districts. 
 * @param path          The function used to trace the geometric entities according to the appropriate projection
 * @param canada        The geographic entities used to trace the districts. 
 * @param sources       The data containing the information on each district. 
 * @param color         The color scale mapping to each party. 
 * @param showPanel     The function called to display the panel. 
 */
function createDistricts(g, path, canada, sources, color, showPanel) {
  /* TODO: Create the traces for the districts. Make sur to follow these specs: 
       - The color of the district should correspond to the party of the winning candidate
       - The fill-opacity should be 80%;
       - The color of the strokes should be "#333";
       - When a district is clicked, it should get selected (class "selected") and the information panel 
         associated with the riding should appear (use showPanel). Note it is only possible to select one
         riding at a time. 
   */
  
  g.selectAll('g')
    .data(canada.features)
    .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'district')
      .style('fill', d => { return color(sources.find(element => element.id === d.properties.NUMCF).results[0].party)})
      .on('click', function(d) {
        d3.selectAll(".district").classed("selected",false);
        d3.select(this).classed("selected",true);
        showPanel(d.properties.NUMCF);
      })
}

/**
 * Upate the position and the size of the SVG element, the position of the group "g" and the display of the traces
 * when the position or the zoom of the map is modified. 
 *
 * @param svg       The SVG element used to trace the elements over the Leaflet map. 
 * @param g         The group where the traces of the districts are created. 
 * @param path      The function that should be used to trace the geometric entities according to 
 *                  the correct projection. 
 * @param canada    The geographic entities that should be used to trace the districts. 
 *
 * @see https://gist.github.com/d3noob/9211665
 */
function updateMap(svg, g, path, canada) {
  // TODO: Update the SVG element, the postion of the group "g" and the display of the traces based on the provided example
  let bounds = path.bounds(canada);

  let leftBound = bounds[0][0];
  let rightBound = bounds[1][0];
  let topBound = bounds[0][1];
  let bottomBound = bounds[1][1];

	svg.attr("width", rightBound - leftBound)
		 .attr("height", bottomBound - topBound)
		 .style("left", leftBound + "px")
		 .style("top", topBound + "px");

  g.attr("transform", "translate(" + -leftBound + "," + -topBound + ")");

  d3.selectAll('.district').attr('d', path);
}
