import Ember from 'ember'

export default Ember.Mixin.create({
  _lookupOptional (key) {
    if (this._lookupExists(key)) {
      return this._lookup(key)
    }
  },

  lookupKeyConvert: Ember.String.dasherize,

  lookupKey: Ember.computed('scopeName', 'fieldKey', function () {
    let convertedScopeName = this.lookupKeyConvert(this.get('scopeName'))
    let convertedFieldKey = this.lookupKeyConvert(this.get('fieldKey'))
    return `af.${convertedScopeName}.${convertedFieldKey}`
  }),

  lookupHintKey: Ember.computed('lookupKey', function () {
    return `${this.get('lookupKey')}.hint`
  }),

  lookupPlaceholderKey: Ember.computed('lookupKey', function () {
    return `${this.get('lookupKey')}.placeholder`
  }),

  lookupOptionsKey: Ember.computed('fieldType', 'lookupKey', function () {
    let fieldTypeKey = this._fieldTypeConfig('lookupOptionsKey')
    if (fieldTypeKey) {
      return fieldTypeKey
    } else {
      return `${this.get('lookupKey')}.options`
    }
  }),

  label: Ember.computed('_lookupCache', 'lookupKey', function () {
    return this._lookup(this.get('lookupKey'))
  }),

  hint: Ember.computed('_lookupCache', 'lookupHintKey', function () {
    return this._lookupOptional(this.get('lookupHintKey'))
  }),

  placeholder: Ember.computed('_lookupCache', 'lookupPlaceholderKey', function () {
    return this._lookupOptional(this.get('lookupPlaceholderKey'))
  }),

  options: Ember.computed('_lookupCache', 'optionValues', 'lookupOptionsKey', function () {
    let optionValues = this.get('optionValues')
    let lookupOptionsKey = this.get('lookupOptionsKey')

    if (!optionValues) {
      return
    }

    return optionValues.map((value) => {
      let key = `${lookupOptionsKey}.${this.lookupKeyConvert(value.toString())}`
      return this._lookupExists(key) ? [value, this._lookup(key)] : value
    })
  })
})
