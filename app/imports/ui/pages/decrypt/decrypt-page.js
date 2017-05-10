import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Decrypt_Page.helpers({});

Template.Decrypt_Page.events({

  'submit .secret-message': function runStego(event, instance) {
    event.preventDefault();
    const username = FlowRouter.getParam('username');
    let decrypt = $('#decrypt').is(':checked');
    let senderTemp = '';
    let senderArray = [];
    let senderChars = []; // saved sender username here
    let messageTemp = '';
    let messageArray = [];
    let messageChars = []; // saved message here
    let messageDisplay = '';
    let senderDisplay = '';

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
      const canvas = document.getElementById('editedPic')
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pix = imgd.data;

      for (let i = 0, n = 120; i < n; i += 4) {
        const string1 = pix[i].toString();
        const string2 = pix[i + 1].toString();
        const string3 = pix[i + 2].toString();
        senderArray.push(string1);
        senderArray.push(string2);
        senderArray.push(string3);
      }
      for (let j = 0; j < senderArray.length; j++) {
        if (senderArray[j].length > 1) {
          senderArray[j] = senderArray[j].charAt(2);
        }
      }
      for (let i = 0; i < senderArray.length; i++) {
        if (senderTemp === '') {
          senderTemp = senderArray[i];
        } else {
          senderTemp += senderArray[i];
        }
        if (senderTemp.length === 9) {
          senderChars.push(senderTemp);
          senderTemp = '';
        }
      }
      for (let i = 0; i < senderChars.length; i++) {
        const splitTemp = senderChars[i].split('');
        const reverseTemp = splitTemp.reverse();
        const joinTemp = reverseTemp.join('');
        senderChars[i] = String.fromCharCode(parseInt(joinTemp, 2));
      }
      senderChars.reverse();
      senderChars = senderChars.join('');
      /** ***************************************
       *  Gathering data for the message
       *****************************************/
      for (let i = 120, n = pix.length; i < n; i += 4) {
        const string1 = pix[i].toString();
        const string2 = pix[i + 1].toString();
        const string3 = pix[i + 2].toString();
        messageArray.push(string1);
        messageArray.push(string2);
        messageArray.push(string3);
      }
      for (let j = 0; j < messageArray.length; j++) {
        if (messageArray[j].length > 1) {
          messageArray[j] = messageArray[j].charAt(2);
        }
      }
      for (let i = 0; i < messageArray.length; i++) {
        if (messageTemp === '') {
          messageTemp = messageArray[i];
        } else {
          messageTemp += messageArray[i];
        }
        if (messageTemp.length === 9) {
          messageChars.push(messageTemp);
          messageTemp = '';
        }
      }
      for (let i = 0; i < messageChars.length; i++) {
        const splitTemp = messageChars[i].split('');
        const reverseTemp = splitTemp.reverse();
        const joinTemp = reverseTemp.join('');
        messageChars[i] = String.fromCharCode(parseInt(joinTemp, 2));
      }
      messageChars.reverse();
      messageChars = messageChars.join('');

      document.getElementById('sender').innerHTML = 'From: ' + senderChars;
      document.getElementById('message').innerHTML = messageChars;
    }
  },
});

