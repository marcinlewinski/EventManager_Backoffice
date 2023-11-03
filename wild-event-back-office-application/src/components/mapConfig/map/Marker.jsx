import React from "react";

const Marker = ({ children, index }) => {
    return (
      <button className="marker">
        {index}
        {children}
      </button>
    );
  };

  export default Marker;