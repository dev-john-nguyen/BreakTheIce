export interface UtilsRootStateProps {
    error: string;
    loading: boolean;
}

export interface UtilsActionProps {
    type: string;
    payload?: string
}