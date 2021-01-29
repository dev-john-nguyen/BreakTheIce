import { UserProfilePreviewProps } from "../user/types";

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

export interface InitUserProps extends Omit<UserProfilePreviewProps, 'location'
    | 'blockedUsers'> {
    gallery: []
}

export interface SigninDispatchActionProps {
    init_user: (userFormValues: InitFormValues) => Promise<void | undefined | boolean>;
}