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
function getToolTipText(d, formatNumber) {
  // TODO: Return the text to show in the tooltip, in the required format.
  //       Make sure you use the function "formatNumber" to correctly format the numbers.
  var tooltipText = 
 "Country: "+d.name.bold() +
 "<br>Life expentancy: "+ formatNumber(d.lifeExpectancy).bold()+ " years"+
 "<br>Income: "+ formatNumber(d.income).bold()+ " USD"+
 "<br>Population: "+ formatNumber(d.population).bold()+ " habitants"+
 "<br>World region: "+ d.zone.bold();
 
 return (tooltipText);
}
