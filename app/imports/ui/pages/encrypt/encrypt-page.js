import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { EncryptedImages, EncryptedImagesSchema } from '/imports/api/encryptImg/EncryptImgCollection';


Template.Encrypt_Page.helpers({

});

Template.Encrypt_Page.events({

  // display selected image
  'change .upload-pic': function (event) {
    event.preventDefault();

    function showImage(src,target) {
      var fr=new FileReader();
      // when image is loaded, set the src of the image where you want to display it
      fr.onload = function(e) { target.src = this.result; };
      src.addEventListener("change",function() {
        // fill fr with image data
        fr.readAsDataURL(src.files[0]);
      });
    }

    var src = document.getElementById("src");
    var target = document.getElementById("target");
    showImage(src,target);

  },


  'submit .secret-message': function runStego(event, instance) {
    event.preventDefault();
    const eventId = event.target.eventId.value;
    const secretMessage = $('#secretMessage').val();
    const username = FlowRouter.getParam('username');
    const sendTo = $('#recipient').val();
    const key = $("#secretKey").val();
    const picture = document.getElementById('src'); // event.target.Picture.value;
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

    document.write(username);

  },

});

