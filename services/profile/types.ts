import { NearByUsersProps } from '../near_users/types';
import { UserRootStateProps } from '../user/types';
import { InvitationStatusOptions } from '../invitations/types';

export interface ProfileActionProps {
    type: string;
    // payload: {
    //     uid: string,
    //     status: InvitationStatusOptions
    // };
    payload: any
}


export interface ProfileUserProps extends Omit<UserRootStateProps, 'blockedUsers'>, NearByUsersProps { }

export interface ProfileRootProps {
    history: ProfileUserProps[];
}

export interface TimelineDispatchActionProps {
    set_timeline: (uid: string) => void;
    set_current_profile: (profileUid: string) => void;
    remove_current_profile: () => void;
}

export interface ProfileDispatchActionProps {
    set_timeline: (uid: string) => void;
    set_current_profile: (profileUid: string) => Promise<void | ProfileUserProps>;
    remove_current_profile: () => void;
}
