import { State } from 'jumpstate';

const threadsTable = State({
  initial: [],
  fetchThreadsSuccess(state, payload) {
    const threads = payload.threads;
    let threadIds = threads ? Object.keys(threads) : [];
    if (threadIds.length === 0) return [];
    const threadsTable = (threadIds.length === 0) ? [] :
      threadIds.map(id => ({
        name: threads[id].thread,
        id: id,
        priority: threads[id].priority,
        state: threads[id].state,
        daemon: threads[id].daemon,
        stack: threads[id].stack
      }));
    return threadsTable;
  },
  clearThreads(state, payload) {
    return [];
  }
});

export default threadsTable;
