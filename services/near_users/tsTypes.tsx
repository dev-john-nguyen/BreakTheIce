import { LocationObject } from 'expo-location';
import { StateCityProps, UserRootStateProps } from '../user/tsTypes';
import { LocationHistoryProps } from '../profile/tsTypes';

export interface NearUsersActionProps {
    type: string;
    payload?: NearUsersRootProps | string | { uid: string, timeline: LocationHistoryProps[] }
}

export interface NearByUsersProps extends UserRootStateProps {
    friend: boolean;
    distance: number;
    sentInvite: boolean;
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