export interface UtilsRootStateProps {
    loading: boolean;
    banner: {
        message: string,
        type: string
    }[];
    notification: string
}

export interface UtilsActionProps {
    type: string;
    payload: { message: string, color?: string, type?: string }
}

export interface UtilsDispatchActionProps {
    set_banner: (message: string, type: 'error' | 'warning' | 'success') => void;
}