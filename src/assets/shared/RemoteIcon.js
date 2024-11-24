import React from "react";
/**
 * Icon
 * Uses remote images
 
* remote image name without extension
 * @param {String} name 
 * 
 * Alternative name for image
 * @param {String} alt 
 * 
 *  icon height (tailwindcss)
 * @param {String} h
 * 
*  icon width (tailwindcss)
 * @param {String} w
 * */
export const RemoteIcon = ({ name, alt, h, w, color, localStyles }) => (
  <img
    className={`${h || "h-6"} ${w || "w-6"} pl-[5px] pr-[5px] ${localStyles}`}
    src={`https://d3upyygarw3mun.cloudfront.net/${name}.svg`}
    alt={`${name || alt || "icon"}`}
  />
);
