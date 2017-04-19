import React from 'react';
import { Link } from 'react-router';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { PropTypes } from 'prop-types';

SummaryBarCard.propTypes = {
  chartData: PropTypes.array,
  href: PropTypes.string,
  isActive: PropTypes.bool,
  lineOne: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  lineTwo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  tabIndex: PropTypes.number,
  title: PropTypes.string
};

export default function SummaryBarCard({ chartData, href, isActive, lineOne, lineTwo, tabIndex, title }) {
  return (
    <div className={`summary-bar-card uk-card uk-card-small uk-width-small ${isActive ? 'summary-bar-card-active' : ''}`}>
      <Link
        tabIndex={tabIndex}
        to={href}
      >
        <div className="summary-bar-card-title">{title}</div>
        <div className="uk-card-body summary-bar-card-body">
          {lineOne && <div className="uk-text-small">{lineOne}</div>}
          {lineTwo && <div className="uk-text-small">{lineTwo}</div>}
          {chartData && (
            <Sparklines
              data={chartData}
              preserveAspectRatio='xMaxYMin'
              style={{ width: '100%' }}
            >
              <SparklinesLine style={{ stroke: "#000000", strokeWidth: 3, fill: "white" }} />
            </Sparklines>
          )}
        </div>
      </Link>
    </div>
  );
};
