export interface NotificationRootProps {
    expoPushToken: string
}

export interface NotificationDispatchActionProps {
    set_expo_push_token: (expoPushToken: string) => void;
    remove_expo_push_token: () => void;
}