import dateFormat from 'dateformat';
import _ from 'lodash';
import Mathjs from 'mathjs';
import { createSelector } from 'reselect';

// Dashboard Utility Functions

// The client-side Redux store expresses metrics over time as a hierarchy of JavaScript objects. 
// At the lowest level, a metric is represented by a key of the metric name and a complex object
// representing the value of that metric over time. The complex object has keys 
// equal to a UNIX timestamp and values equal to the value of the metric at the associated timestamp.
// When the client fetches metrics data from the server, the data is deconstructed and the value
// of each attribute is appended to the appropriate complex object with a key equal to the timestamp
// of when the fetched data was received from the server.

// These utility functions are provided to transform this data into time series, spark lines, and
// other data structures capable of being consumed by front-end components.

/**
 * Returns the most recent value of a particular attribute as a number or string
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @returns {Number|String}
 */

export function getLatestAttribute(props, path, baseUnit, resultUnit, precision) {
  if (!props || !path) return 0;
  // _.has is not suitable because some object become arrays and auto insert
  // keys from 0...n with values of undefined.
  const fullPath = _.get(props, path);
  if (fullPath && baseUnit && resultUnit && precision) {
    return Mathjs.round(Mathjs.unit(fullPath[_.last(_.keys(fullPath).sort((a, b) => a - b))], baseUnit).toNumber(resultUnit), precision);
  }
  if (fullPath) {
    return fullPath[_.last(_.keys(fullPath).sort((a, b) => a - b))];
  }
  return 0;
}

/**
 * Returns time series data of a metric's value
 *   time - UNIX time in ms
 *   prettyTime - string of time in hMMtt,
 *   dataAttribute - value of metric stored at least significant key passed into the path parameter or
 *     the optional label parameter
 * 
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @param {String} label - An optional label used as the key for the time series data
 * @returns {Array}
 */
export function getTimeSeriesOfValue(props, path, label, baseUnit, resultUnit, precision) {
  if (!props || !path) return [];
  const fullPath = _.get(props, path);
  if (fullPath) {
    let attribute = label || _.last(path.split('.'));
    let timestamps = _.keys(fullPath).sort((a, b) => a - b);
    let results = timestamps.map(timestamp => {
      let obj = {};
      obj['time'] = Number(timestamp);
      obj['prettyTime'] = dateFormat(obj.time, "h:MMtt");
      if (baseUnit && resultUnit && precision) {
        obj[attribute] = Mathjs.round(Mathjs.unit(fullPath[timestamp], baseUnit).toNumber(resultUnit), precision);
      } else {
        obj[attribute] = fullPath[timestamp];
      }
      return obj;
    });
    return results;
  }
  return [];
}

/**
 * Returns spark line of a metric's value
 * 
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @returns {Array}
 */
export function getSparkLineOfValue(props, path) {
  if (!props || !path) return [0, 0];
  const timeSeries = getTimeSeriesOfValue(props, path);
  if (timeSeries.length < 2) return [0, 0];
  let dataKey = extractDataAttributes(timeSeries)[0];
  const results = timeSeries.map(obj => obj[dataKey]);
  return results;
}

/**
 * Returns time series data of a metric's net change since that last time the metric was polled
 * 
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @param {String} label - An optional label used as the key for the time series data
 * @returns {Array}
 */
