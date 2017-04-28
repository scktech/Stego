/**
 * Created by connor on 4/21/17.
 */
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

/** @module Profile */

/**
 * EncryptImg provide Image data for a user.
 * @extends module:Base~BaseCollection
 */
class EncryptImgCollection extends BaseCollection {

  /**
   * Creates the Encrypted Image collection.
   */
  constructor() {
    super('EncryptImage', new SimpleSchema({
      sendTo: { type: String},
      // Remainder are optional
      username: { type: String, optional: true},
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
    }));
  }

  /**
   * Defines a new Encrypted Image.
   * @example
   * EncryptImg.define({
   *                   username: 'johnson',
   *                   key: 'myencryptKey',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   * @param { Object } description Object with required key username.
   * Username must be unique for all users. It should be the UH email account.
   * Key is used to decrypt a message.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more keys are not defined.
   * @returns The newly created docID.
   */
  define({ sendTo='', username='', picture ='' }) {
    // make sure required fields are OK.
    const checkPattern = { sendTo: String, username: String, picture: SimpleSchema.RegEx.Url };
    check({ sendTo, username, picture }, checkPattern);

    return this._collection.insert({ sendTo, username, picture });
  }

  /**
   * Returns an object representing the Encrypted Image docID in a format acceptable to define().
   * @param docID The docID of a Encrypted Image.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const sendTo = doc.sendTo;
    const username = doc.username;
    const picture = doc.picture;
    return { sendTo, username, picture };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Encrypts = new EncryptImgCollection();
