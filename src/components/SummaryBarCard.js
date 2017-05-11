import React from 'react';
import { Link } from 'react-router';
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';
import { PropTypes } from 'prop-types';

SummaryBarCard.propTypes = {
  chartData: PropTypes.array,
  href: PropTypes.string,
  isActive: PropTypes.bool,
  lineOne: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ]),
  lineTwo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  width: PropTypes.string
};

export default function SummaryBarCard({ chartData, href, isActive, lineOne, lineTwo, tabIndex, title, width }) {
  width = width || 'uk-width-small';
  return (
      <Link
        activeClassName="summary-bar-card-active"
        className={`uk-card uk-card-small summary-bar-card ${width}`}
        tabIndex={tabIndex}
        to={href}
      >
        <div className="summary-bar-card-title">{title}</div>
        <div className="uk-card-body summary-bar-card-body">
          {
            lineOne &&
            <div className="">{lineOne}</div>
          }
          {
            lineTwo &&
            <div className="">{lineTwo}</div>
          }
          {
            chartData &&
            <Sparklines
              data={chartData}
              preserveAspectRatio='xMaxYMin'
            >
              <SparklinesLine style={{ fill: "#fff", stroke: "#0aab2a", strokeWidth: "3px", fillOpacity: ".2" }} />
              <SparklinesReferenceLine type="mean" style={{ stroke: "#fff", strokeOpacity: '.3' }} />
            </Sparklines>
          }
        </div>
      </Link>
  );
};
