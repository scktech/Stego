import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Encrypt_Page.helpers({

});

Template.Encrypt_Page.events({

  'submit .secret-message': function runStego(event, instance) {
    event.preventDefault();
    const secretMessage = $('#secretMessage').val();
    const username = FlowRouter.getParam('username');
    const key = $('#secretKey').val();
    let keyArray = [];
    let binaryMessage = [];
    let binaryUsername = [];
    let encryptedMessage = '';
    let encryptedUsername = '';
    let totalPixles = 0;
    let totalPixlesString = '';
    let totalPixlesBinary = '';

    /** *******************************************
     * calculate total pixels to be used
     *********************************************/
    totalPixles = 50 + (secretMessage.length * 3);
    totalPixlesString = totalPixles.toString();
    for (let i = 0; i < totalPixlesString.length; i++) {
      if (totalPixlesBinary === '') {
        totalPixlesBinary = totalPixlesString[i].charCodeAt(0).toString(2);
      } else {
        totalPixlesBinary += totalPixlesString[i].charCodeAt(0).toString(2);
      }
    }
    /** *******************************************
     * Turning message into a binary array
     * prepping for encryption phase.
     *********************************************/
    for (let i = 0; i < secretMessage.length; i++) {
      /* getting binary to length of 7*/
      let fixLength = secretMessage[i].charCodeAt(0).toString(2);
      if (fixLength.length !== 7) {
        while (fixLength.length !== 7) {
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
      if (fixLength.length !== 7) {
        while (fixLength.length !== 7) {
          fixLength = '0' + fixLength;
        }
      }
      /* creating binary string */
      binaryUsername.push(fixLength);
    }
    /** *******************************************
     * Turning the key into a binary array, prepping
     * for encryption phase.
     *********************************************/
    if (key !== '') {
      for (let i = 0; i < key.length; i++) {
        let fixLength = key[i].charCodeAt(0).toString(2);
        if (fixLength.length !== 7) {
          while (fixLength.length !== 7) {
            fixLength = '0' + fixLength;
          }
        }
        keyArray.push(fixLength);
      }
    }
    /** *******************************************
     * If user entered an encryption key this block
     * will encrypt the username and the message.
     *********************************************/
    if (key !== '') {
      for (let i = 0; i < binaryMessage.length; i++) {
        for (let j = 0; j < 7; j++) {
          if (binaryMessage[i][j] === '1') {
            if (encryptedMessage === '') {
              encryptedMessage = '0';
            } else {
              encryptedMessage += '0';
            }
          } else {
            if (encryptedMessage === '') {
              encryptedMessage = '1';
            } else {
              encryptedMessage += '1';
            }
          }
        }
      }

      for (let i = 0; i < binaryUsername.length; i++) {
        for (let j = 0; j < 7; j++) {
          if (binaryUsername[i][j] === '1') {
            if (encryptedUsername === '') {
              encryptedUsername = '0';
            } else {
              encryptedUsername += '0';
            }
          } else {
            if (encryptedUsername === '') {
              encryptedUsername = '1';
            } else {
              encryptedUsername += '1';
            }
          }
        }
      }
    }
    /** *******************************************
     *encoding the secret message into the image
     *********************************************/
   /*
    let img = new Image();
    img.src = document.getElementById('uploadedImage');

*/
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
      var canvas = document.getElementById("editedPic")
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img,0,0);

      var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var pix = imgd.data;

      // set all ends to 0
      for (let i = 0, n = (totalPixles * 4); i < n; i += 4) {
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

      // first 20 pixles are for informing function for total
      for (let i = 40, n = 0; i > n; i -= 4) {
        pix[i] = 255 - pix[i  ]; // blue
        pix[i - 1] = 255 - pix[i  ]; // green
        pix[i - 2] = 255 - pix[i  ]; // red
        // i+3 is alpha (the fourth element)
      }
      /*
      // next 20 pixles are for key if any
      for (let i = 40, n = 120; i < n; i += 4) {
        pix[i  ] = 255 - pix[i  ]; // red
        pix[i+1] = 255 - pix[i+1]; // green
        pix[i+2] = 255 - pix[i+2]; // blue
        // i+3 is alpha (the fourth element)
      }
      // next 10 are for username of sender
      for (let i = 120, n = 160; i < n; i += 4) {
        pix[i  ] = 255 - pix[i  ]; // red
        pix[i+1] = 255 - pix[i+1]; // green
        pix[i+2] = 255 - pix[i+2]; // blue
        // i+3 is alpha (the fourth element)
      }
*/
// Draw the ImageData at the given (x,y) coordinates.
      ctx.putImageData(imgd, 0, 0);
      //console.log(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    /** *******************************************
     * Displaying both the original and the edited
     * pictures
     *********************************************/
    let oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById('uploadedImage').files[0]);

    oFReader.onload = function (oFREvent) {
      document.getElementById('uploadedPic').src = oFREvent.target.result;
    };
  },
});

