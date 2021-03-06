// Generated by CoffeeScript 1.3.1
/*
  knockback.js 0.15.1
  (c) 2011 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
*/

var Backbone, Knockback, kb, ko, _;

if (typeof exports !== 'undefined') {
  Knockback = kb = exports;
} else {
  this.Knockback = this.kb = {};
}

Knockback.VERSION = '0.15.1';

_ = !this._ && (typeof require !== 'undefined') ? require('underscore') : this._;

Backbone = !this.Backbone && (typeof require !== 'undefined') ? require('backbone') : this.Backbone;

ko = !this.ko && (typeof require !== 'undefined') ? require('knockout') : this.ko;

Knockback.locale_manager;

Knockback.stats = {
  collection_observables: 0,
  view_models: 0
};

Knockback.stats_on = false;

Knockback.utils = {};

Knockback.utils.legacyWarning = function(identifier, remove_version, message) {
  var _base;
  kb._legacy_warnings || (kb._legacy_warnings = {});
  (_base = kb._legacy_warnings)[identifier] || (_base[identifier] = 0);
  kb._legacy_warnings[identifier]++;
  return console.warn("Legacy warning! '" + identifier + "' has been deprecated (will be removed in Knockback " + remove_version + "). " + message + ".");
};

Knockback.utils.wrappedObservable = function(instance, observable) {
  if (arguments.length === 1) {
    if (!(instance && instance.__kb && instance.__kb.observable)) {
      throw new Error('Knockback: instance is not wrapping an observable');
    }
    return instance.__kb.observable;
  }
  if (!instance) {
    throw new Error('Knockback: no instance for wrapping a observable');
  }
  instance.__kb || (instance.__kb = {});
  if (instance.__kb.observable && instance.__kb.observable.__kb) {
    instance.__kb.observable.__kb.instance = null;
  }
  instance.__kb.observable = observable;
  if (observable) {
    observable.__kb || (observable.__kb = {});
    observable.__kb.instance = instance;
  }
  return observable;
};

Knockback.wrappedObservable = function(instance) {
  kb.utils.legacyWarning('kb.wrappedObservable', '0.16.0', 'Please use kb.utils.wrappedObservable instead');
  return kb.utils.wrappedObservable(instance);
};

Knockback.utils.observableInstanceOf = function(observable, type) {
  if (!observable) {
    return false;
  }
  if (!(observable.__kb && observable.__kb.instance)) {
    return false;
  }
  return observable.__kb.instance instanceof type;
};

Knockback.utils.wrappedModel = function(view_model, model) {
  if (arguments.length === 1) {
    if (view_model && view_model.__kb && view_model.__kb.hasOwnProperty('model')) {
      return view_model.__kb.model;
    } else {
      return view_model;
    }
  }
  if (!view_model) {
    throw new Error('Knockback: no view_model for wrapping a model');
  }
  view_model.__kb || (view_model.__kb = {});
  view_model.__kb.model = model;
  return model;
};

Knockback.viewModelGetModel = Knockback.vmModel = function(view_model) {
  kb.utils.legacyWarning('kb.vmModel', '0.16.0', 'Please use kb.utils.wrappedModel instead');
  return kb.utils.wrappedModel(view_model);
};

Knockback.utils.setToDefault = function(obj) {
  var key, observable, _results;
  if (!obj) {
    return;
  }
  if (ko.isObservable(obj)) {
    return typeof obj.setToDefault === "function" ? obj.setToDefault() : void 0;
  } else if (_.isObject(obj)) {
    _results = [];
    for (key in obj) {
      observable = obj[key];
      _results.push(observable && (key !== '__kb') ? kb.utils.setToDefault(observable) : void 0);
    }
    return _results;
  }
};

Knockback.vmSetToDefault = function(view_model) {
  kb.utils.legacyWarning('kb.vmSetToDefault', '0.16.0', 'Please use kb.utils.release instead');
  return kb.utils.setToDefault(view_model);
};

Knockback.utils.release = function(obj) {
  var key, value;
  if (!obj) {
    return false;
  }
  if (ko.isObservable(obj) || (obj instanceof kb.Observables) || (typeof obj.release === 'function') || (typeof obj.destroy === 'function')) {
    if (obj.release) {
      obj.release();
    } else if (obj.destroy) {
      obj.destroy();
    } else if (obj.dispose) {
      obj.dispose();
    }
    return true;
  } else if (_.isObject(obj) && !(typeof obj === 'function')) {
    for (key in obj) {
      value = obj[key];
      if (!value || (key === '__kb')) {
        continue;
      }
      if (kb.utils.release(value)) {
        obj[key] = null;
      }
    }
    return true;
  }
  return false;
};

Knockback.vmRelease = function(view_model) {
  kb.utils.legacyWarning('kb.vmRelease', '0.16.0', 'Please use kb.utils.release instead');
  return kb.utils.release(view_model);
};

Knockback.vmReleaseObservable = function(observable) {
  kb.utils.legacyWarning('kb.vmReleaseObservable', '0.16.0', 'Please use kb.utils.release instead');
  return kb.utils.release(observable);
};

kb.utils.optionsCreateClear = function(options) {
  delete options['create'];
  delete options['children'];
  delete options['view_model'];
  return delete options['view_model_create'];
};

kb.utils.optionsCreateOverride = function(options, create_options) {
  kb.utils.optionsCreateClear(options);
  return _.extend(options, create_options);
};
