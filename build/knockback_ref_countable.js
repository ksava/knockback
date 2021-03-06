// Generated by CoffeeScript 1.3.1
/*
  knockback_ref_countable.js
  (c) 2012 Kevin Malakoff.
  Knockback.RefCountable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/

Knockback.RefCountable = (function() {

  RefCountable.name = 'RefCountable';

  RefCountable.extend = Backbone.Model.extend;

  function RefCountable() {
    this.__kb || (this.__kb = {});
    this.__kb.ref_count = 1;
  }

  RefCountable.prototype.__destroy = function() {};

  RefCountable.prototype.retain = function() {
    if (this.__kb.ref_count <= 0) {
      throw new Error("RefCountable: ref_count is corrupt: " + this.__kb.ref_count);
    }
    this.__kb.ref_count++;
    return this;
  };

  RefCountable.prototype.release = function() {
    if (this.__kb.ref_count <= 0) {
      throw new Error("RefCountable: ref_count is corrupt: " + this.__kb.ref_count);
    }
    this.__kb.ref_count--;
    if (!this.__kb.ref_count) {
      this.__destroy();
    }
    return this;
  };

  RefCountable.prototype.refCount = function() {
    return this.__kb.ref_count;
  };

  return RefCountable;

})();
