"use strict";

/**
 * @see https://gist.github.com/d3noob/9211665
 */

function initMap(L, map) {
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      maxZoom: 12,
      minZoom: 2
  }).addTo(map);
  map.setView([62, -97], 4);

  let svg = d3.select(map.getPanes().overlayPane).append("svg");
  svg.append("g").attr("class", "leaflet-zoom-hide");
      
  return svg;
}

function createBorders(g, path, canada, showPanel) {
  g.selectAll('path')
    .data(canada.features)
    .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'district')
      .style('fill', '#99ccff')
      .on('click', function(d) {
        d3.selectAll(".district").classed("selected",false);
        d3.select(this).classed("selected",true);
        showPanel(d.properties.NUMCF);
      });
}

function createCircles(g, canada, sources, circles) {
  g.selectAll('circle')
    .data(canada.features)
    .enter()
      .append('circle')
      .attr('r', 10)
      .attr('class', 'district')
      .attr('cx', function(d) {return circles.centroid(d)[0];})
      .attr('cy', function(d) {return circles.centroid(d)[1];})
      .style('fill', '#C52A0D');
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
function updateMap(svg, g, path, canada, circles) {
  let bounds = path.bounds(canada);
  
  let leftBound = bounds[0][0];
  let rightBound = bounds[1][0];
  let topBound = bounds[0][1];
  let bottomBound = bounds[1][1];
  
	svg.attr("width", rightBound - leftBound)
  .attr("height", bottomBound - topBound)
  .style("left", leftBound + "px")
  .style("top", topBound + "px");
  
  g.selectAll('circle')
    .attr('cx', function(d) {return circles.centroid(d)[0];})
    .attr('cy', function(d) {return circles.centroid(d)[1];})

  g.attr("transform", "translate(" + -leftBound + "," + -topBound + ")");

  d3.selectAll('.district').attr('d', path);
}
