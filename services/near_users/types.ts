import { LocationObject } from 'expo-location';
import { CtryStateCityProps, UserRootStateProps, UserProfilePreviewProps } from '../user/types';
import { InvitationStatusOptions } from '../invitations/types';

export interface NearUsersActionProps {
    type: string;
    payload: {
        uid: string,
        status: InvitationStatusOptions,
        nearBy: Array<NearByUsersProps>;
        all: Array<NearByUsersProps>;
        nearUsersListener: () => void;
    }
}

export interface NearByUsersProps extends UserProfilePreviewProps {
    friend: boolean;
    distance: number;
    sentInvite: boolean;
    receivedInvite: boolean;
}


export interface NearUsersRootProps {
    nearBy: Array<NearByUsersProps>;
    all: Array<NearByUsersProps>;
    fetched?: boolean;
    nearUsersListener?: () => void;
}

export interface NearUsersDispatchActionProps {
    set_and_listen_near_users: (ctryStateCity: CtryStateCityProps, location: LocationObject) => (() => void) | undefined;
    validate_near_users: (location: LocationObject, nearByUsers: Array<NearByUsersProps>, allUsers: Array<UserRootStateProps>) => Promise<void>;
    reset_near_users: () => void;
}