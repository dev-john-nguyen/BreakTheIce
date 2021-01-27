export interface UtilsRootStateProps {
    loading: boolean;
    banner: BannerItemProps[];
    notification: string
}

export interface BannerItemProps {
    message: string;
    type: string;
    id: string;
}

export interface UtilsActionProps {
    type: string;
    payload: { message: string, color?: string, type?: string, id: string }
}

export interface UtilsDispatchActionProps {
    set_banner: (message: string, type: 'error' | 'warning' | 'success') => void;
    remove_banner: (id: string) => void;
}