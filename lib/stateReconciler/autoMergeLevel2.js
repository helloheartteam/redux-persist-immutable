'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var merge = function merge(state, payload) {
  var value = state.mergeDeep(payload);
  console.log('level2 merge', state, payload, value);
  return value;
};

exports.default = merge;