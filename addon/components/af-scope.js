import Ember from 'ember'

export default Ember.Component.extend({
  layoutName: 'ember-ambitious-forms@components/af-scope',
  tagName: ''
}).reopenClass({
  positionalParams: ['scope']
})
