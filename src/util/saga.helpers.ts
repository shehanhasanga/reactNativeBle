import { eventChannel } from 'redux-saga';
/*
 A helper function for functions that need to be wrapped in an EventChannel
 to return data.
 */
export const createEventChannel = (fn, args = []) => () => {
  return eventChannel(emitter => fn(emitter, ...args));
};