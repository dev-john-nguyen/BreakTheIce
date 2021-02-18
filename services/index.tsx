import { combineReducers } from 'redux';
import userReducer from './user/reducer';
import bannerReducer from './banner/reducer';
import nearUserReducer from './near_users/reducer';
import invitationsReducer from './invitations/reducer';
import friendsReducer from './friends/reducer';
import chatReducer from './chat/reducer';
import profileReducer from './profile/reducer';
import utilsReducer from './utils/reducer'

import { NearUsersRootProps } from './near_users/types';
import { BannerRootStateProps } from './banner/tsTypes';
import { UserRootStateProps } from './user/types';
import { InvitationsRootProps } from './invitations/types';
import { FriendsRootProps } from './friends/types';
import { ChatRootProps } from './chat/types';
import { ProfileRootProps } from './profile/types';

export default combineReducers({
    user: userReducer,
    banner: bannerReducer,
    nearUsers: nearUserReducer,
    invitations: invitationsReducer,
    friends: friendsReducer,
    chat: chatReducer,
    profile: profileReducer,
    utils: utilsReducer
});

export interface RootProps {
    user: UserRootStateProps;
    banner: BannerRootStateProps;
    nearUsers: NearUsersRootProps;
    invitations: InvitationsRootProps;
    friends: FriendsRootProps;
    chat: ChatRootProps;
    profile: ProfileRootProps;
}