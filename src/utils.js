import _ from 'lodash';
import dateFormat from 'dateformat';
import { createSelector } from 'reselect';
import { camelize } from 'humps';

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
  // _.has is not suitable because some object become arrays and auto insert
  // keys from 0...n with values of undefined.
  const fullPath = _.get(props, path);
  if (fullPath) {
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
 * @param {String} label - An optional label used as the key for the time series data
 * @returns {Array}
 */
export function getAttributeOverTime(props, path, label) {
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
 * @param {String} label - An optional label used as the key for the time series data
 * @returns {Array}
 */
export function getAttributeChangesOverTime(props, path, label) {
  if (!props || !path) return [];
  let attributesOverTime = getAttributeOverTime(props, path, label);
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
  return attributeChangesOverTime;
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
 * Combine two or more sets of output of getAttributeChangesOverTime or getAttributeOverTime
 * together to allow them to be rendered on a single chart.
 * 
 * @param {Object[]} resultArray - One or more array of output of getAttributeChangesOverTime
 * or getAttributeOverTime
 * @returns {Object[]}
 */
export function mergeResults(...arrayOfResultArrays) {
  console.log(arrayOfResultArrays);
  // Note: firstArrayOfResults seems to already have both key/value result pairs. Why? 
  let mergedResults = [];
  _.forEach(arrayOfResultArrays, (resultArray) => {
    mergedResults.push(...resultArray);
  });
  let groupedResults = _.values(_.groupBy(mergedResults, result => result.time));
  console.log(groupedResults);
  let results = _.map(_.values(groupedResults), group => _.merge(...group));
  console.log(results);
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
  let normalizedTimeseriesData = {};
  let timestampOfMetricsPoll = Date.now();
  // Change from slash delimited to dot delimited and from snake case to camel case to be able to
  // use the lodash set method to build a idiomatic JSON hierarchy of data
  _.forIn(rawScrapedMetrics, (metricsValue, slashDelimitedPath) => {
    let dotDelimitedCamelizedPath = camelize(slashDelimitedPath.replace(/\//gi, '.'));
    _.setWith(normalizedTimeseriesData, `${dotDelimitedCamelizedPath}.${timestampOfMetricsPoll}`, metricsValue);
  });  
  console.log(normalizedTimeseriesData);
  return normalizedTimeseriesData;
}

/**
 * Utility function that takes the raw metrics data scraped from the AWS endpoints, normalizes the data in the
 * form expected by the React UI components, and restructures as timeseries data using the UNIX timestamp of when the
 * endpoints were polled.
 * @param {Object} rawScrapedMetrics
 * @returns {Object}
 */
export function parseJVMMetrics(rawScrapedMetrics) {
  // Transform each snapshot into a hierarchy of nested objects, where the lowest level is an object
  // of key value pairs, where the key is the time stamp in UNIX time and the value is the value of
  // the metric at that timestamp.
  let normalizedTimeseriesData = {};
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
      _.setWith(normalizedTimeseriesData, `threadsTable`, threadsTable);
      threadsTable.forEach(resultObj => {
        _.setWith(normalizedTimeseriesData, `threads.${resultObj.name}.jvm-id-${resultObj.id}.${timestampOfMetricsPoll}`, resultObj);
      });
    }

    else if (_.startsWith(slashDelimitedPath, 'route')) {
      // For route data, use a special regex to be able to sort / used in a path
      // from / used as a delimiter in metrics.json
      const routeRegex = /(route)(.*)\/(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)\/(.*)/;
      const route = slashDelimitedPath.replace(routeRegex, '$1');              // Always 'route'
      const routePath = slashDelimitedPath.replace(routeRegex, '$2') || '/';   // Path with trailing slash or root
      const httpVerb = slashDelimitedPath.replace(routeRegex, '$3');           // Valid HTTP Verb
      const metadata = slashDelimitedPath.replace(routeRegex, '$4').replace(/\//gi, '.'); // dot delimited 
      const result = [route, routePath, httpVerb, ...metadata.split('.'), String(timestampOfMetricsPoll)];

      // Temporary example of using a whitelist to filter useful route metrics. This shall be implemented
      // in a more general solution. https://github.com/DecipherNow/gm-fabric-dashboard/issues/81
      if (_.includes(window.location.href, '/services/ess/1.0/')) {
        const whitelist = ['/odrive/_search', '/odrive/_search/'];
        if (_.includes(whitelist, routePath)) {
          _.setWith(normalizedTimeseriesData, result, metricsValue);
        }
      } else {
        _.setWith(normalizedTimeseriesData, result, metricsValue);
      }
    }
    else {
      // Change from slash delimited to dot delimited and from snake case to camel case to be able to
      // use the lodash set method to build a idiomatic JSON hierarchy of data
      let dotDelimitedCamelizedPath = camelize(slashDelimitedPath.replace(/\//gi, '.'));
      _.setWith(normalizedTimeseriesData, `${dotDelimitedCamelizedPath}.${timestampOfMetricsPoll}`, metricsValue);
    }
  });
  return normalizedTimeseriesData;
}
