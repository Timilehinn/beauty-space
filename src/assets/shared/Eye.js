import React from "react";
/**
 * Icon
 * Custom SVG Icons
 *
 * Background color
 * @param {String} fill
 *
 *  icon height (tailwindcss)
 * @param {String} h
 *
 * icon width
 * @param {String} w
 *
 *  icon outline color e.g #fff
 * @param {String} fill
 * */

export const EyeIcon = ({ h, w, fill, color, onClick, others }) => (
  <svg
    {...others}
    onClick={onClick}
    viewBox={`0 0 22 16`}
    fill={`${fill || "none"}`}
    xmlns="http://www.w3.org/2000/svg"
    className={`${h || "h-4"} ${w || "w-4"}`}
  >
    <path
      d="M11 10C12.1046 10 13 9.10457 13 8C13 6.89543 12.1046 6 11 6C9.89543 6 9 6.89543 9 8C9 9.10457 9.89543 10 11 10Z"
      stroke="#141115"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M21 8C18.333 12.667 15 15 11 15C7 15 3.667 12.667 1 8C3.667 3.333 7 1 11 1C15 1 18.333 3.333 21 8Z"
      stroke="#141115"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
