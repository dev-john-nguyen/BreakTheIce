import { LocationObject } from 'expo-location';
import { StateCityProps } from '../user/tsTypes';

export interface NearUsersActionProps {
    type: string;
    payload?: NearUsersProps
}

export interface NearUsersLocationProps {
    uid: string,
    longitude: number,
    latitude: number
}

export interface NearUsersProps {
    nearBy: Array<NearUsersLocationProps>;
    all: Array<NearUsersLocationProps>;
    fetched?: boolean;
}

export interface NearUsersDispatchActionProps {
    set_and_listen_near_users: (uid: string, stateZip: StateCityProps, location: LocationObject) => void;
    validate_near_users: (location: LocationObject, nearByUsers: Array<NearUsersLocationProps>, allUsers: Array<NearUsersLocationProps>) => void;
}