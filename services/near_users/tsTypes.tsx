import { LocationObject } from 'expo-location';
import { StateCityProps, UserRootStateProps } from '../user/tsTypes';

export interface NearUsersActionProps {
    type: string;
    payload?: NearUsersRootProps
}

export interface NearUsersRootProps {
    nearBy: Array<UserRootStateProps>;
    all: Array<UserRootStateProps>;
    fetched?: boolean;
}

export interface NearUsersDispatchActionProps {
    set_and_listen_near_users: (uid: string, stateZip: StateCityProps, location: LocationObject) => void;
    validate_near_users: (location: LocationObject, nearByUsers: Array<UserRootStateProps>, allUsers: Array<UserRootStateProps>) => void;
}