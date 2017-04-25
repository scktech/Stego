import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* eslint-disable object-shorthand */

export const EncryptedImages = new Mongo.Collection('EncryptedImages');

/**
 * Create the schema for Stuff
 */
export const EncryptedImagesSchema = new SimpleSchema({
  to: {
    label: 'to',
    type: String,
    optional: false,
    max: 20,
  },
  from: {
    label: 'from',
    type: String,
    optional: false,
    max: 20,
  },
  image: {
    label: 'image',
    type: String,
    optional: false,
    max: 2000,
  },
});

EncryptedImages.attachSchema(EncryptedImagesSchema);