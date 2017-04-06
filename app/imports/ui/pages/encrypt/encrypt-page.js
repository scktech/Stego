import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Encrypt_Page.helpers({

});

Template.Encrypt_Page.events({
  'submit .secret-message': function runStego(event, instance) {
    event.preventDefault();
    var secretMessage = $("#secretMessage").val();
    var picture = $('input[name="painting"]:checked').val();
  }
});
