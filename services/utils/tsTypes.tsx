export interface UtilsRootStateProps {
    error: {
        message: string,
        color: string
    };
    loading: boolean;
    color: 'error' | 'warning'
}

export interface UtilsActionProps {
    type: string;
    payload: { message: string, color?: string }
}

export interface UtilsDispatchActionProps {
    set_error: (message: string, color: 'error' | 'warning') => void;
}