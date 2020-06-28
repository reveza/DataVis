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
export function getToolTipText(d) {
  var tooltipText = 
  '<span class="name">Date de l\'épisode: </span><span class="value">' +
  d.date +
  '</span><br/>' +
  '<span class="name">Genre: </span><span class="value">' +
  d.gender +
  '</span><br/>'
 return (tooltipText);
}
