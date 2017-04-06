import _ from 'lodash';
import dateFormat from 'dateformat';

export function getLatestAttribute(props, path) {
  if (_.has(props, path)) {
    const fullPath = _.get(props, path);
    return fullPath[_.last(_.keys(fullPath).sort((a,b) => a - b))];
  }
  return 0;
}

export function getAttributeOverTime(props, path) {
  // console.log(`Calling getAttributeOverTime with ${path}`);
  if (_.has(props, path)) {
    let attribute = _.last(path.split('.'));
    let fullPath = _.get(props, path);
    let timestamps = _.keys(fullPath).sort((a,b) => a - b);
    let results = timestamps.map(timestamp => {
      let obj = {};
      obj['time'] = Number(timestamp);
      obj['prettyTime'] = dateFormat(obj.time, "h:MMtt");
      obj[attribute] = fullPath[timestamp];
      return obj;
    });
    // console.log('Returning from getAttributeOverTime with', results);
    return results;
  }
  // console.log('Returning from getAttributeOverTime with []');
  return [];
}

export function getAttributeChangesOverTime (props, path) {
  // console.log(`Calling getAttributeChangesOverTime with ${path});
  let attributesOverTime = getAttributeOverTime(props, path);
  if (!attributesOverTime.length) return [];
  let dataKeys = _.without(_.keys(_.last(attributesOverTime)), 'time', 'prettyTime');
  let attributeChangesOverTime = attributesOverTime.map(function (attribute, index) {
    if (index === 0) {
      let obj = { time: attribute.time, prettyTime: attribute.prettyTime };
      _.forEach(dataKeys, (dataKey) => obj[`${dataKey}PerSecond`] = 0);
      return obj;
    } else {
      let obj = { time: attribute.time, prettyTime: attribute.prettyTime };
      // For each attribute, normalize the change in units per second and add the result to a key appended by 'PerSecond'
      _.forEach(dataKeys, (dataKey) => {
        let elapsedTimeInSeconds = (attribute.time - attributesOverTime[index-1].time) / 1000;
        obj[`${dataKey}PerSecond`] = Math.round((attribute[dataKey] - attributesOverTime[index - 1][dataKey]) / elapsedTimeInSeconds);
      });
      return obj;
    }
  });
  // console.log('Returning from getAttributeChangesOverTime with', attributeChangesOverTime);
  return attributeChangesOverTime;
}

export function mergeResults (one, two) {
  // console.log('Calling mergeResults with with', one, two);
  let arraysOfResultArrays = [one, two];
  let mergedResults = [];
  _.forEach(arraysOfResultArrays, (resultArray) => {
    mergedResults.push(...resultArray);
  });
  // console.log('Merged: ', mergedResults);
  let groupedResults = _.values(_.groupBy(mergedResults, result => result.time));
  // console.log('Grouped: ', groupedResults);
  let results = _.map(_.values(groupedResults), group => _.merge(...group));
  // console.log(results);
  return results;
}
