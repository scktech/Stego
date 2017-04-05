import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Stego_Page.helpers({

});

Template.Stego_Page.events({
  'submit .secret-message': function runStego(event, instance) {
    event.preventDefault();
    var secretMessage = $("#secretMessage").val();

  }
});
