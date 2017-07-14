const { getVisibleThreads, getThreadCounts } = require.requireActual('./utils.js');

const state = {
  threadsTable: [
    {
      daemon: true,
      id: "1",
      name: "Test Waiting",
      priority: 10,
      stack: [
        "java.lang.Object.wait(Native Method)",
        "java.lang.Object.wait(Object.java:502)",
        "java.lang.ref.Reference.tryHandlePending(Reference.java:191)",
        "java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)"
      ],
      state: "WAITING"
    },
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
    },
    {
      daemon: true,
      id: "3",
      name: "Test Timed Waiting",
      priority: 8,
      stack: [
        "java.lang.Object.wait(Native Method)",
        "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)",
        "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)",
        "java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)"
      ],
      state: "TIMED_WAITING"
    },
    {
      daemon: true,
      id: "4",
      name: "Test Terminated",
      priority: 8,
      stack: [
        "java.lang.Object.wait(Native Method)",
        "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)",
        "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)",
        "java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)"
      ],
      state: "TERMINATED"
    },
    {
      daemon: true,
      id: "5",
      name: "Test Blocked",
      priority: 8,
      stack: [
        "java.lang.Object.wait(Native Method)",
        "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)",
        "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)",
        "java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)"
      ],
      state: "BLOCKED"
    },
    {
      daemon: true,
      id: "6",
      name: "Test New",
      priority: 8,
      stack: [
        "java.lang.Object.wait(Native Method)",
        "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)",
        "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)",
        "java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)"
      ],
      state: "NEW"
    }
  ],
  settings: {
    threadsFilter: "active"
  }
};

describe('Reselect selector getVisibleThreads', () =>
  test('returns an array of thread objects matching state.settings.threadsFilter ', () => {
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
  })
);

describe('Reselect selector getThreadCounts', () =>
  test('returns an array of totals for each thread type ', () => {
    expect(getThreadCounts(state)).toEqual({
      active: 1,
      all: 6,
      idle: 2,
      stopped: 3
    });
  })
);
