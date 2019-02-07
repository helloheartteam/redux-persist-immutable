"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var merge = function merge(state, payload) {
  return state.mergeDeep(payload);
};

exports.default = merge;