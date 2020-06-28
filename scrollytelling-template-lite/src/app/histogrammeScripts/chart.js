"use strict";

/**
 * File used to draw the bubble chart.
 */

import d3Tip from 'd3-tip';
import { histGetToolTipText } from './tooltip'

/**
 * Crée le graphique à bulles.
 *
 * @param g       The SVG group in which the bubble chart will be drawn.
 * @param data    Data to use.
 * @param x       Scale for the X axis.
 * @param y       Scale for the Y axis.
 * @param r       Scale for the circles' radiuses.
 * @param color   Scale for the circles' color.
 * @param tip     Tooltip to show when a circle is hovered.
 */

export function createOrUpdateHistogram(g, data, x, y, r, color) {
  var y_iterators = [0,0,0,0,0,0,0];
  var x_iterators = [0,0,0,0,0,0,0];
  var maxCircle = 0;

  var tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 100]);

  g.selectAll(".dot,.label")
    .remove()
    .exit()
    .data(data)
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
      var position = 0
      if (maxCircle) {
        position = 2 * r * Math.floor(y_iterators[index] / (maxCircle));
      }
      y_iterators[index] += 1;
      return y(position + r);
    })
    .attr("r", r)
    .style("fill", function(d) {
        return color(d.status);
    })
    .on("mouseover", function(d) {
      tip.show(d, this);
      tip.style("position","fixed")
      tip.style('top', 650+"px");
      tip.style('left', event.clientX+"px");

    })
    .on("mouseout", tip.hide);

    tip.html(function(d) {
      return histGetToolTipText.call(this, d);
    });
  
    g.call(tip);
}

/**
 * Creates the bubble graph axis.
 *
 * @param g       The SVG group in which the bubble chart will be drawn.
 * @param xAxis   The X axis. 
 * @param yAxis   The Y axis.
 * @param height  The graphic's height.
 * @param width   The graphic's width.
 */
export function histCreateAxes(g, xAxis, yAxis, height, width) {
  g.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + " )")
    .call(xAxis);
  g.append("text")
    .attr("class", "x label")
    .text("Groupe d'âge")
    //Theres probably a better way to do this than just hardcode it
    .attr("transform", "translate(" + (width - 50) + "," + (height + 30) +")");
}

/**
 * Create a legend from the given source.
 *
 * @param svg       SVG element to use in order to create the legend.
 * @param sources   Data sorted by street name and by date.
 * @param color     The 10-color scale to use.
 */
export function histLegend(svg, sources, color) {
  var boxSize = 12;
  var spaceBetweenBoxes = 10;
  var xLegend = 0;
  var yLegend = 0;

  var legend = svg.selectAll(".legend")
    .data(Object.keys(color))
    .enter()
    .append("g")
    .attr("class", "legend");

  // Add rectangle boxes
  legend.append("rect")
      .attr("name", d => color.domain())
      .attr("x", xLegend)
      .attr("y", function(d, i) { return yLegend + i * (boxSize + spaceBetweenBoxes) })
      .attr("width", boxSize)
      .attr("height", boxSize)
      .style("fill", d => color(d))
      .attr("stroke", "#000000") // black stroke, stroke-width = 1 by default
      .attr("visible", "true");
  
  // Add legend text description
  legend.append("text")
      .attr("x", xLegend + 25)
      .attr("y", function(d, i) { return yLegend + 7 + i * (boxSize + spaceBetweenBoxes) }) // offset to center text
      .text(function(d, i) {
        return color.domain()[i];
      })
      .style("fill", d => color(d))
      .style("alignment-baseline", "middle");
}

/***** Creation and initialization of tip *****/
export function initHistTip() {
    this.tip = d3Tip()
      .attr('class', 'd3-tip')

    this.tip.html(function(d) {
      return histGetToolTipText.call(this, d);
    });
    this.bubbleChartGroup.call(this.tip);
}