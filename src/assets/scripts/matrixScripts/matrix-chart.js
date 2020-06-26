"use strict";

/**
 * Crée le graphe à bulles.
 *
 * @param g       The SVG group in which the bubble chart will be drawn.
 * @param data    Data to use.
 * @param width   Width of the svg group.
 * @param height  Height of the svg group.
 * @param r       Scale for the circles' radiuses.
 * @param color   Scale for the circles' color.
 * @param tip     Tooltip to show when a circle is hovered.
 * @param domainX Domain of x -> age group
 * @param domainY Domain of y -> transmission type
 */

function matrixCreateBubbleMatrix(g, data, width, height, r, color, tip, domainX , domainY) {
  
  // Location to move the cicrcles towards
  var ageTTCenters = {}
  var sizeXgroup = width / (domainX.length + 1);
  var sizeYgroup = height / (domainY.length + 1);
  var titlesPosition ={}

  domainY.forEach((y,j) => (
    titlesPosition[y] = (j + 1) * sizeYgroup,
    domainX.forEach((x,i) => (
      titlesPosition[x] = (i+1) * sizeXgroup,
      ageTTCenters[x.concat(y)] =  {
        "x": (i + 1) * sizeXgroup, 
        "y": (j + 1) * sizeYgroup 
      })))
  );

  // Show titles according to bubbles positions
  g.selectAll('.titles')
    .data(domainY)
    .enter()
    .append('text')
    .attr('class', 'transmissionTitle')
    .attr("opacity",1)
    .attr('x', 0)
    .attr('y', function(d){ return titlesPosition[d]})
    .text(function (d) { return d;})
    .attr("transform", "translate(0, -80)");

  // Force applied to each node for it to go to its respective positions
  var forceStrength = 0.03;
  var charge = -Math.pow(r, 2.0) * forceStrength;
  var simulation = d3.forceSimulation(data)
    // .velocityDecay(0.25)
    .force('x', d3.forceX().x(d => nodePosition(d).x))
    .force('y', d3.forceY().y(d => nodePosition(d).y))
    .force('collision', d3.forceCollide().radius(r))
    .force('charge', d3.forceManyBody().strength(-1))
    .on('tick', ticked);

  
  function ticked() {
    var bubbles = g.selectAll("circle").data(data)
      .attr('r', r)
      .on('mouseover', function(d){ tip.show(d);})
      .on('mouseout', function(d) { tip.hide();})
      // .merge(bubbles)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("fill", function(d) { return color(d.status); });

    bubbles.exit().remove();
  }

  function nodePosition(d) {
    return ageTTCenters[d.ageGroup.concat(d.transmission)];
  }
  
  return simulation;
}