export function getTimeSeriesOfNetChange(props, path, label, baseUnit, resultUnit, precision) {
  if (!props || !path) return [];
  let timeSeries = getTimeSeriesOfValue(props, path, label);
  if (!timeSeries.length) return [];
  // Strip out the time related keys
  let dataKeys = extractDataAttributes(timeSeries);
  let attributeChangesOverTime = timeSeries.map(function (attribute, index) {
    // Express the first timestamp as a net change of 0 since there is no basis of comparison
    if (index === 0) {
      let obj = { time: attribute.time, prettyTime: attribute.prettyTime };
      _.forEach(dataKeys, (dataKey) => obj[dataKey] = 0);
      return obj;
    }
    // Otherwise, calculate the net change and append to a key equal to the attribute appended by 'PerSecond'
    else {
      let obj = { time: attribute.time, prettyTime: attribute.prettyTime };
      _.forEach(dataKeys, (dataKey) => {
        let elapsedTimeInSeconds = (attribute.time - timeSeries[index - 1].time) / 1000;
        if (baseUnit && resultUnit && precision) {
          obj[`${dataKey}PerSecond`] = Mathjs.round(Mathjs.unit((attribute[dataKey] - timeSeries[index - 1][dataKey]) / elapsedTimeInSeconds, baseUnit).toNumber(resultUnit), precision);
        } else {
          obj[`${dataKey}PerSecond`] = Math.round((attribute[dataKey] - timeSeries[index - 1][dataKey]) / elapsedTimeInSeconds);
        }
      });
      return obj;
    }
  });
  return attributeChangesOverTime;
}

/**
 * Returns sparkline of a metric's net change since that last time the metric was polled
 * 
 * @param {Object} props - An arbitrary nested object passed from Redux via component props
 * @param {String} path - A string representation of the path to the desired key
 * @returns {Array}
 */
export function getSparkLineOfNetChange(props, path) {
  if (!props || !path) return [0, 0];
  const attributesChangesOverTime = getTimeSeriesOfNetChange(props, path);
  if (attributesChangesOverTime.length < 2) return [0, 0];
  let dataKey = extractDataAttributes(attributesChangesOverTime)[0];
  return attributesChangesOverTime.map(obj => obj[dataKey]);
}

/**
 * Combine two or more time series together to allow them to be rendered on a single chart.
 * 
 * @param {Object[][]} arrayOfTimeSeries - array containing one or more time series (arrays of objects)
 * @returns {Object[]}
 */
export function mergeTimeSeries(arrayOfTimeSeries) {
  if (arrayOfTimeSeries.length === 0) return [];
  // Short circuit if there isn't more than one timeseries
  const validArrays = arrayOfTimeSeries.filter(arr => arr.length > 0);
  if (validArrays.length === 0) {
    return [];
  } else if (validArrays.length === 1) {
    return validArrays[0];
  } else {
    let mergedResults = [];
    _.forEach(validArrays, (timeSeries) => {
      mergedResults.push(...timeSeries);
    });
    let groupedResults = _.values(_.groupBy(mergedResults, result => result.time));
    let results = _.map(_.values(groupedResults), group => _.merge(...group));
    return results;
  }
}

/**
 * getBasename is a utility function that extracts the baseurl property from the HEAD of the index.html file. This is
 * the means by which a dashboard is configured to be served out on a deeply nested path.
 * @returns {String}
 */
export function getBasename() {
  const metaBaseUrl = document.head.querySelector("[property=baseUrl]").content;
  const baseUrl = metaBaseUrl.indexOf('__BASE_') !== -1 ? "/" : `${metaBaseUrl}`;
  return baseUrl;
};

/**
 * getRuntime is a utility function that extracts the runtime from the HEAD of the index.html file. It's used to determine
 * how the app should scrape metrics and render React components
 * @returns {String}
 */
export function getRuntime() {
  const metaRuntime = document.head.querySelector("[property=runtime]").content;
  const runtime = metaRuntime.indexOf('__BASE_') !== -1 ? "JVM" : `${metaRuntime}`; //default to JVM
  return runtime;
};

/**
 * generateEndpoints is a utility function that returns the endpoints that should be scraped for current runtime
 * This should ONLY be used to populate the initial Redux state
 * @returns {String[]}
 */
export function generateEndpoints() {
  switch (getRuntime()) {
    case 'JVM':
      return ['admin/metrics.json'];
    case 'GOLANG':
      return ['metrics'];
    default:
      return [];  
  }
}

/**
 * generateThreadEndpoints is a utility function that returns the endpoints that should be scraped for current runtime
 * This should ONLY be used to populate the initial Redux state
 * @returns {String}
 */
