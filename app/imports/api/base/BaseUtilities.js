import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Encrypts } from '/imports/api/encryptImg/EncryptImgCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
  Encrypts.removeAll();
}
