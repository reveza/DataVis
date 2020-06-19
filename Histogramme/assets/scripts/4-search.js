"use strict";

/**
 * File that generates a search result's display.
 */


/**
 * 
 * Allows the highlight the country that was selected via the search bar.
 *
 * @param countrySelected     Name of the selected country.
 * @param g                   The SVG group in which the bubble chart will be drawn.
 */
function search(countrySelected, g) {
  console.log(countrySelected);
  /* TODO:
       - Highlight the selected country by coloring its circle in black and by setting its opacity to 100%.
       - Set the opacity to 15% for the circles associated to the other countries (different than "countrySelected").
   */
  // Change opacity and save current fill color as attribute
  var circle = g.selectAll("circle")
    .style("opacity", function(d) { return (d.name == countrySelected) ? "1.0" : "0.15"} )
    .attr("prev_color", function(d) { if (d.name == countrySelected) { return d3.select(this).style("fill") } } );

  // Modify fill color to black
  circle.style("fill", function(d) { return (d.name == countrySelected) ? "#000" : d3.select(this).style("fill") } );
  circle.style("pointer-events",function(d){return (d.name == countrySelected) ? "all" : "none";})
}

/**
 * Resets the display to its default state.
 *
 * @param g   The SVG group in which the bubble chart will be drawn.
 */
function reset(g) {
  // TODO: Reset the bubble chart display to its default state.
  var circles = g.selectAll("circle")
    .style("opacity", "0.9")
    .style("fill", function(d) { 
      return (d3.select(this).attr("prev_color") !== null) ? d3.select(this).attr("prev_color") : d3.select(this).style("fill") 
    })
    .style("pointer-events","all");

  circles.attr("prev_color", null);
}
