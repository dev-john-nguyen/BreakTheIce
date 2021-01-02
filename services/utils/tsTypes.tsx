export interface UtilsRootStateProps {
    error: {
        message: string,
        color: string
    };
    loading: boolean;
    color: 'error' | 'warning';
    banner: {
        message: string,
        type: string
    }
}

export interface UtilsActionProps {
    type: string;
    payload: { message: string, color?: string, type?: string }
}

export interface UtilsDispatchActionProps {
    set_error: (message: string, color: 'error' | 'warning') => void;
    set_banner: (message: string, type: 'error' | 'warning' | 'success') => void;
}