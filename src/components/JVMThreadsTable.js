import React, { PropTypes } from 'react';

JVMThreadsTable.propTypes = {
  threadsTable: PropTypes.array,
};

export default function JVMThreadsTable({ threadsTable = [] }) {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">Threads</h3>
      <div className="uk-overflow-auto">
        <table className="uk-table">
          <thead>
            <tr>
              <th className="uk-text-truncate">Name</th>
              <th className="uk-text-truncate">ID</th>
              <th className="uk-text-truncate">State</th>
              <th className="uk-text-truncate">Daemon</th>
              <th className="uk-text-truncate">Priority</th>
            </tr>
          </thead>
          <tbody>
            {threadsTable.map(({ id, name, priority, state, daemon, stack }) => {
              return (
                <tr
                  data-uk-tooltip="pos: bottom-left"
                  key={id}
                  title={stack.length > 0 ? 'Stack Trace\r'+stack.join('\r') : 'No Trace Available'}
                >
                  <td className="uk-text-truncate">{name}</td>
                  <td>{Number(id)}</td>
                  <td className="uk-text-truncate">{state}</td>
                  <td className="uk-text-truncate">{daemon.toString()}</td>
                  <td>{Number(priority)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
