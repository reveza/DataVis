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
  var tooltipText = 
 "Country: "+d.name.bold() +
 "<br>Life expentancy: "+ formatNumber(d.lifeExpectancy).bold()+ " years"+
 "<br>Income: "+ formatNumber(d.income).bold()+ " USD"+
 "<br>Population: "+ formatNumber(d.population).bold()+ " habitants"+
 "<br>World region: "+ d.zone.bold();
 
 return (tooltipText);
}
