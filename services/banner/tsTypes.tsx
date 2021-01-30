export interface BannerRootStateProps {
    loading: boolean;
    banner: BannerItemProps[];
    notification: string
}

export interface BannerItemProps {
    message: string;
    type: string;
    id: string;
}

export interface BannerActionProps {
    type: string;
    payload: { message: string, color?: string, type?: string, id: string }
}

export interface BannerDispatchActionProps {
    set_banner: (message: string, type: 'error' | 'warning' | 'success') => void;
    remove_banner: (id: string) => void;
}