import React from 'react';
import { PropTypes } from 'prop-types';
import JVMThreadsTableLineItem from './JVMThreadsTableLineItem';

JVMThreadsTable.propTypes = {
  filteredThreadData: PropTypes.array,
};

export default function JVMThreadsTable({ filteredThreadData = [] }) {
  return (
    <div>
      <h4 className="uk-clearfix uk-text-nowrap">
        <div className="thread-table-icon" />
        <div className="uk-text-truncate thread-table-state">State</div>
        <div className="thread-table-id uk-text-truncate">ID</div>
        <div className="uk-text-truncate thread-table-name">Name</div>
        <div className="uk-text-truncate thread-table-daemon">Daemon</div>
        <div className="uk-text-truncate thread-table-priority">Priority</div>
      </h4>
      <hr />
      <ol className="threads-list uk-list">
        {filteredThreadData.map(({ daemon, id, name, priority, stack, state }, arrIndex) => {
          return (
            <JVMThreadsTableLineItem
              {...{ daemon, name, priority, stack, state }}
              arrIndex={arrIndex}
              id={Number(id)}
              key={id}
            />
          );
        })}
      </ol>
    </div>
  );
}
