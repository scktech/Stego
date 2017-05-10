import { EncryptedImages } from '/imports/api/encryptImg/EncryptImgCollection';
import {_} from 'meteor/underscore';

/**
 * A list of Stuff to pre-fill the Collection.
 * @type {*[]}
 */
const eventSeeds = [
  { to: 'sam',
    from: 'kurt',
    image: 'https://i.redd.it/5x2n776iplty.jpg'
  },
  { to: 'kurt',
    from: 'connor',
    image: 'https://i.redd.it/y3cisxl5voty.jpg'
  },
  { to: 'connor',
    from: 'sam',
    image: 'http://i.imgur.com/pmnXuMG.jpg',
  },

];

if (EncryptedImages.find().count() === 0) {
  _.each(eventSeeds, function seedEvent(event) {
    EncryptedImages.insert(event);
  });
}
