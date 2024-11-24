import React from "react";

const Spacer = ({ width = 0, height = 0 }) => {
  return <div style={{ width: `${width}px`, height: `${height}px` }} />;
};

export default Spacer;
