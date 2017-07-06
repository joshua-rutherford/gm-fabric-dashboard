import _ from 'lodash';
import dateFormat from 'dateformat';
import { createSelector } from 'reselect';
import { camelize } from 'humps';
import deepFilter from 'deep-filter';

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

export function getLatestAttribute(props, path) {
  if (!props || !path) return 0;
  // _.has is not suitable because some object become arrays and auto insert
  // keys from 0...n with values of undefined.
  const fullPath = _.get(props, path);
  if (fullPath) {
    return fullPath[_.last(_.keys(fullPath).sort((a, b) => a - b))];
  }
  return 0;
}

// TODO: add array at dataAttributes containing all of the keys storing metrics
// in this time series. This will allow easier lookup

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
export function getTimeSeriesOfValue(props, path, label) {
  if (!props || !path) return [];
  const fullPath = _.get(props, path);
  if (fullPath) {
    let attribute = label || _.last(path.split('.'));
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
export function getTimeSeriesOfNetChange(props, path, label) {
  if (!props || !path) return [];
  let timeSeries = getTimeSeriesOfValue(props, path, label);
  if (!timeSeries.length) return [];
  // Strip out the time related keys
  let dataKeys = extractDataAttributes(timeSeries);
  let attributeChangesOverTime = timeSeries.map(function (attribute, index) {
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
        let elapsedTimeInSeconds = (attribute.time - timeSeries[index - 1].time) / 1000;
        obj[`${dataKey}PerSecond`] = Math.round((attribute[dataKey] - timeSeries[index - 1][dataKey]) / elapsedTimeInSeconds);
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
 * @param {Object[]} arrayOfTimeSeries - array containing one or more time series 
 * @returns {Object[]}
 */
export function mergeTimeSeries(...arrayOfTimeSeries) {
  // Note: firstArrayOfResults seems to already have both key/value result pairs. Why? 
  let mergedResults = [];
  _.forEach(arrayOfTimeSeries, (timeSeries) => {
    mergedResults.push(...timeSeries);
  });
  let groupedResults = _.values(_.groupBy(mergedResults, result => result.time));
  let results = _.map(_.values(groupedResults), group => _.merge(...group));
  return results;
}

// Reselect Selectors

// Reselect Input Selectors

/**
 * Reselect Input selector that returns the threadsFilter from state.settings.threadsFilter
 * @param {Object} state
 * @returns {Object} 
 */
const getCurrentThreads = (state) => state.metrics.threadsTable;

/**
 * Reselect Input selector that returns the threadsFilter from state.settings.threadsFilter
 * @param {Object} state
 * @returns {Object} 
 */
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
 * @returns {String[]}
 */
export function generateEndpoints() {
  switch (getRuntime()) {
    case "GOLANG":
      return ['metrics'];
    case "JVM":
    default:  
      return ['admin/metrics.json', 'admin/threads'];
  }
}

/**
 * Utility function that takes the raw metrics data scraped from the golang endpoints, normalizes the data in the
 * form expected by the React UI components, and restructures as timeseries data using the UNIX timestamp of when the
 * endpoints were polled.
 * @param {Object} rawScrapedMetrics
 * @returns {Object}
 */
export function parseGolangMetrics(rawScrapedMetrics) {
  let normalizedTimeSeriesSample = {};
  let timestampOfMetricsPoll = Date.now();
  // Change from slash delimited to dot delimited and from snake case to camel case to be able to
  // use the lodash set method to build a idiomatic JSON hierarchy of data
  _.forIn(rawScrapedMetrics, (metricsValue, slashDelimitedPath) => {
    let path = slashDelimitedPath.split(/[./]/).map(e => camelize(e));
    path.push(timestampOfMetricsPoll.toString());
    _.setWith(normalizedTimeSeriesSample, path, metricsValue);
  });  
  return normalizedTimeSeriesSample;
}

/**
 * Utility function that takes the raw metrics data scraped from the AWS endpoints, normalizes the data in the
 * form expected by the React UI components, and restructures as time series using the UNIX timestamp of when the
 * endpoints were polled.
 * @param {Object} rawScrapedMetrics
 * @returns {Object}
 */
export function parseJVMMetrics(rawScrapedMetrics) {
  // Transform each snapshot into a hierarchy of nested objects, where the lowest level is an object
  // of key value pairs, where the key is the time stamp in UNIX time and the value is the value of
  // the metric at that timestamp.
  let normalizedTimeSeriesSample = {};
  let timestampOfMetricsPoll = Date.now();
  _.forIn(rawScrapedMetrics, (metricsValue, slashDelimitedPath) => {

    // Parse Threads metrics into a 'threadsTable' ready for display in a table component and a 'threads' structure 
    // similar to the other metrics that is able to use the utility functions to render time charts.
    if (slashDelimitedPath === 'threads') {
      let threadIds = Object.keys(metricsValue);
      const threadsTable = threadIds.map(id => ({
        name: metricsValue[id].thread,
        id: id,
        priority: metricsValue[id].priority,
        state: metricsValue[id].state,
        daemon: metricsValue[id].daemon,
        stack: metricsValue[id].stack
      }));
      _.setWith(normalizedTimeSeriesSample, `threadsTable`, threadsTable, Object);
      threadsTable.forEach(resultObj => {
        let path = ['threads', resultObj.name, String(resultObj.id), String(timestampOfMetricsPoll)];
        _.setWith(normalizedTimeSeriesSample, path, resultObj, Object);
      });
    }

    else if (_.startsWith(slashDelimitedPath, 'route')) {
      const [route, routePath, httpVerb, metadata] = parseJVMRoute(slashDelimitedPath); 
      const result = [route, routePath, httpVerb, ...metadata, String(timestampOfMetricsPoll)];
      _.setWith(normalizedTimeSeriesSample, result, metricsValue, Object);
    }
      
    else {
      // Build a path array to use the lodash set method to build a idiomatic JSON hierarchy of data
      let path = slashDelimitedPath.split(/[./]/).map(e => camelize(e));
      let pathWithTimestamps = [...path, timestampOfMetricsPoll.toString()];
      _.setWith(normalizedTimeSeriesSample, pathWithTimestamps, metricsValue, Object);
    }
  });
  return normalizedTimeSeriesSample;
}

/**
 * Helper function used to parse the route information provided by Finagle though a regex
 * to be able to sort '/' characters used in a UNIX path from / used as a delimiter in metrics.json
 * @param {String} slashDelimitedPath
 * @returns {String[]}
 */
function parseJVMRoute(slashDelimitedPath) {
  // 
  const routeRegex = /(route)(.*)\/(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)\/(.*)/;
  const route = slashDelimitedPath.replace(routeRegex, '$1');              // Always 'route'
  const routePath = slashDelimitedPath.replace(routeRegex, '$2') || '/';   // Path with trailing slash or root
  const httpVerb = slashDelimitedPath.replace(routeRegex, '$3');           // Valid HTTP Verb
  const metadata = slashDelimitedPath.replace(routeRegex, '$4').split(/[./]/); // dot delimited 
  return [route, routePath, httpVerb, metadata];
}

/**
 * A method to iteratively build out a time series less structure that shadows the normal
 * metrics store. This approach is currently not used in favor of the extractDataAttributes
 * function.
 * @param {Object} rawScrapedMetrics
 * @returns {Object} 
 */
export function parseJVMPaths(rawScrapedMetrics) {
  let normalizedTimeSeriesHeader = {};
  _.forIn(rawScrapedMetrics, (metricsValue, slashDelimitedPath) => {
    if (_.startsWith(slashDelimitedPath, 'route')) {
      const [route, routePath, httpVerb, metadata] = parseJVMRoute(slashDelimitedPath);
      _.update(normalizedTimeSeriesHeader, [route, routePath, httpVerb], metadata);
    } else {
      // Build a path array to use the lodash set method to build a idiomatic JSON hierarchy of data
      let path = slashDelimitedPath.split(/[./]/).map(e => camelize(e));
      if (path.length === 1) {
        _.update(normalizedTimeSeriesHeader, [], path);
      } else if (path.length > 1) {
        _.update(normalizedTimeSeriesHeader, path.slice(0,-1), path.slice(-1));
      }
    }
  });
  return normalizedTimeSeriesHeader;
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
 * Creates a copy of the metrics hierarchy with the actual time series replaced
 * by empty objects and excluding structures in a blacklist. This derived structure
 * is intended to be used for navigation trees, searches, and type-aheads that
 * benefit from a smaller navigation structure that preserves the path needed to
 * generate charts.
 * @param {Object} timeSeries
 * @returns {Object}
 */
export function extractPaths(timeSeries) {
  return deepFilter(timeSeries, (value, key, parent) => {
    const blacklist = ['threadsTable'];
    if (_.includes(blacklist, key)) {
      return false;
    // If the key can be cast to a UNIX timestamp from 2000 on, assume this is a time series
    } else if (Number(key) > 946684800) { 
      return false;
    } else {
      return true;
    }
  });
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
