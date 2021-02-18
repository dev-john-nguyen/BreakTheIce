import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, Dimensions } from 'react-native';
import { NearByUsersProps } from '../../../services/near_users/types';
import { colors, opacity_colors, dropShadowListContainer, normalize } from '../../utils/styles';
import { HomeToChatNavProp } from '../../navigation';
import { CustomButton, Icon, BodyText } from '../../utils';
import { ListProfileImage } from './ProfileImage';
import RespondButton from '../../modal/respond/Slider';
import { InvitationStatusOptions, InvitationsDispatchActionProps } from '../../../services/invitations/types';
import { BlurView } from 'expo-blur';

interface PreviewProps {
    nearUser: NearByUsersProps,
    onSendInvite: () => void;
    navigation: HomeToChatNavProp;
    onAction?: () => void;
    containerStyle: StyleProp<any>;
    onInvitationUpdate: InvitationsDispatchActionProps['update_invitation'];
    x?: boolean;
    handleX?: () => void;
    onRespond: () => void;
    listView?: boolean
}

export default ({ nearUser, onSendInvite, onAction, navigation, containerStyle, onInvitationUpdate, x, handleX, onRespond, listView }: PreviewProps) => {

    const handleMessageOnPress = () => {

        const targetUser = { uid: nearUser.uid, username: nearUser.username, profileImg: nearUser.profileImg }

        navigation.navigate('Chat', {
            screen: 'Message',
            initial: false,
            params: { targetUser }
        })
    }


    const handleDirectToProfile = () => {
        navigation.navigate('Profile', {
            profileUid: nearUser.uid,
            title: nearUser.username
        })
    }

    const renderButton = () => {
        if (nearUser.friend) return <CustomButton type='primary' text='Message' onPress={handleMessageOnPress} />

        if (nearUser.sentInvite) return <CustomButton type='disabled' text='Pending' />

        if (nearUser.receivedInvite) return <CustomButton type='primary' text='Respond' onPress={onRespond} />

        return <CustomButton type='secondary' text='Invite' onPress={onSendInvite} />
    }

    return (
        <Pressable onPress={onAction} style={[styles.container, dropShadowListContainer]}>
            {({ pressed }) => (
                <View style={[styles.content, containerStyle, { backgroundColor: listView && !pressed ? colors.white : !pressed ? opacity_colors.secondary_light : colors.tertiary }]}>
                    <BlurView style={styles.blur} intensity={70}>
                        {
                            !!x && <Pressable style={styles.topRight} onPress={handleX}>
                                <Icon type='x' onPress={handleX} color={colors.primary} pressColor={colors.secondary} size={16} />
                            </Pressable>
                        }
                        <View style={styles.profile_section}>
                            <ListProfileImage
                                image={nearUser.profileImg}
                                onImagePress={handleDirectToProfile}
                                friend={nearUser.friend} />
                            <View style={styles.profile_section_text}>
                                <BodyText style={styles.username} numberOfLines={1}>{nearUser.username ? nearUser.username.toLowerCase() : 'RandomUser'}</BodyText>
                                <BodyText style={styles.age}>{nearUser.age ? nearUser.age : 0} years old</BodyText>
                            </View>
                        </View>
                        <View style={styles.content_section}>
                            <View style={styles.topLeft}>
                                <BodyText style={styles.topLeft_text}>{nearUser.distance ? nearUser.distance : 0} meters away</BodyText>
                            </View>
                            <BodyText style={styles.content_section_text}>{nearUser.statusMsg ? nearUser.statusMsg : 'nothing ...'}</BodyText>
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
        width: Math.round(Dimensions.get('window').width)
    },
    content: {
        width: '100%',
    },
    blur: {
        flexDirection: 'row',
        paddingLeft: 20,
        flex: 1
    },
    topLeft: {
        position: 'absolute',
        top: 5,
        left: 5,
    },
    topRight: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10
    },
    profile_section: {
        flex: .5,
        marginRight: 10,
        flexDirection: 'column',
        height: 150,
    },
    topLeft_text: {
        fontSize: normalize(6),
        color: colors.primary
    },
    profile_section_text: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
        padding: 10
    },
    username: {
        fontSize: normalize(11),
        color: colors.primary,
        textAlign: 'center',
        overflow: 'visible'
    },
    age: {
        fontSize: normalize(7),
        color: colors.primary,
        textAlign: 'center'
    },
    content_section: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 30,
        alignSelf: 'stretch',
        justifyContent: 'space-between'
    },
    content_section_text: {
        fontSize: normalize(10),
        color: colors.primary,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
    },
    content_section_buttons: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    }
})