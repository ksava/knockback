$(document).ready( ->
  module("knockback_observables.js")
  test("TEST DEPENDENCY MISSING", ->
    ko.utils; _.VERSION; Backbone.VERSION
  )

  Knockback.locale_manager = new LocaleManager('en', {})

  test("Standard use case: just enough to get the picture", ->
    ContactViewModel = (model) ->
      @attribute_observables = kb.observables(model, {
        name:     {key: 'name', read_only: true}
        number:   'number'
        date:     {key:'date', localizer: LongDateLocalizer}
        name2:    {key: 'name', read_only: true}
      }, this)
      @

    model = new Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # get
    equal(view_model.name(), 'John', "It is a name")
    equal(view_model.name2(), 'John', "It is a name")
    equal(view_model.number(), '555-555-5558', "Not so interesting number")
    Knockback.locale_manager.setLocale('en-GB')
    equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format")
    Knockback.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")

    # set from the view model
    raises((->view_model.name('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    equal(view_model.name2(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    Knockback.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    raises((->view_model.name2('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    equal(view_model.name2(), 'John', "Name not changed")

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    equal(view_model.name(), 'Yoko', "Name changed")
    equal(view_model.number(), '818-818-8181', "Number was changed")
    model.set({date: new Date(1940, 10, 9)})
    Knockback.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")
    view_model.date('10 novembre 1940')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Option to override the default read-only state", ->
    ContactViewModel = (model) ->
      @attribute_observables = kb.observables(model, {
        name:     {key: 'name', write: true}   # LEGACY
        number:   {key: 'number', read_only: false}
        date:     {key:'date', localizer: LongDateLocalizer}
        name2:    'name'
      }, this, false)
      @

    model = new Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # set from the view model
    view_model.name('Paul')
    equal(model.get('name'), 'Paul', "Name changed")
    equal(view_model.name(), 'Paul', "Name changed")
    equal(view_model.name2(), 'Paul', "Name changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    Knockback.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")
    view_model.name2('Ringo')
    equal(model.get('name'), 'Ringo', "Name changed")
    equal(view_model.name(), 'Ringo', "Name changed")
    equal(view_model.name2(), 'Ringo', "Name changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Option to override the default read-only state {read_only: false}", ->
    ContactViewModel = (model) ->
      @attribute_observables = kb.observables(model, {
        name:     {key: 'name'}
        number:   {key: 'number'}
        date:     {key: 'date', localizer: LongDateLocalizer}
        name2:    {key: 'name', read_only: true}
      }, this, {read_only: false})
      @

    model = new Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # set from the view model
    view_model.name('Paul')
    equal(model.get('name'), 'Paul', "Name changed")
    equal(view_model.name(), 'Paul', "Name changed")
    equal(view_model.name2(), 'Paul', "Name changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    Knockback.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    raises((->view_model.name2('Ringo')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'Paul', "Name not changed")
    equal(view_model.name(), 'Paul', "Name not changed")
    equal(view_model.name2(), 'Paul', "Name not changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Option to override the default read-only state {read_only: true}", ->
    ContactViewModel = (model) ->
      @attribute_observables = kb.observables(model, {
        name:     {key: 'name', read_only: false}
        number:   {key: 'number', read_only: false}
        date:     {key: 'date', localizer: LongDateLocalizer, read_only: false}
        name2:    {key: 'name'}
      }, this, {read_only: true})
      @

    model = new Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # set from the view model
    view_model.name('Paul')
    equal(model.get('name'), 'Paul', "Name changed")
    equal(view_model.name(), 'Paul', "Name changed")
    equal(view_model.name2(), 'Paul', "Name changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    Knockback.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    raises((->view_model.name2('Ringo')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'Paul', "Name not changed")
    equal(view_model.name(), 'Paul', "Name not changed")
    equal(view_model.name2(), 'Paul', "Name not changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Supply non-write option state. Should stay read-only", ->
    ContactViewModel = (model) ->
      @attribute_observables = kb.observables(model, {
        name:     {key: 'name', read_only: true}
        number:   'number'
        date:     {key: 'date', read_only: false, localizer: LongDateLocalizer}
        name2:    {key: 'name', read_only: true}
      }, this, {garbage: true})
      @

    model = new Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # set from the view model
    raises((->view_model.name('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    equal(view_model.name2(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    Knockback.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    raises((->view_model.name2('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    equal(view_model.name2(), 'John', "Name not changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Error cases", ->
    raises((->kb.observables(new Backbone.Model({name: 'name1'}), 'name')), Error, 'Observables: mappings_info is missing')

    # TODO
  )
)