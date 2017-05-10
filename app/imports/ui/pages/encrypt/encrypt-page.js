import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Encrypt_Page.helpers({});

Template.Encrypt_Page.events({

  'submit .secret-message': function runStego(event, instance) {
    event.preventDefault();
    //const eventId = event.target.eventId.value;
    let secretMessage = $("#secretMessage").val();
    const username = FlowRouter.getParam('username');
    let binaryMessage = [];
    let binaryUsername = [];
    let encryptedMessage = '';
    let encryptedUsername = '';

    /** *******************************************
     * Turning message into a binary array
     * prepping for encryption phase.
     *********************************************/
    for (let i = 0; i < secretMessage.length; i++) {
      /* getting binary to length of 7*/
      let fixLength = secretMessage[i].charCodeAt(0).toString(2);
      if (fixLength.length !== 9) {
        while (fixLength.length !== 9) {
          fixLength = '0' + fixLength;
        }
      }
      /* creating binary string */
      binaryMessage.push(fixLength);
    }
    /** *******************************************
     * Turning username into a binary array
     * prepping for encryption phase.
     *********************************************/
    for (let i = 0; i < username.length; i++) {
      /* getting binary to length of 7*/
      let fixLength = username[i].charCodeAt(0).toString(2);
      if (fixLength.length !== 9) {
        while (fixLength.length !== 9) {
          fixLength = '0' + fixLength;
        }
      }
      /* creating binary string */
      binaryUsername.push(fixLength);
    }

    /** *******************************************
     *encoding the secret message into the image
     *********************************************/

    let input;
    let file;
    let fr;
    let img;

    input = document.getElementById('uploadedImage');

    file = input.files[0];
    fr = new FileReader();
    fr.onload = createImage;
    fr.readAsDataURL(file);

    function createImage() {
      img = new Image();
      img.onload = imageLoaded;
      img.src = fr.result;
    }

    function imageLoaded() {
      var canvas = document.getElementById('editedPic')
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var pix = imgd.data;

      // set all ends to 0
      for (let i = 0, n = pix.length; i < n; i += 4) {
        let string1 = pix[i].toString();
        let string2 = pix[i + 1].toString();
        let string3 = pix[i + 2].toString();
        let char1 = string1.charAt(2);
        let char2 = string2.charAt(2);
        let char3 = string3.charAt(2);
        let digit1 = parseInt(char1);
        let digit2 = parseInt(char2);
        let digit3 = parseInt(char3);

        pix[i] -= digit1; // red
        pix[i + 1] -= digit2; // green
        pix[i + 2] -= digit3; // blue
        // i+3 is alpha (the fourth element)
      }

      let usernameString = '';
      for (let k = 0; k < binaryUsername.length; k++) {
        for (let j = 0; j < 9; j++) {
          if (usernameString === '') {
            usernameString = binaryUsername[k][j];
          } else {
            usernameString += binaryUsername[k][j];
          }
        }
      }

      let usernameStringCounter = usernameString.length - 1;
      // next 10 are for username of sender
      for (let i = 0, n = 120; i < n; i += 4) {
        if (usernameStringCounter >= 0) {
          if (usernameString[usernameStringCounter] === '1') {
            pix[i] += 1; // red
          }
          usernameStringCounter -= 1;
        }
        if (usernameStringCounter >= 0) {
          if (usernameString[usernameStringCounter] === '1') {
            pix[i + 1] += 1; // green
          }
          usernameStringCounter -= 1;
        }
        if (usernameStringCounter >= 0) {
          if (usernameString[usernameStringCounter] === '1') {
            pix[i + 2] += 1; // blue
          }
          usernameStringCounter -= 1;
        }
      }

      let messageString = '';
      for (let k = 0; k < binaryMessage.length; k++) {
        for (let j = 0; j < 9; j++) {
          if (messageString === '') {
            messageString = binaryMessage[k][j];
          } else {
            messageString += binaryMessage[k][j];
          }
        }
      }

      let messageStringCounter = messageString.length - 1;
      for (let i = 120, n = pix.length; i < n; i += 4) {
        if (messageStringCounter >= 0) {
          if (messageString[messageStringCounter] === '1') {
            pix[i] += 1; // red
          }
          messageStringCounter -= 1;
        }
        if (messageStringCounter >= 0) {
          if (messageString[messageStringCounter] === '1') {
            pix[i + 1] += 1; // green
          }
          messageStringCounter -= 1;
        }
        if (messageStringCounter >= 0) {
          if (messageString[messageStringCounter] === '1') {
            pix[i + 2] += 1; // blue
          }
          messageStringCounter -= 1;
        }
      }

// Draw the ImageData at the given (x,y) coordinates.
      ctx.putImageData(imgd, 0, 0);
    }

    /** *******************************************
     * Displaying both the original picture
     *********************************************/
    let oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById('uploadedImage').files[0]);

    oFReader.onload = function (oFREvent) {
      document.getElementById('uploadedPic').src = oFREvent.target.result;
    };
  },
});

