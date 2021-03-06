// Generated by CoffeeScript 1.3.1
/*
  knockback_attribute_connectors.js
  (c) 2012 Kevin Malakoff.
  Knockback.AttributeConnector is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Knockback.AttributeConnector = (function() {

  AttributeConnector.name = 'AttributeConnector';

  function AttributeConnector(model, key, options) {
    var observable;
    this.key = key;
    this.options = options != null ? options : {};
    kb.utils.wrappedModel(this, model);
    this.options = _.clone(this.options);
    this.__kb.value_observable = ko.observable();
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: _.bind(this.read, this),
      write: _.bind(this.write, this)
    }));
    observable.destroy = _.bind(this.destroy, this);
    observable.model = _.bind(this.model, this);
    observable.update = _.bind(this.update, this);
    this.__kb.initializing = true;
    this.update();
    this.__kb.initializing = false;
    return observable;
  }

  AttributeConnector.prototype.destroy = function() {
    this.__kb.value_observable = null;
    kb.utils.wrappedObservable(this).dispose();
    return kb.utils.wrappedObservable(this, null);
  };

  AttributeConnector.prototype.read = function() {
    return this.__kb.value_observable();
  };

  AttributeConnector.prototype.write = function(value) {
    var model, set_info;
    model = kb.utils.wrappedModel(this);
    if (!model) {
      return;
    }
    if (this.options.read_only) {
      if (!this.__kb.initializing) {
        throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.";
      }
    } else {
      set_info = {};
      set_info[this.key] = value;
      return model.set(set_info);
    }
  };

  AttributeConnector.prototype.model = function(new_model) {
    var model;
    model = kb.utils.wrappedModel(this);
    if (arguments.length === 0) {
      return model;
    }
    if (model === new_model) {
      return;
    }
    kb.utils.wrappedModel(this, new_model);
    return this.update();
  };

  AttributeConnector.inferType = function(model, key) {
    var relation, value;
    value = model.get(key);
    if (!value) {
      if (!(Backbone.RelationalModel && (model instanceof Backbone.RelationalModel))) {
        return 'simple';
      }
      relation = _.find(model.getRelations(), function(test) {
        return test.key === key;
      });
      if (!relation) {
        return 'simple';
      }
      if (relation.collectionKey) {
        return 'collection';
      } else {
        return 'model';
      }
    }
    if (value instanceof Backbone.Collection) {
      return 'collection';
    }
    if ((value instanceof Backbone.Model) || (Backbone.ModelRef && (value instanceof Backbone.ModelRef))) {
      return 'model';
    }
    return 'simple';
  };

  AttributeConnector.createByType = function(type, model, key, options) {
    var attribute_options;
    switch (type) {
      case 'collection':
        attribute_options = options ? _.clone(options) : {};
        if (!(options.view_model || options.view_model_create || options.children || options.create)) {
          attribute_options.view_model = kb.ViewModel;
        }
        if (options.store) {
          options.store.addResolverToOptions(attribute_options, model.get(key));
        }
        return kb.collectionAttributeConnector(model, key, attribute_options);
      case 'model':
        attribute_options = options ? _.clone(options) : {};
        if (!attribute_options.options) {
          attribute_options.options = {};
        }
        if (!(options.view_model || options.view_model_create || options.children || options.create)) {
          attribute_options.view_model = kb.ViewModel;
        }
        if (options.store) {
          options.store.addResolverToOptions(attribute_options.options, model.get(key));
        }
        return kb.viewModelAttributeConnector(model, key, attribute_options);
      default:
        return kb.simpleAttributeConnector(model, key, options);
    }
  };

  AttributeConnector.createOrUpdate = function(attribute_connector, model, key, options) {
    var attribute_options, value;
    if (attribute_connector) {
      if (kb.utils.observableInstanceOf(attribute_connector, kb.AttributeConnector)) {
        if (attribute_connector.model() !== model) {
          attribute_connector.model(model);
        } else {
          attribute_connector.update();
        }
      }
      return attribute_connector;
    }
    if (!model) {
      return kb.simpleAttributeConnector(model, key, options);
    }
    if (options.hasOwnProperty('create')) {
      if (!options.create) {
        throw new Error('Knockback.AttributeConnector: options.create is empty');
      }
      return options.create(model, key, options.options || {});
    }
    value = model.get(key);
    if (options.hasOwnProperty('view_model')) {
      if (!options.view_model) {
        throw new Error('Knockback.AttributeConnector: options.view_model is empty');
      }
      return new options.view_model(value, options.options || {});
    } else if (options.hasOwnProperty('view_model_create')) {
      if (!options.view_model_create) {
        throw new Error('Knockback.AttributeConnector: options.view_model_create is empty');
      }
      return options.view_model_create(value, options.options || {});
    } else if (options.hasOwnProperty('children')) {
      if (!options.children) {
        throw new Error('Knockback.AttributeConnector: options.children is empty');
      }
      if (typeof options.children === 'function') {
        attribute_options = {
          view_model: options.children
        };
      } else {
        attribute_options = options.children || {};
      }
      return kb.collectionAttributeConnector(model, key, attribute_options);
    }
    return this.createByType(this.inferType(model, key), model, key, options);
  };

  return AttributeConnector;

})();

Knockback.SimpleAttributeConnector = (function(_super) {

  __extends(SimpleAttributeConnector, _super);

  SimpleAttributeConnector.name = 'SimpleAttributeConnector';

  function SimpleAttributeConnector() {
    SimpleAttributeConnector.__super__.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  }

  SimpleAttributeConnector.prototype.destroy = function() {
    this.current_value = null;
    return SimpleAttributeConnector.__super__.destroy.apply(this, arguments);
  };

  SimpleAttributeConnector.prototype.update = function() {
    var current_value, model, value;
    model = kb.utils.wrappedModel(this);
    if (!model) {
      return;
    }
    value = model.get(this.key);
    current_value = this.__kb.value_observable();
    if (!_.isEqual(current_value, value)) {
      return this.__kb.value_observable(value);
    }
  };

  SimpleAttributeConnector.prototype.write = function(value) {
    var model;
    model = kb.utils.wrappedModel(this);
    if (!model) {
      this.__kb.value_observable(value);
      return;
    }
    return SimpleAttributeConnector.__super__.write.apply(this, arguments);
  };

  return SimpleAttributeConnector;

})(Knockback.AttributeConnector);

Knockback.simpleAttributeConnector = function(model, key, options) {
  return new Knockback.SimpleAttributeConnector(model, key, options);
};

Knockback.CollectionAttributeConnector = (function(_super) {

  __extends(CollectionAttributeConnector, _super);

  CollectionAttributeConnector.name = 'CollectionAttributeConnector';

  function CollectionAttributeConnector() {
    CollectionAttributeConnector.__super__.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  }

  CollectionAttributeConnector.prototype.destroy = function() {
    var current_value;
    current_value = this.__kb.value_observable();
    if (current_value && (typeof current_value.refCount === 'function') && (current_value.refCount() > 0)) {
      current_value.release();
    }
    return CollectionAttributeConnector.__super__.destroy.apply(this, arguments);
  };

  CollectionAttributeConnector.prototype.update = function() {
    var current_value, model, value,
      _this = this;
    model = kb.utils.wrappedModel(this);
    if (!model) {
      return;
    }
    value = model.get(this.key);
    current_value = this.__kb.value_observable();
    if (!current_value) {
      if (this.options.store) {
        return this.__kb.value_observable(this.options.store.resolveValue(value, function() {
          return kb.collectionObservable(value, _this.options);
        }));
      } else {
        return this.__kb.value_observable(kb.collectionObservable(value, this.options));
      }
    } else {
      if (current_value.collection() !== value) {
        current_value.collection(value);
        return this.__kb.value_observable.valueHasMutated();
      }
    }
  };

  CollectionAttributeConnector.prototype.read = function() {
    var current_value;
    current_value = this.__kb.value_observable();
    if (current_value) {
      return current_value();
    } else {
      return;
    }
  };

  return CollectionAttributeConnector;

})(Knockback.AttributeConnector);

Knockback.collectionAttributeConnector = function(model, key, options) {
  return new Knockback.CollectionAttributeConnector(model, key, options);
};

Knockback.ViewModelAttributeConnector = (function(_super) {

  __extends(ViewModelAttributeConnector, _super);

  ViewModelAttributeConnector.name = 'ViewModelAttributeConnector';

  function ViewModelAttributeConnector() {
    ViewModelAttributeConnector.__super__.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  }

  ViewModelAttributeConnector.prototype.destroy = function() {
    var current_value;
    current_value = this.__kb.value_observable();
    if (current_value && (typeof current_value.refCount === 'function') && (current_value.refCount() > 0)) {
      current_value.release();
    }
    return ViewModelAttributeConnector.__super__.destroy.apply(this, arguments);
  };

  ViewModelAttributeConnector.prototype.update = function() {
    var current_value, model, value, view_model_options,
      _this = this;
    model = kb.utils.wrappedModel(this);
    if (!model) {
      return;
    }
    value = model.get(this.key);
    current_value = this.__kb.value_observable();
    if (!current_value) {
      view_model_options = this.options.options ? _.clone(this.options.options) : {};
      if (view_model_options.store) {
        return this.__kb.value_observable(view_model_options.store.resolveValue(value, function() {
          if (_this.options.view_model) {
            return new _this.options.view_model(value, view_model_options);
          } else {
            return _this.options.view_model_create(value, view_model_options);
          }
        }));
      } else {
        return this.__kb.value_observable(this.options.view_model ? new this.options.view_model(value, view_model_options) : this.options.view_model_create(value, view_model_options));
      }
    } else {
      if (!(current_value.model && (typeof current_value.model === 'function'))) {
        throw new Error("Knockback.viewModelAttributeConnector: unknown how to model a view model");
      }
      if (current_value.model() !== value) {
        current_value.model(value);
        return this.__kb.value_observable.valueHasMutated();
      }
    }
  };

  return ViewModelAttributeConnector;

})(Knockback.AttributeConnector);

Knockback.viewModelAttributeConnector = function(model, key, options) {
  return new Knockback.ViewModelAttributeConnector(model, key, options);
};
