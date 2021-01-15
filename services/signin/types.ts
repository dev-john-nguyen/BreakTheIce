export interface SignUpValuesProps {
    email: string;
    password: string;
    username: string;
    name: string;
    age: number;
}

export interface SigninDispatchActionProps {
    signup_user: (userFormValues: SignUpValuesProps) => Promise<void | boolean>;
    login_user: (email: string, password: string) => Promise<void | boolean>
}