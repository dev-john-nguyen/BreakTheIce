import { UserProfilePreviewProps, UpdateUserProfileProps, NewProfileImgProps, NewGalleryItemProps, InterviewProps } from "../user/types";

export interface SignUpValuesProps {
    email: string;
    password: string;
    username: string;
    name: string;
    age: number;
}

export interface InitFormValues {
    username: string;
    name: string;
    age: number;
}

export interface InitUserProps extends Omit<UserProfilePreviewProps, 'location' | 'updatedAt'> {
    gallery: [],
    name: string
}

export interface SigninDispatchActionProps {
    init_user: (userFormValues: InitFormValues) => Promise<void | undefined | boolean>;
    init_account: (interview: InterviewProps, profileImg: NewProfileImgProps | undefined, gallery: NewGalleryItemProps[]) => Promise<void | undefined>
}