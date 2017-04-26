import _ from 'lodash';
import dateFormat from 'dateformat';
import { createSelector } from 'reselect';
import { TimeSeries, TimeRange } from 'pondjs';

// Dashboard Utility Functions

// The client-side Redux store expresses metrics over time as a hierarchy of JavaScript objects. 
// At the lowest level, a metric is represented by a key of the metric name and a complex object
// representing the value of that metric over time. The complex object has keys 
// equal to a UNIX timestamp and values equal to the value of the metric at the associated timestamp.
// When the client fetches metrics data from the server, the data is deconstructed and the value
// of each attribute is appended to the appropriate complex object with a key equal to the timestamp
// of when the fetched data was received from the server.

// These utility functions are provided to simplify the common use cases of preparing data for
// display in tables or charts.

/**
 * Returns the most recent value of a particular attribute as a number or string
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @returns {Number|String}
 */
export function getLatestAttribute(props, path) {
  if (!props || !path) return 0;
  if (_.has(props, path)) {
    const fullPath = _.get(props, path);
    return fullPath[_.last(_.keys(fullPath).sort((a, b) => a - b))];
  }
  return 0;
}

/**
 * Returns the value of an attribute over time as an array of objects with keys of 
 * time(UNIX time in ms), prettyTime(string of time in h:MMtt), and a dynamically generated
 * key (least significant key passed into the path parameter) with the value of the attribute
 * 
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @returns {Array}
 */
export function getAttributeOverTime(props, path) {
  if (!props || !path) return [];
  if (_.has(props, path)) {
    let attribute = _.last(path.split('.'));
    let fullPath = _.get(props, path);
    let timestamps = _.keys(fullPath).sort((a, b) => a - b);
    let results = timestamps.map(timestamp => {
      let obj = {};
      obj['time'] = Number(timestamp);
      obj['prettyTime'] = dateFormat(obj.time, "h:MMtt");
      obj[attribute] = fullPath[timestamp];
      return obj;
    });
    return results;
  }
  return [];
}

/**
 * Returns the value of an attribute over time as an array of objects with keys of 
 * time(UNIX time in ms), prettyTime(string of time in h:MMtt), and a dynamically generated
 * key (least significant key passed into the path parameter) with the value of the attribute
 * 
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @returns {Array}
 */
export function getAttributeOverTimeAsPondTimeSeries(props, path) {
  if (!props || !path) {
    return false;
  }
  if (_.has(props, path)) {
    const attribute = _.last(path.split('.'));
    let fullPath = _.get(props, path);
    let timestamps = _.keys(fullPath).sort((a, b) => a - b);
    let results = timestamps.map(timestamp => {
      let obj = [Number(timestamp), fullPath[timestamp]];
      return obj;
    });
    const data = {
      name: attribute,
      columns: ["time", "value"],
      points: results
    };
    const tsData = new TimeSeries(data);
    return tsData;
  } else {
    return false;
  }
}

/**
 * Returns the value of an attribute over time as an array of number of strings. All timestamps
 * information is stripped out for use in simple sparkline style charts.
 * 
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @returns {Array}
 */
export function getAttributeForSparkline(props, path) {
  if (!props || !path) return [0, 0];
  const attributesOverTime = getAttributeOverTime(props, path);
  if (attributesOverTime.length < 2) return [0, 0];
  let dataKey = _.without(_.keys(_.last(attributesOverTime)), 'time', 'prettyTime')[0];
  const results = attributesOverTime.map(obj => obj[dataKey]);
  return results;
}

/**
 * Returns the net change of an attribute between timestamps as an array of objects with keys of 
 * time(UNIX time in ms), prettyTime(string of time in h:MMtt), and a dynamically generated
 * key (least significant key passed into the path parameter + 'PerSecond') with the net change of 
 * the attribute.
 * 
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @returns {Array}
 */
export function getAttributeChangesOverTime(props, path) {
  if (!props || !path) return [];
  let attributesOverTime = getAttributeOverTime(props, path);
  if (!attributesOverTime.length) return [];
  // Strip out the time related keys
  let dataKeys = _.without(_.keys(_.last(attributesOverTime)), 'time', 'prettyTime');
  let attributeChangesOverTime = attributesOverTime.map(function (attribute, index) {
    // Express the first timestamp as a net change of 0 since there is no basis of comparison
    if (index === 0) {
      let obj = { time: attribute.time, prettyTime: attribute.prettyTime };
      _.forEach(dataKeys, (dataKey) => obj[`${dataKey}PerSecond`] = 0);
      return obj;
    }
    // Otherwise, calculate the net change and append to a key equal to the attribute appended by 'PerSecond'
    else {
      let obj = { time: attribute.time, prettyTime: attribute.prettyTime };
      _.forEach(dataKeys, (dataKey) => {
        let elapsedTimeInSeconds = (attribute.time - attributesOverTime[index - 1].time) / 1000;
        obj[`${dataKey}PerSecond`] = Math.round((attribute[dataKey] - attributesOverTime[index - 1][dataKey]) / elapsedTimeInSeconds);
      });
      return obj;
    }
  });

  // console.log('Returning from getAttributeChangesOverTime with', attributeChangesOverTime);
  return attributeChangesOverTime;
}

