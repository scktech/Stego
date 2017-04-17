import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { EncryptImg } from '/imports/api/encryptImg/EncryptImgCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Encrypt_Page.onCreated(function onCreated() {
  this.subscribe(EncryptImg.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = EncryptImg.getSchema().namedContext('Encrypt_Page');
});



Template.Encrypt_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
});

Template.Encrypt_Page.events({


  'submit .secret-message': function runStego(event, instance) {
    event.preventDefault();
    let secretMessage = $("#secretMessage").val();
    const username = FlowRouter.getParam('username');
    const sendTo = $("#recipient").val();
    const key = $("#secretKey").val();
    const picture = '';//event.target.Picture.value;
    //const updatedEncryptImg = { sendTo, username, picture };
    let binarySecretMessage = 0;

    const updatedEncryptImg = { sendTo, username, picture };

    for (var i = 0; i < secretMessage.length; i++) {
      if (binarySecretMessage === 0) {
        binarySecretMessage = secretMessage[i].charCodeAt(0).toString(2) + " ";
      } else {
        binarySecretMessage += secretMessage[i].charCodeAt(0).toString(2) + " ";
      }
    }

    //document.write(binarySecretMessage);
    //document.write(username);
    //document.write(sendTo);
    //document.write(updatedEncryptImg);

    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    EncryptImg.getSchema().clean(updatedEncryptImg);
    // Determine validity.
    instance.context.validate(updatedEncryptImg);

    if (instance.context.isValid()) {
      const docID = EncryptImg.findDoc(FlowRouter.getParam('username'))._id;
      const id = EncryptImg.update(docID, { $set: updatedEncryptImg });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

