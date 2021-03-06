// Generated by CoffeeScript 1.3.1
/*
  knockback_observables.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observables is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/

Knockback.Observables = (function() {

  Observables.name = 'Observables';

  function Observables(model, mappings_info, view_model, options_or_read_only) {
    var is_string, mapping_info, property_name, read_only, _ref, _ref1;
    if (!model) {
      throw new Error('Observables: model is missing');
    }
    if (!mappings_info || !_.isObject(mappings_info)) {
      throw new Error('Observables: mappings_info is missing');
    }
    this.__kb || (this.__kb = {});
    this.__kb.model = model;
    this.__kb.mappings_info = mappings_info;
    this.__kb.view_model = _.isUndefined(view_model) ? this : view_model;
    if (!_.isUndefined(options_or_read_only) && options_or_read_only.hasOwnProperty('write')) {
      kb.utils.legacyWarning('Knockback.Observables option.write', '0.16.0', 'Now default is writable so only supply read_only as required');
      options_or_read_only.read_only = !options_or_read_only.write;
      delete options_or_read_only['write'];
    }
    if (!_.isUndefined(options_or_read_only)) {
      read_only = _.isBoolean(options_or_read_only) ? options_or_read_only : options_or_read_only.read_only;
      _ref = this.__kb.mappings_info;
      for (property_name in _ref) {
        mapping_info = _ref[property_name];
        is_string = _.isString(mapping_info);
        if (is_string) {
          mapping_info = !_.isUndefined(read_only) ? {
            key: mapping_info,
            read_only: read_only
          } : {
            key: mapping_info
          };
        } else if (!_.isUndefined(read_only) && !(mapping_info.hasOwnProperty('read_only') || mapping_info.hasOwnProperty('write'))) {
          mapping_info.read_only = read_only;
        }
        if (!mapping_info.hasOwnProperty('key')) {
          mapping_info.key = property_name;
        }
        this[property_name] = this.__kb.view_model[property_name] = kb.observable(this.__kb.model, mapping_info, this.__kb.view_model);
      }
    } else {
      _ref1 = this.__kb.mappings_info;
      for (property_name in _ref1) {
        mapping_info = _ref1[property_name];
        if (mapping_info.hasOwnProperty('write')) {
          kb.utils.legacyWarning('Knockback.Observables option.write', '0.16.0', 'Now default is writable so only supply read_only as required');
        }
        if (!mapping_info.hasOwnProperty('key')) {
          mapping_info.key = property_name;
        }
        this[property_name] = this.__kb.view_model[property_name] = kb.observable(this.__kb.model, mapping_info, this.__kb.view_model);
      }
    }
  }

  Observables.prototype.destroy = function() {
    var mapping_info, property_name, _ref;
    _ref = this.__kb.mappings_info;
    for (property_name in _ref) {
      mapping_info = _ref[property_name];
      if (this.__kb.view_model[property_name]) {
        this.__kb.view_model[property_name].destroy();
      }
      this.__kb.view_model[property_name] = null;
      this[property_name] = null;
    }
    this.__kb.view_model = null;
    this.__kb.mappings_info = null;
    return this.__kb.model = null;
  };

  Observables.prototype.setToDefault = function() {
    var mapping_info, property_name, _ref, _results;
    _ref = this.__kb.mappings_info;
    _results = [];
    for (property_name in _ref) {
      mapping_info = _ref[property_name];
      _results.push(this.__kb.view_model[property_name].setToDefault());
    }
    return _results;
  };

  return Observables;

})();

Knockback.observables = function(model, mappings_info, view_model, options) {
  return new Knockback.Observables(model, mappings_info, view_model, options);
};
