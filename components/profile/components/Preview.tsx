import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, Dimensions } from 'react-native';
import { NearByUsersProps } from '../../../services/near_users/types';
import { colors, opacity_colors } from '../../utils/styles';
import { HomeToChatNavProp } from '../../navigation/utils/types';
import { CustomButton } from '../../utils';
import ProfileImage from './ProfileImage';
import RespondButton from '../../utils/components/RespondButton';
import { InvitationStatusOptions, InvitationsDispatchActionProps } from '../../../services/invitations/types';
import { BlurView } from 'expo-blur';

interface PreviewProps {
    nearUser: NearByUsersProps,
    me?: boolean,
    onSendInvite: () => void;
    navigation: HomeToChatNavProp;
    onAction?: () => void;
    containerStyle: StyleProp<any>;
    onInvitationUpdate: InvitationsDispatchActionProps['update_invitation'];
}

export default ({ nearUser, onSendInvite, onAction, navigation, me, containerStyle, onInvitationUpdate }: PreviewProps) => {
    const [respondLoading, setRespondLoading] = useState<boolean>(false);

    const handleMessageOnPress = () => {

        const targetUser = { uid: nearUser.uid, username: nearUser.username, profileImg: nearUser.profileImg }

        navigation.navigate('Chat', {
            screen: 'Message',
            initial: false,
            params: { targetUser }
        })
    }


    const handleDirectToProfile = () => {
        !me && navigation.navigate('Profile', {
            profileUid: nearUser.uid,
            title: nearUser.username
        })
    }

    const handleInvitationUpdate = async (status: InvitationStatusOptions) => {
        return onInvitationUpdate(nearUser.uid, status)
    }


    const renderButton = () => {
        if (nearUser.friend) return <CustomButton type='secondary' text='Message' onPress={handleMessageOnPress} />

        if (nearUser.sentInvite) return <CustomButton type='disabled' text='Pending' />

        if (nearUser.receivedInvite) return <RespondButton setLoading={setRespondLoading} loading={respondLoading} handleInvitationUpdate={handleInvitationUpdate} />

        if (me && !nearUser.sentInvite) return <CustomButton type='white_outline' text='Close' onPress={onAction} />

        return <CustomButton type='secondary' text='Invite' onPress={onSendInvite} />
    }


    return (
        <Pressable onPress={onAction} style={styles.container}>
            {({ pressed }) => (
                <View style={[pressed ? styles.content_pressed : styles.content, containerStyle]}>
                    <BlurView style={styles.blur} intensity={70}>
                        <View style={styles.topLeft}>
                            <Text style={styles.topLeft_text}>{nearUser.distance ? nearUser.distance : 0} meters away</Text>
                        </View>
                        <View style={styles.profile_section}>
                            <ProfileImage image={nearUser.profileImg} size='regular' onImagePress={handleDirectToProfile} friend={nearUser.friend} />
                            <View style={styles.profile_section_text}>
                                <Text style={styles.username} numberOfLines={1}>{nearUser.username ? nearUser.username.toLowerCase() : 'RandomUser'}</Text>
                                <Text style={styles.age}>{nearUser.age ? nearUser.age : 0} years old</Text>
                            </View>
                        </View>
                        <View style={styles.content_section}>
                            <Text style={styles.content_section_text}>{nearUser.bioShort ? nearUser.bioShort : 'nothing ...'}</Text>
                            <View style={styles.content_section_buttons}>
                                {renderButton()}
                            </View>
                        </View>
                    </BlurView>
                </View>
            )}
        </Pressable >
    )
}

const styles = StyleSheet.create({
    container: {
        width: Math.round(Dimensions.get('window').width),
    },
    content: {
        width: '100%',
        borderTopColor: colors.secondary,
        borderBottomColor: colors.secondary,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        backgroundColor: opacity_colors.secondary_light
    },
    content_pressed: {
        width: '100%',
        borderTopColor: colors.secondary,
        borderBottomColor: colors.secondary,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        backgroundColor: opacity_colors.secondary_medium
    },
    blur: {
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 10,
        paddingTop: 20,
        flex: 1
    },
    topLeft: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    profile_section: {
        flex: .5,
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 130,
        paddingBottom: 10
    },
    topLeft_text: {
        fontSize: 8,
        color: colors.primary
    },
    profile_section_text: {
        bottom: 5
    },
    username: {
        marginTop: 15,
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center',
        overflow: 'visible'
    },
    age: {
        fontSize: 12,
        color: colors.primary,
        textAlign: 'center'
    },
    content_section: {
        flex: 1,
        justifyContent: 'space-evenly',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 10,
        alignSelf: 'center'
    },
    content_section_text: {
        fontSize: 12,
        color: colors.primary,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
    },
    content_section_buttons: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    }
})