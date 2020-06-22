"use strict";

/**
 * File allowing to define the text to be shown in the tooltip.
 */

/**
 * Retrieves the text associated with the tooltip.
 *
 * @param d               Data associated to the currently hovered circle.
 * @param formatNumber    Function that allows you to correctly format numbers.
 * @return {string}       The text to show in the tooltip.
 */
function getToolTipText(d) {
  var tooltipText = 
 "Country: "+d.id +
 "<br>Gender: "+ d.gender +
 "<br>Date: "+ d.date ;
 return (tooltipText);
}
