import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { EncryptedImages, EncryptedImagesSchema } from '/imports/api/encryptImg/EncryptImgCollection';


Template.Encrypt_Page.helpers({

  events: function(){
    return ListOfEvents.find();
  },

});

Template.Encrypt_Page.events({

  'submit .secret-message': function runStego(event, instance) {
    event.preventDefault();
    const eventId = event.target.eventId.value;
    let secretMessage = $("#secretMessage").val();
    const username = FlowRouter.getParam('username');
    const sendTo = $("#recipient").val();
    const key = $("#secretKey").val();
    const picture = '';//event.target.Picture.value;
    //const updatedEncryptImg = { sendTo, username, picture };
    let binarySecretMessage = 0;

    const newEncryptImg = { sendTo, username, picture };

    for (var i = 0; i < secretMessage.length; i++) {
      if (binarySecretMessage === 0) {
        binarySecretMessage = secretMessage[i].charCodeAt(0).toString(2) + " ";
      } else {
        binarySecretMessage += secretMessage[i].charCodeAt(0).toString(2) + " ";
      }
    }


    EncryptedImages.insert(newEncryptImg);

    //document.write(binarySecretMessage);
    //document.write(username);
    document.write(docID);
    //document.write(updatedEncryptImg);

  },
});

