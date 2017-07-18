import React from "react";
import { PropTypes } from "prop-types";
import { NavLink } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";

SummaryBarCard.propTypes = {
  chartData: PropTypes.array,
  href: PropTypes.string,
  isActive: PropTypes.bool,
  lineOne: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ]),
  lineTwo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  width: PropTypes.string
};

export default function SummaryBarCard({
  chartData,
  href,
  isActive,
  lineOne,
  lineTwo,
  tabIndex,
  title,
  width
}) {
  width = width || "uk-width-small";
  return (
    <NavLink
      activeClassName="summary-bar-card-active"
      className={`uk-card uk-card-small summary-bar-card ${width}`}
      tabIndex={tabIndex}
      to={href}
    >
      <div className="summary-bar-card-title">
        {title}
      </div>
      <div className="uk-card-body summary-bar-card-body">
        {lineOne &&
          <div className="uk-text-small">
            {lineOne}
          </div>}
        {lineTwo &&
          <div className="uk-text-small">
            {lineTwo}
          </div>}
        {chartData &&
          <Sparklines
            data={chartData}
            preserveAspectRatio="xMaxYMin"
            style={{ width: "100%" }}
          >
            <SparklinesLine
              style={{
                stroke: "#FFF",
                strokeWidth: 3,
                fill: "white"
              }}
            />
          </Sparklines>}
      </div>
    </NavLink>
  );
}
