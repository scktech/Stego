import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';

Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.context = Profiles.getSchema().namedContext('Home_Page');
});

Template.Home_Page.helpers({
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  routeUserName() {
    return FlowRouter.getParam('username');
  },
});