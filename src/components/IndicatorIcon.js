import React from 'react';
import { PropTypes } from 'prop-types';

IndicatorIcon.propTypes = {
  alt: PropTypes.string,
  color: PropTypes.string,
  diameter: PropTypes.number.isRequired
};

function IndicatorIcon({ alt, diameter, color }) {
  return (
    <span
      data-uk-tooltip="pos: bottom-left"
      title={alt}
    >
      <svg
        height={diameter}
        width={diameter}
      >
        <title>{alt}</title>
        <circle
          cx={diameter * 0.5}
          cy={diameter * 0.5}
          fill={color || 'white'}
          r={diameter * 0.4}
          stroke={color || 'black'}
          strokeWidth="3"
        />
      </svg>
    </span>
  );
}

export default IndicatorIcon;
