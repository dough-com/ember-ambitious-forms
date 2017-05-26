import Ember from 'ember'

import ErrorState from '../utils/error-state'

export default Ember.Component.extend({
  layoutName: 'ember-ambitious-forms@components/amb-form-group',
  classNames: 'amb-form-group',

  fields: Ember.computed(() => Ember.A()),
  fieldsWithErrors: Ember.computed.alias('errorState.contentWithErrors'),

  hasErrors: Ember.computed.alias('errorState.hasAny'),
  errorState: Ember.computed('fields', function () {
    return ErrorState.create({ content: this.get('fields') })
  }),

  _triggerErrorStateChanged: Ember.on('init', Ember.observer('errorState.value', function () {
    // This needs to fire after _syncFields
    Ember.run.debounce(this, this._doTriggerErrorStateChanged, 30)
  })),

  _doTriggerErrorStateChanged () {
    if (!this.get('isDestroyed')) {
      this.sendAction('onErrorStateChanged', this, this.get('errorState'))
    }
  },

  _toInsert: Ember.computed(() => Ember.A()),
  _toRemove: Ember.computed(() => Ember.A()),
  _syncFields () {
    let fields = this.get('fields')
    let toInsert = this.get('_toInsert')
    let toRemove = this.get('_toRemove')

    fields.beginPropertyChanges()
    fields.addObjects(toInsert)
    fields.removeObjects(toRemove)
    toInsert.clear()
    toRemove.clear()
    fields.endPropertyChanges()

    this._triggerErrorStateChanged()
  },

  resetFields() {
    this.get('fields').forEach((field, _index, _enum) => field.resetErrorState())
  },

  serialize() {
    let formData = {}
    this.get('fields').forEach((field, _index, _enum) => {
      let key = field.get('serializationKey')
      formData[key] = field.get('value')
    })
    return formData
  },

  actions: {
    insertField (component) {
      this.get('_toInsert').push(component)
      Ember.run.debounce(this, this._syncFields, 10)
      this._triggerErrorStateChanged()
      this.sendAction('onInsertField', component)
    },

    removeField (component) {
      this.get('_toRemove').push(component)
      Ember.run.debounce(this, this._syncFields, 10)
      this._triggerErrorStateChanged()
      this.sendAction('onRemoveField', component)
    }
  }
}).reopenClass({
  positionalParams: ['scope']
})
