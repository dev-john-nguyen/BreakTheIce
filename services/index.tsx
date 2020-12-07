import { combineReducers } from 'redux';
import userReducer from './user/reducer';
import utilsReducer from './utils/reducer';
import nearUserReducer from './near_users/reducer';

import { NearUsersProps } from './near_users/tsTypes';
import { UtilsRootStateProps } from './utils/tsTypes';
import { UserRootStateProps } from './user/tsTypes';

export default combineReducers({
    user: userReducer,
    utils: utilsReducer,
    nearUsers: nearUserReducer
});

export interface RootProps {
    user: UserRootStateProps
    utils: UtilsRootStateProps
    nearUsers: NearUsersProps
}