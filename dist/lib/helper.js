"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const byName = name => o => o.name === name;
const unnecessaryFunc = r => r;

exports.byName = byName;
exports.unnecessaryFunc = unnecessaryFunc;