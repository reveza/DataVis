"use strict";

/**
 * File allowing to define the text to be shown in the tooltip.
 */


export function histGetToolTipText(d) {
  var tooltipText = 
    "Date: " + d.date.bold() +
    "<br>Groupe d'âge: " + d.ageGroup.bold() + " ans" +
    "<br>Genre: " + d.gender.bold() +
    "<br>État de santé: " + d.status.bold();
 
  return tooltipText;
}
