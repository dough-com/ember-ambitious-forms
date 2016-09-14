import Ember from 'ember'

export default Ember.Component.extend({
  layoutName: 'ember-ambitious-forms@components/amb-form',
  classNames: 'amb-form',

  readOnly: false,
  showAllErrors: false,
  fields: Ember.computed(() => Ember.A()),
  fieldsWithError: Ember.computed.filterBy('fields', 'hasError'),
  haveErrors: Ember.computed.notEmpty('fieldsWithError'),

  _pokeObservedComputed: Ember.on('init', function () {
    // We need to do this explicitly to force the observers to run.
    // Computed KVO isn't wired up until a 'get' is run.
    this.getProperties('haveErrors', 'showAllErrors')
  }),

  _haveErrorsObserver: Ember.observer('haveErrors', function () {
    Ember.run.scheduleOnce('actions', this, this._sendActionHaveErrorsChanged)
  }),

  _sendActionHaveErrorsChanged () {
    this.sendAction('haveErrorsChanged', this, this.get('haveErrors'))
  },

  _showAllErrorsObserver: Ember.observer('showAllErrors', function () {
    if (this.get('showAllErrors')) {
      this.displayFieldErrors()
    }
  }),

  displayFieldErrors () {
    Ember.run.scheduleOnce('afterRender', this, this._doDisplayFieldErrors)
  },

  _doDisplayFieldErrors () {
    this.get('fields').forEach((field) => {
      field.set('hideError', false)
    })
  },

  scrollToErrorField (index = 0) {
    let field = this.get('fieldsWithError').objectAt(index)
    if (field) {
      let offset = field.$().offset()
      Ember.$('html, body').animate({ scrollTop: offset.top - 20 }, 200)
    }
  },

  scrollTo (component, { paddingTop = 0 } = {}) {
    let offset = component.$().offset()
    Ember.$('html, body').animate({ scrollTop: offset.top - paddingTop }, 200)
  },

  actions: {
    insertField (component) {
      this.get('fields').addObject(component)

      // Ideally this should be a simple .set(), but it plays havoc with displayFieldErrors()
      // component.set('hideError', false)
      if (this.get('showAllErrors')) {
        this.displayFieldErrors()
      }
    },

    removeField (component) {
      this.get('fields').removeObject(component)
    },

    domSubmit () {
      if (this.get('haveErrors')) {
        this.displayFieldErrors()
        this.sendAction('error', this)
      } else {
        this.sendAction('submit', this)
        this.sendAction('action', this)
      }
    }
  }
})