import { LocationObject } from 'expo-location';
import { StateCityProps, UserRootStateProps } from '../user/tsTypes';

export interface NearUsersActionProps {
    type: string;
    payload?: NearByUsersProps
}

export interface NearByUsersProps extends UserRootStateProps {
    friend: boolean;
    distance: number;
}

export interface NearUsersRootProps {
    nearBy: Array<NearByUsersProps>;
    all: Array<NearByUsersProps>;
    fetched?: boolean;
}

export interface NearUsersDispatchActionProps {
    set_and_listen_near_users: (uid: string, stateZip: StateCityProps, location: LocationObject) => void;
    validate_near_users: (location: LocationObject, nearByUsers: Array<NearByUsersProps>, allUsers: Array<UserRootStateProps>) => void;
}