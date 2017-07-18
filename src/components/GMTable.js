import React from "react";
import { PropTypes } from "prop-types";

HTTPStats.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

export default function HTTPStats({ title, headers, rows = [] }) {
  return (
    <div className="uk-card uk-card-small uk-card-body left-border">
      <h3 className="uk-card-title">
        {title}
      </h3>
      <table className="uk-table uk-table-justify">
        <thead>
          <tr>
            <th />
            {headers.map((headerCell, index) =>
              <th key={`header-${index}`}>
                {headerCell}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) =>
            <tr key={`row-${rowIndex}`}>
              {row &&
                row.map((cell, cellIndex) =>
                  <td key={`row-${rowIndex}-cell-${cellIndex}`}>
                    {cell}
                  </td>
                )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
