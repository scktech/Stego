import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Stego_Page.helpers({

});

Template.Profile_Page.events({
  'submit .profile-data-form'(event, instance) {

  }
});

/*nDoing this in the past used to require uploading the image to a server, but with the FileReader object
we can now load the image into the DOM without any round trip to the server. For a tool focused on privacy,
this is huge. */

var reader = new FileReader();

reader.onload = function(event) {
  var dataUrl = event.target.result;
};

reader.readAsDataURL(e.target.files[0]);

/*With our nifty data URL we can now load it into an Image object, which we'll then feed into our
canvas element to do the pixel manipulation./*
 */

var img = new Image();
img.onload = function() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.canvas.width = img.width;
  ctx.canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  // ...
};
img.src = dataUrl;

/*For extra security, it's good to provide the option of encrypting the message before hiding it in the image.
To do this, we'll use the SJCL library. Its encrypt function uses reasonable defaults
(AES-128 in CCM mode and PBKDF2 with 1000 iterations)./*
 */

if (password.length > 0) {
  message = sjcl.encrypt(password, message);
} else {
  message = JSON.stringify({'text': message});
}
/*To encode the message, we'll need to break it up into its constituent 1s and 0s. We do this by getting the
numerical value of each letter in the message using charCodeAt. This returns a 2-byte unicode value, and we can
then do bitwise operations to get the individual bits.*/

var getBit = function(number, location) {
  return ((number >> location) & 1);
};

var getBitsFromNumber = function(number) {
  var bits = [];
  for (var i = 0; i < 16; i++) {
    bits.push(getBit(number, i));
  }
  return bits;
};

var messageBits = [];
for (var i = 0; i < message.length; i++) {
  var code = message.charCodeAt(i);
  var bits = getBitsFromNumber(code);
  messageBits = messageBits.concat(bits);
}

/*The canvas element makes it very easy to retrieve the pixels of an image.*/

var imgData = ctx.getImageData(0, 0, width, height);
var colors = imgData.data;

/*We end up with an array called colors. It contains each of the four color values from each pixel (red, green, blue,
 alpha). So, colors[0] is the red color value of the first pixel, and colors[4] is the red color value of the second
 pixel.

    The easiest approach to encoding is to start at the top left pixel and encode the message linearly.
    This, however, will make it easier to detect, both programatically and with the naked eye.

    Instead, we'll use a simple technique to scatter the message to seemingly random pixels.
    We'll hash the user's password (or a blank string) to get "random" locations from colors.*/

var hash = sjcl.hash.sha256.hash(password);
var pos = 0;
while (pos < messageBits.length) {
  var rand = hash[pos % hash.length] * (pos + 1);
  var loc = Math.abs(rand) % colors.length;
  pos++;
}
/*With the location in hand, we can use bitwise operations to set the 0th bit (the least significant bit) to a bit from the message.*/

  var setBit = function(number, location, bit) {
  return (number & ~(1 << location)) | (bit << location);
};

colors[loc] = setBit(colors[loc], 0, messageBits[pos]);

/*To decode, we use the same scattering code we wrote above. One obvious problem is that, unlike during encoding,
we don't know when to stop!

The solution, which wasn't mentioned above for simplicity, is to encode the message length before the message itself.
We encoded it as a 2-byte number (16 bits).*/

var hash = sjcl.hash.sha256.hash(password);
var messageSize = 0, pos = 0;
while (pos < 16) {
  // use the same code as above to get "loc"
  // ...
  var bit = getBit(bytes[loc], 0);
  messageSize = setBit(messageSize, pos, bit);
  pos++;
}
/*The same exact code can now be used to retrieve each individual character of the message.*/

/*As you may have noticed above, we encoded the message as JSON. This allowed us to include all the various bits of
information necessary for decrypting (like the salt and iteration count).

With our message in hand, we merely need to parse it and, if necessary, decrypt it. With luck, we'll have the original
 plain text in all its glory.*/

var obj = null;
try {
  obj = JSON.parse(message);
} catch (e) {
  // message is invalid
}
if (obj) {
  // decrypt if necessary, then display the text!
}