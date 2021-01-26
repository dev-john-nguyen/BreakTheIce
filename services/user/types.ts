import { LocationObject } from 'expo-location';

export interface UserActionProps {
    type: string;
    payload: {
        uid: string,
        location: LocationObject,
        ctryStateCity: CtryStateCityProps,
        timelineLocDocId: string,
        gallery: GalleryItemProps[],
        locationListener: { remove: () => void }
    }
}

export interface CtryStateCityProps {
    ctryState: string;
    city: string
}

export interface GalleryItemProps {
    url: string;
    description: string;
    updatedAt: Date;
    id: string;
    cachedUrl?: string;
    nearUserUri?: string;
    name: string;
}

export interface NewGalleryItemProps {
    id: string;
    name: string;
    uri?: string;
    url?: string;
    blob?: Blob;
    description: string;
    updatedAt?: Date;
    cachedUrl?: string;
    removed?: boolean
}

export interface UserProfilePreviewProps {
    uid: string;
    username: string;
    bioShort: string;
    location: LocationObject;
    age: number;
    hideOnMap: boolean;
    profileImg: ProfileImgProps | null;
}

export interface NewProfileImgProps {
    uri: string,
    blob: Blob,
    updatedAt?: Date,
    name: string,
    cachedUrl?: string
}

export interface ProfileImgProps {
    uri: string,
    cachedUrl?: string,
    updatedAt: Date
}

export interface UserRootStateProps {
    uid: string;
    username: string;
    location: LocationObject;
    ctryStateCity: CtryStateCityProps;
    name: string;
    age: number;
    bioLong: string;
    bioShort: string;
    gender: string;
    profileImg: ProfileImgProps | null;
    gallery: GalleryItemProps[] | [];
    hideOnMap: boolean;
    offline: boolean;
    fetchFail?: boolean;
    init?: boolean;
    locationListener?: { remove: () => void }
}

export interface UpdateUserProfileProps {
    name: string;
    bioShort: string;
    bioLong: string;
    age: number;
    gender: string;
}

export interface UpdateUserPrivacyProps {
    offline: boolean;
    hideOnMap: boolean;
}

export interface UserDispatchActionsProps {
    set_and_listen_user_location: (ctryStateCity: CtryStateCityProps, location: LocationObject) => Promise<void>;
    update_profile: (updatedProfileData: UpdateUserProfileProps, profileImg: NewProfileImgProps | undefined) => Promise<any>;
    update_privacy: (updatedPrivacyData: UpdateUserPrivacyProps) => Promise<any>;
    save_gallery: (newGallery: NewGalleryItemProps[]) => Promise<void | undefined>;
    go_online: () => void;
    sign_out: () => void;
}