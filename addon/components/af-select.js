import Ember from 'ember'

import ConvertedOptions from '../mixins/converted-options'

export default Ember.Component.extend(ConvertedOptions, {
  layoutName: 'ember-ambitious-forms@components/af-select',
  service: Ember.inject.service('ember-ambitious-forms'),

  tagName: 'span',
  classNames: 'af-select',

  prompt: Ember.computed.oneWay('service.config.prompt'),
  actions: {
    selectChange (domSelect) {
      let selectedIndex = domSelect.selectedIndex
      if (this.get('prompt')) {
        selectedIndex--
      }
      let option = this.get('convertedOptions').objectAt(selectedIndex)
      let value = option ? option.value : null
      this.set('value', value)
      this.sendAction('action', value)
    }
  }
})
