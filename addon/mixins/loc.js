import Ember from 'ember'

export default Ember.Mixin.create({
  locKey: Ember.computed('scopeName', 'fieldKey', function () {
    return `af.${this.get('scopeName')}.${this.get('fieldKey')}`
  }),

  locHintKey: Ember.computed('locKey', function () {
    return `${this.get('locKey')}.hint`
  }),

  locPlaceholderKey: Ember.computed('locKey', function () {
    return `${this.get('locKey')}.placeholder`
  }),

  locOptionsKey: Ember.computed('fieldType', 'locKey', function () {
    if (this.get('fieldType') === 'boolean') {
      return 'af.common.options.boolean'
    } else {
      return `${this.get('locKey')}.options`
    }
  }),

  label: Ember.computed('locKey', function () {
    return Ember.String.loc(this.get('locKey'))
  }),

  hint: Ember.computed('locHintKey', function () {
    return Ember.String.loc(this.get('locHintKey'))
  }),

  placeholder: Ember.computed('locPlaceholderKey', function () {
    return Ember.String.loc(this.get('locPlaceholderKey'))
  }),

  options: Ember.computed('optionValues', 'locOptionsKey', function () {
    let optionValues = this.get('optionValues')
    let locOptionsKey = this.get('locOptionsKey')

    if (!optionValues) {
      return
    }

    return optionValues.map((value) => {
      let key = `${locOptionsKey}.${value.toString().camelize()}`
      return Ember.String.loc(key)
    })
  })
})
