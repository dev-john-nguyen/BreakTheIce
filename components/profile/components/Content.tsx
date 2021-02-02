import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../utils/styles';
import Gallery from '../../gallery';
import ProfileImage from './ProfileImage';
import { CustomButton, HeaderText, BodyText } from '../../utils';
import { TopProfileBackground } from '../../utils/svgs';
import { GalleryItemProps } from '../../../services/user/types';
import RespondButton from '../../utils/components/RespondButton';
import { InvitationStatusOptions } from '../../../services/invitations/types';
import { windowWidth } from '../../../utils/variables';
import { calcDateDiff } from '../../../utils/functions';

interface UserProps {
    profileImg: any;
    name: string;
    age: number;
    bioLong: string;
    gallery: GalleryItemProps[] | [];
    friend?: boolean;
    sentInvite?: boolean;
    receivedInvite?: boolean;
    distance: number;
    updatedAt?: Date;
}

interface ProfileProps {
    user: UserProps;
    directToMessage?: () => void;
    directToFriends?: () => void;
    handleInvitationUpdate?: (status: InvitationStatusOptions) => Promise<void>;
    admin: boolean;
    setShowModalInvite?: (show: boolean) => void;
}

export default ({ user, directToMessage, directToFriends, handleInvitationUpdate, admin, setShowModalInvite }: ProfileProps) => {
    const [inviteStatusLoading, setInviteStatusLoading] = useState<boolean>(false);

    const renderButton = () => {
        if (admin) return <CustomButton onPress={directToFriends} text='Friends' type='primary' moreStyles={styles.header_button} />

        if (user.friend) return <CustomButton onPress={directToMessage} text='Message' type='primary' moreStyles={styles.header_button} />

        if (user.sentInvite) return <CustomButton type='disabled' text='Pending' moreStyles={styles.header_button} />

        if (user.receivedInvite && handleInvitationUpdate) return (
            <View style={[styles.header_button, { flexDirection: 'row' }]}>
                <RespondButton
                    handleInvitationUpdate={handleInvitationUpdate}
                    setLoading={setInviteStatusLoading}
                    loading={inviteStatusLoading}
                />
            </View>
        )

        if (setShowModalInvite) return <CustomButton onPress={() => setShowModalInvite(true)} text='Invite' type='primary' moreStyles={styles.header_button} />

        return <CustomButton type='disabled' text='unavailable' moreStyles={styles.header_background} />

    }

    var dateDiff = calcDateDiff(user.updatedAt)

    return (
        <>
            <TopProfileBackground style={styles.header_background} height={'14%'} width={windowWidth.toString()} />
            <View style={styles.container}>
                <View style={styles.distance}>
                    <BodyText style={styles.text}>About {user.distance ? user.distance : 0} meters away</BodyText>
                </View>
                <View style={styles.seen}>
                    <BodyText style={styles.text}>Last seen {dateDiff ? dateDiff : 'now'}</BodyText>
                </View>
                <View style={styles.header_section}>

                    <ProfileImage image={user.profileImg} size='large' />

                    <View style={styles.header_section_content}>
                        <View style={styles.header_content_text}>
                            <HeaderText style={styles.header_text} >{user.name}</HeaderText>
                            <BodyText text={`${user.age} years old`} style={styles.sub_header_text} />
                        </View>
                        {renderButton()}
                    </View>
                </View>

                <View style={styles.bio}>
                    <BodyText text={user.bioLong} style={styles.bio_text} />
                </View>
                <Gallery gallery={user.gallery} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 10,
        position: 'relative'
    },
    distance: {
        position: 'absolute',
        top: 20,
        right: 30
    },
    seen: {
        position: 'absolute',
        top: 20,
        left: 30
    },
    text: {
        color: colors.secondary,
        fontSize: 10
    },
    header_background: {
        top: -5,
        left: 0
    },
    header_section: {
        alignItems: 'center'
    },
    header_section_content: {
        alignItems: 'center'
    },
    header_content_text: {
        alignItems: 'center'
    },
    header_text: {
        marginTop: 10,
        color: colors.primary,
        fontSize: 18
    },
    header_button: {
        marginTop: 10,
        flexDirection: 'row',
        maxWidth: '70%'
    },
    sub_header_text: {
        fontSize: 14,
        color: colors.primary
    },
    bio: {
        paddingTop: 20,
        paddingBottom: 20,
        padding: 10
    },
    bio_text: {
        fontSize: 12,
        color: colors.primary,
        lineHeight: 15
    },
    edit_icon: {
        alignSelf: 'flex-end',
        padding: 10
    }
})