export function getAttributeChangesOverTimeAsPondTimeSeries(props, path) {
  try {
    if (!props || !path) {
      return false;
    }
    if (_.has(props, path)) {
      let fullPath = _.get(props, path);
      let timestamps = _.keys(fullPath).sort((a, b) => a - b);
      if (timestamps.length < 2) return false;
      let results = timestamps.map((timestamp, index) => {
        if (index === 0) {
          return [
            Number(timestamp),
            0
          ];
        } else {
          // TODO: Figure out why the time range code does not render as expected
          // console.log(`${timestamps[index - 1]}, ${timestamp}`);
          // let tr = new TimeRange(Number(timestamps[index - 1]), Number(timestamp));
          // console.log(tr);
          // console.log(tr.begin());
          // console.log(tr.begin());
          // console.log(tr.end());
          let elapsedTimeInSeconds = (timestamp - timestamps[index - 1]) / 1000;
          console.log(elapsedTimeInSeconds);
          return [
            // tr, // Old time range approach
            Number(timestamp),
            Math.round((fullPath[timestamp] - fullPath[timestamps[index - 1]]) / elapsedTimeInSeconds)
          ];
        }
      });
      results.shift();
      console.log("RESULTS, ", results);
      const data = {
        columns: ["time", "value"],
        points: results
      };
      return new TimeSeries(data);
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * Returns the net change of an attribute over time as an array of numbers. All timestamps
 * information is stripped out for use in simple sparkline style charts.
 * 
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @returns {Array}
 */
export function getAttributeChangesForSparkline(props, path) {
  if (!props || !path) return [0, 0];
  const attributesChangesOverTime = getAttributeChangesOverTime(props, path);
  if (attributesChangesOverTime.length < 2) return [0, 0];
  let dataKey = _.without(_.keys(_.last(attributesChangesOverTime)), 'time', 'prettyTime')[0];
  return attributesChangesOverTime.map(obj => obj[dataKey]);
}

/**
 * Combine two sets of output of getAttributeChangesOverTime or getAttributeOverTime together
 * to allow them to be rendered on a single chart.
 * 
 * @param {*} firstArrayOfResults - Array of output of getAttributeChangesOverTime or getAttributeOverTime
 * @param {*} secondArrayOfResults - Array of output of getAttributeChangesOverTime or getAttributeOverTime
 * @returns {Array}
 */
export function mergeResults(firstArrayOfResults, secondArrayOfResults) {
  // Note: firstArrayOfResults seems to already have both key/value result pairs. Why? 
  // console.log('Calling mergeResults with with', firstArrayOfResults, secondArrayOfResults);
  let arraysOfResultArrays = [firstArrayOfResults, secondArrayOfResults];
  let mergedResults = [];
  _.forEach(arraysOfResultArrays, (resultArray) => {
    mergedResults.push(...resultArray);
  });
  let groupedResults = _.values(_.groupBy(mergedResults, result => result.time));
  let results = _.map(_.values(groupedResults), group => _.merge(...group));
  return results;
}


// Reselect Selectors

// Reselect Input Selectors
const getCurrentThreads = (state) => state.metrics.threadsTable;
const getThreadsFilter = (state) => state.settings.threadsFilter;

// Reselect Memoized Selectors

/**
 * Filter the current threads according to store.settings.threadsFilter in the
 * Redux store.
 */
export const getVisibleThreads = createSelector([getCurrentThreads, getThreadsFilter],
  (threadsTable, threadsFilter) => {
    switch (threadsFilter) {
      case 'active':
        return threadsTable.filter(threadItem => threadItem.state === 'RUNNABLE');
      case 'idle':
        return threadsTable.filter(threadItem => threadItem.state === 'WAITING' || threadItem.state === 'TIMED_WAITING');
      case 'stopped':
        return threadsTable.filter(threadItem => threadItem.state === 'TERMINATED' || threadItem.state === 'BLOCKED' || threadItem.state === 'NEW');
      case 'all':
      default:
        return threadsTable;
    }
  }
);

/**
 * Count the current threads according to the state and provide an object containing
 * these totals.
 */
export const getThreadCounts = createSelector(getCurrentThreads, (threadsTable = []) => {
  return {
    active: threadsTable.filter(threadItem => threadItem.state === 'RUNNABLE').length,
    idle: threadsTable.filter(threadItem => threadItem.state === 'WAITING' || threadItem.state === 'TIMED_WAITING').length,
    stopped: threadsTable.filter(threadItem => threadItem.state === 'TERMINATED' || threadItem.state === 'BLOCKED' || threadItem.state === 'NEW').length,
    all: threadsTable.length
  };
});
