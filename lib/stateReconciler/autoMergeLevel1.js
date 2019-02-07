'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var merge = function merge(state, payload) {
  var value = state.merge(payload);
  console.log('level1 merge', value);
  return value;
};

exports.default = merge;