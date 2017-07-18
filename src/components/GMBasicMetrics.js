import React from "react";
import { PropTypes } from "prop-types";
import _ from "lodash";

GMBasicMetrics.propTypes = {
  detailLines: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default function GMBasicMetrics({ detailLines, title }) {
  return (
    <div className="data-table">
      <h3>
        {title}
      </h3>
      <table className="uk-table">
        <tbody>
          {_.map(detailLines, (value, key) =>
            <tr key={`${key}-${value}`}>
              <td>
                {key}
              </td>
              <td>
                {value}{" "}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
