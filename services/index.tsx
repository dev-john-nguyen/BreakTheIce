import { combineReducers } from 'redux';
import userReducer from './user/reducer';
import utilsReducer from './utils/reducer';
import nearUserReducer from './near_users/reducer';
import invitationsReducer from './invitations/reducer';
import friendsReducer from './friends/reducer';
import chatReducer from './chat/reducer';

import { NearUsersRootProps } from './near_users/tsTypes';
import { UtilsRootStateProps } from './utils/tsTypes';
import { UserRootStateProps } from './user/tsTypes';
import { InvitationsRootProps } from './invitations/tsTypes';
import { FriendsRootProps } from './friends/tsTypes';
import { ChatRootProps } from './chat/tsTypes';

export default combineReducers({
    user: userReducer,
    utils: utilsReducer,
    nearUsers: nearUserReducer,
    invitations: invitationsReducer,
    friends: friendsReducer,
    chat: chatReducer
});

export interface RootProps {
    user: UserRootStateProps;
    utils: UtilsRootStateProps;
    nearUsers: NearUsersRootProps;
    invitations: InvitationsRootProps;
    friends: FriendsRootProps;
    chat: ChatRootProps;
}