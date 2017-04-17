import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { EncryptImg } from '/imports/api/encryptImg/EncryptImgCollection';

Interests.publish();
Profiles.publish();
EncryptImg.publish();