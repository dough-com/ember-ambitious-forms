import Ember from 'ember'
import ConvertedOptions from '../mixins/converted-options'

// TODO: what about when value is not in the list of options?

export default Ember.Component.extend(ConvertedOptions, {
  layoutName: 'ember-ambitious-forms@components/amb-form-select',
  service: Ember.inject.service('ember-ambitious-forms'),

  tagName: 'span',
  classNames: 'amb-form-select',
  classNameBindings: ['isOptionSelected:option-selected:prompt-selected'],

  isOptionSelected: Ember.computed.notEmpty('value'),

  prompt: Ember.computed.oneWay('service.config.prompt'),

  init () {
    this._super(...arguments)
    if (this.get('convertedOptions.length') === 1) {
      this.selectConvertedOption(this.get('convertedOptions.firstObject'))
    }
  },

  actions: {
    selectChange (domSelect) {
      let selectedIndex = domSelect.selectedIndex
      if (this.get('prompt')) {
        selectedIndex--
      }
      let option = this.get('convertedOptions').objectAt(selectedIndex)
      this.selectConvertedOption(option)
    }
  }
})
