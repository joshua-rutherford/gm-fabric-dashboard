import state from "./json/mockReduxState.js";

const {
  getVisibleThreads,
  getThreadCounts,
  getRouteMetrics,
  getRouteTree
} = require.requireActual("./utils.js");

describe("Reselect selector getVisibleThreads", () =>
  test("returns an array of thread objects matching state.settings.threadsFilter ", () => {
    expect(getVisibleThreads(state)).toEqual([
      {
        daemon: true,
        id: "2",
        name: "Test Runnable",
        priority: 8,
        stack: [
          "java.lang.Object.wait(Native Method)",
          "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)",
          "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)",
          "java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)"
        ],
        state: "RUNNABLE"
      }
    ]);
  }));

describe("Reselect selector getThreadCounts", () =>
  test("returns an array of totals for each thread type ", () => {
    expect(getThreadCounts(state)).toEqual({
      active: 1,
      all: 6,
      idle: 2,
      stopped: 3
    });
  }));

describe("Reselect selector getRouteMetrics", () =>
  test("returns an object of the metrics that have a key containing the string `route`", () => {
    expect(getRouteMetrics(state)).toEqual({
      "route/ping/GET/status/200": {
        "1500416014314": 1,
        "1500416029215": 1,
        "1500416044215": 1,
        "1500416059217": 1,
        "1500416074215": 1,
        "1500416089215": 1,
        "1500416104216": 1,
        "1500416119215": 1,
        "1500416134216": 1
      },
      "route/ping/GET/time/200.count": {
        "1500416014314": 0,
        "1500416029215": 0,
        "1500416044215": 0,
        "1500416059217": 0,
        "1500416074215": 0,
        "1500416089215": 0,
        "1500416104216": 0,
        "1500416119215": 0,
        "1500416134216": 0
      },
      "route/ping/GET/status/2XX": {
        "1500416014314": 1,
        "1500416029215": 1,
        "1500416044215": 1,
        "1500416059217": 1,
        "1500416074215": 1,
        "1500416089215": 1,
        "1500416104216": 1,
        "1500416119215": 1,
        "1500416134216": 1
      },
      "route/ping/GET/requests": {
        "1500416014314": 1,
        "1500416029215": 1,
        "1500416044215": 1,
        "1500416059217": 1,
        "1500416074215": 1,
        "1500416089215": 1,
        "1500416104216": 1,
        "1500416119215": 1,
        "1500416134216": 1
      },
      "route/ping/GET/response_size.count": {
        "1500416014314": 0,
        "1500416029215": 0,
        "1500416044215": 0,
        "1500416059217": 0,
        "1500416074215": 0,
        "1500416089215": 0,
        "1500416104216": 0,
        "1500416119215": 0,
        "1500416134216": 0
      },
      "route/ping/GET/time.count": {
        "1500416014314": 0,
        "1500416029215": 0,
        "1500416044215": 0,
        "1500416059217": 0,
        "1500416074215": 0,
        "1500416089215": 0,
        "1500416104216": 0,
        "1500416119215": 0,
        "1500416134216": 0
      },
      "route/ping/GET/time/2XX.count": {
        "1500416014314": 0,
        "1500416029215": 0,
        "1500416044215": 0,
        "1500416059217": 0,
        "1500416074215": 0,
        "1500416089215": 0,
        "1500416104216": 0,
        "1500416119215": 0,
        "1500416134216": 0
      }
    });
  }));

describe("Reselect selector getRouteTree", () =>
  test("returns a hierarchical representation of the keys nested under their corresponding routes and HTTP verbs", () => {
    expect(getRouteTree(state)).toEqual({
      "/ping": {
        GET: [
          "route/ping/GET/status/200",
          "route/ping/GET/time/200.count",
          "route/ping/GET/status/2XX",
          "route/ping/GET/requests",
          "route/ping/GET/response_size.count",
          "route/ping/GET/time.count",
          "route/ping/GET/time/2XX.count"
        ]
      }
    });
  }));
