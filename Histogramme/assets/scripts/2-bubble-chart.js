"use strict";

/**
 * File used to draw the bubble chart.
 */


/**
 * Creates the bubble graph axis.
 *
 * @param g       The SVG group in which the bubble chart will be drawn.
 * @param xAxis   The X axis. 
 * @param yAxis   The Y axis.
 * @param height  The graphic's height.
 * @param width   The graphic's width.
 */
function createAxes(g, xAxis, yAxis, height, width) {
  // TODO: Draw the X and Y axes.
  g.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + " )")
    .call(xAxis);
  g.append("text")
    .attr("class", "x label")
    .text("Groupe d'âge")
    //Theres probably a better way to do this than just hardcode it
    .attr("transform", "translate(" + (width - 50) + "," + (height + 30) +")");
  /*g.append("g")
    .attr("class","y axis")
    .call(yAxis);
  g.append("text")
    .attr("class","y label")
    .text("Nombre d'individus")
    //Same here
    .attr("transform","translate(" + 17 + "," + 100 + "), rotate(-90)");*/
}

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

  
    function createBarChart(g, data, x, y, r, color, tip) {
      var y_iterators= [0,0,0,0,0,0,0]
      var x_iterators= [0,0,0,0,0,0,0]
      var maxCircle=0
      var bars=g.selectAll(".bar,.label")
      .data(data)
      .enter()
      .append("circle")
      .attr("class","dot")
      .attr("cx",function(d){
        var index=x.domain().findIndex(function(n){return n==d.ageGroup})
        var position = 2*r*x_iterators[index]
        if(position<x.bandwidth()-10){
          x_iterators[index]+=1;
          return x(d.ageGroup)+position;
        }
        else{
          maxCircle=x_iterators[index];
          x_iterators[index]=0;
          return x(d.ageGroup);
        }
      })
      //.attr("height", x.bandwidth())
      .attr("cy",function (d) {
        var index=x.domain().findIndex(function(n){return n==d.ageGroup})
        var position = 2*r*Math.floor(y_iterators[index]/(maxCircle+1));
        y_iterators[index]+=1
        return y(position+r);
      })
      .attr("r",r)
      .style("fill",function(d){
          return color(d.status);
      });
    //Add percentage to the right of each bars
    /*bars.append("text")
      .attr("class", "label")
      .attr("cy", function (d) {
        return 10;
      })
      .attr("x", function (d) {
        return 10 + 3;
      });
*/

    }
