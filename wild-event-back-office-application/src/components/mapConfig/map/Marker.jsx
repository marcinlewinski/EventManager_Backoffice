import React from "react";

const Marker = ({ children, index }) => {
    return (
      <button className="marker">
        {children}
      </button>
    );
  };

  export default Marker;