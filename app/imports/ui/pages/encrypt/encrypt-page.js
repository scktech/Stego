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
    //var picture = input.files[0];
    //var picture = $("#userFile").val();
    //var picture = $('input[name="painting"]:checked').val();
    var binarySecretMessage = 0;

    //var originalImage = FileImage(picture);
    //var copyImage = originalImage.copy();
    //var imageWidth = copyImage.width();
    //var imageHeight = copyImage.height();

    for (var i = 0; i < secretMessage.length; i++) {
      if (binarySecretMessage === 0) {
        binarySecretMessage = secretMessage[i].charCodeAt(0).toString(2) + " ";
      } else {
        binarySecretMessage += secretMessage[i].charCodeAt(0).toString(2) + " ";
      }
    }
    //copyImage.save("/images/mysecret.png")
    //document.write(picture);
    document.write(binarySecretMessage);
    //document.write('<img src="">');
  },
});