export function generateThreadsEndpoint() {
  switch (getRuntime()) {
    case 'JVM':
      return 'admin/threads';
    case 'GOLANG':
    default:  
      return '';
  }
}

/**
 * return an array of all strings used as data attribute keys in the most recent sample
 * @param {Object[]} timeSeries
 * @returns {String[]}
 */
export function extractDataAttributes(timeSeries) {
  return _.without(_.keys(_.last(timeSeries)), 'time', 'prettyTime');
}

/**
 * @callback dataAttributesMapper
 * @param {String} currentValue
 * @returns {String}
 */

/**
 * Maps over a time series and runs the mapFunc against all data attributes specified in the arrayOfDataAttributes.
 * This provides a convenient means for basic transformations like unit conversion
 *
 * @param {Object} timeSeries 
 * @param {String[]} arrayOfDataAttributes 
 * @param {dataAttributesMapper} mapFunc
 * @returns {Object}
 */
export const mapOverTimeSeries= (timeSeries, arrayOfDataAttributes, mapFunc) => {
  return timeSeries.map((currentValue, index, array) => {
    const mappedObj = { ...currentValue };
    arrayOfDataAttributes.forEach(dataAttribute => {
      if (currentValue[dataAttribute]) mappedObj[dataAttribute] = mapFunc(currentValue[dataAttribute]);
    });
    return mappedObj;
  });
};

/**
 * Helper function that inspects the JSON string format for type of 'latest',
 * retrieves the value if required, and formats as a string
 * @param {String[]|String} line 
 * @param {Object} metrics 
 */
export function parseJSONString(line, metrics) {
  if (Array.isArray(line)) {
    return line.map(element => {
      if (element.type === 'string') {
        return element.value;
      } else if (element.type === 'latest' && element.baseUnit && element.resultUnit && element.precision) {
        return getLatestAttribute(metrics, element.value, element.baseUnit, element.resultUnit, element.precision);
      } else {
        return getLatestAttribute(metrics, element.value);
      }
    }).join(' '); 
  } else {
    return line;
  }
}

// Reselect Selectors

// Reselect Input Selectors

const getMetrics = state => state.metrics;
const getCurrentThreads = state => state.threadsTable;
const getThreadsFilter = state => state.settings.threadsFilter;

// Reselect Memoized Selectors

/**
 * A Reselect selector that filters the metrics and only returns the timeseries
 * that contain the string 'route' somewhere in the key.
 */
export const getRouteMetrics = createSelector(getMetrics,
  (metrics) => {
    return _.pick(metrics, Object.keys(metrics).filter(key => key.indexOf('route') !== -1));
  }
);

/**
 * A Reselect selector that generates a special hierarchical tree structure from
 * the timeseries keys. It's used to render the special Route dashboards for the JVM
 */
export const getRouteTree = createSelector(getRouteMetrics,
  (routeMetrics) => {
    const keys = Object.keys(routeMetrics);
    // Short circuit if metrics hasn't yet been populated
    if (keys.length === 0) return {};
    const routeList = {};
    keys.forEach(route => {
      const routeRegex = /route(.*)\/(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)\/(.*)/;
      const routePath = route.replace(routeRegex, '$1') || '/';   // Path with trailing slash or root
      const httpVerb = route.replace(routeRegex, '$2');           // Valid HTTP Verb
      _.set(routeList, [routePath, httpVerb], route);
    });
    return routeList;
  }
);

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
    active: threadsTable ? threadsTable.filter(threadItem => threadItem.state === 'RUNNABLE').length : 0,
    idle: threadsTable ? threadsTable.filter(threadItem => threadItem.state === 'WAITING' || threadItem.state === 'TIMED_WAITING').length : 0,
    stopped: threadsTable ? threadsTable.filter(threadItem => threadItem.state === 'TERMINATED' || threadItem.state === 'BLOCKED' || threadItem.state === 'NEW').length: 0,
    all: threadsTable.length
  };
});

