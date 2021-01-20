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
    }[];
    statusBar: number
}

export interface UtilsActionProps {
    type: string;
    payload: { message: string, color?: string, type?: string }
}

export interface UtilsDispatchActionProps {
    set_banner: (message: string, type: 'error' | 'warning' | 'success') => void;
}