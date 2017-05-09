import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Decrypt_Page.helpers({

});

Template.Decrypt_Page.events({

  'submit .secret-message': function runStego(event, instance) {
    event.preventDefault();
    const secretMessage = $('#secretMessage').val();
    const username = FlowRouter.getParam('username');
    const key = $('#secretKey').val();
    let temp = '';
    let decodedText = '';

    for (let i = 0; i < secretMessage.length; i++) {
      if (temp === '') {
        temp = secretMessage[i];
      } else {
        temp += secretMessage[i];
      }
      if (temp.length === 7) {
        if (decodedText === '') {
          decodedText = String.fromCharCode(parseInt(temp, 2));
        } else {
          decodedText += String.fromCharCode(parseInt(temp, 2));
        }
        temp = '';
      }
    }

  },
});

