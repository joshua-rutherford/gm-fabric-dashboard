import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import IndicatorIcon from './IndicatorIcon';
import Collapse from 'react-collapse';

export default class JVMThreadsTableLineItem extends Component {
  static propTypes = {
    arrIndex: PropTypes.number,
    daemon: PropTypes.bool,
    id: PropTypes.number,
    name: PropTypes.string,
    priority: PropTypes.number,
    stack: PropTypes.array,
    state: PropTypes.string
  };

  state = {
    isOpen: false,
  }

  indicatorColor(state) {
    switch (state) {
      case 'RUNNABLE':
        return 'green';
      case 'WAITING':
      case 'TIMED_WAITING':
        return '#E0D570';
      case 'TERMINATED':
      case 'BLOCKED':
      case 'NEW':
        return '#BC1C1C';
      default:
        return 'blue';
    }
  }

  toggleStack = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { arrIndex, daemon, id, name, priority, stack, state } = this.props;
    const indicatorIcon = this.indicatorColor(state);

    return (
      <li key={id}>
        <div
          className="thread-table-row uk-clearfix"
          onClick={stack.length && this.toggleStack}
          onKeyDown={(evt) => {
            if ((stack.length && evt.keyCode === 13)) {
              evt.preventDefault();
              this.toggleStack();
            }
          }}
          role="link"
          style={stack.length ? { cursor: 'pointer' } : {}}
          tabIndex={arrIndex + 20}
        >
          <div className="thread-table-icon">
            {stack.length ? (this.state.isOpen ? '-' : '+') : ''}
          </div>
          <div className="thread-table-state">
            <IndicatorIcon
              alt={state}
              color={indicatorIcon}
              diameter={15}
            />
          </div>
          <div className="thread-table-id" >{`${Number(id)}`}</div>
          <div className="thread-table-name">{name}</div>
          <div className="thread-table-daemon">{daemon ? 'Yes' : 'No'}</div>
          <div className="thread-table-priority">{priority}</div>
        </div>
        <Collapse isOpened={this.state.isOpen}>
          <div className="thread-table-line-item-content ">
            <div>{`java.lang.Thread.State: ${state}`}</div>
            {stack.map((value, index) => <div key={index}>{`at ${value}`}</div>)}
          </div>
        </Collapse>
        <hr />
      </li>
    );
  }
}
