import React, { useState, useEffect, useRef, useLayoutEffect, RefObject } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { colors } from '../../utils/styles';
import Gallery from '../../gallery';
import ProfileImage from './ProfileImage';
import { CustomButton, HeaderText, BodyText, Icon } from '../../utils';
import { TopProfileBackground } from '../../utils/svgs';
import { GalleryItemProps } from '../../../services/user/types';
import RespondButton from '../../modal/respond/Slider';
import { InvitationStatusOptions } from '../../../services/invitations/types';
import { windowWidth, windowHeight } from '../../../utils/variables';
import { calcDateDiff } from '../../../utils/functions';
import { ScrollView } from 'react-native-gesture-handler';
import gallery from '../../gallery';
import { getGalleryHeight } from '../../gallery/utils';

interface UserProps {
    profileImg: any;
    name: string;
    age: number;
    bioLong: string;
    gallery: GalleryItemProps[] | [];
    friend?: boolean;
    sentInvite?: boolean;
    receivedInvite?: boolean;
    distance?: number;
    updatedAt?: Date;
}

interface ProfileProps {
    user: UserProps;
    directToMessage?: () => void;
    directToFriends?: () => void;
    admin: boolean;
    showInviteModal?: () => void;
    showRespondModal: () => void;
}

export default ({ user, directToMessage, directToFriends, admin, showInviteModal, showRespondModal }: ProfileProps) => {
    const [forceGalUpdate, setForceGalUpdate] = useState(0)
    const firstUpdate = useRef<boolean>(true)
    const scrollViewRef: RefObject<ScrollView> = useRef() as RefObject<ScrollView>

    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return
        }

        setForceGalUpdate(forceGalUpdate => forceGalUpdate + 1)
    }, [user.gallery])

    const renderButton = () => {
        if (admin) return <CustomButton onPress={directToFriends} text='Friends' type='primary' style={styles.header_button} />

        if (user.friend) return <CustomButton onPress={directToMessage} text='Message' type='primary' style={styles.header_button} />

        if (user.sentInvite) return <CustomButton type='disabled' text='Pending' style={styles.header_button} />

        if (user.receivedInvite) return (
            <CustomButton type='primary' text='Respond' style={styles.header_button} onPress={showRespondModal} />
        )

        if (showInviteModal) return <CustomButton onPress={showInviteModal} text='Invite' type='secondary' style={styles.header_button} />

        return <CustomButton type='disabled' text='unavailable' style={styles.header_background} />

    }

    const scrollToEnd = () => scrollViewRef.current?.scrollToEnd({ animated: true })
    const scrollToTop = () => scrollViewRef.current?.scrollTo({
        x: 0, y: 0, animated: true
    })

    var dateDiff = calcDateDiff(user.updatedAt)
    var height = getGalleryHeight(user.gallery)


    return (
        <>
            <TopProfileBackground style={styles.header_background} height={'14%'} width={windowWidth.toString()} />
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <View style={{ height: windowHeight - 100, width: '100%', justifyContent: 'center' }}>
                    <View style={{ height: height + 60 }}>
                        <View style={styles.distance}>
                            <BodyText style={styles.text}>About {user.distance ? user.distance : 0} meters away</BodyText>
                        </View>
                        <View style={styles.seen}>
                            <BodyText style={styles.text}>Last seen {dateDiff ? dateDiff : 'now'}</BodyText>
                        </View>
                        <Gallery gallery={user.gallery} key={forceGalUpdate} height={height} />
                        <Pressable style={styles.body} onPress={scrollToEnd}>

                            <View style={styles.profile}>

                                <View style={{ flexDirection: 'row' }}>

                                    <ProfileImage image={user.profileImg} size='large' />

                                    <View style={styles.profile_body}>
                                        <HeaderText style={styles.profile_text} >{user.name}</HeaderText>
                                        <BodyText text={`${user.age} years old`} style={styles.sub_profile_text} />
                                    </View>

                                </View>

                                <View style={styles.header_button}>
                                    {renderButton()}
                                </View>
                            </View>
                        </Pressable>
                    </View>

                    <Pressable onPress={scrollToEnd} style={{ height: 100 }} />
                </View>
                <View style={{ backgroundColor: colors.tertiary, height: windowHeight - 100, width: '100%' }}>
                    <Pressable onPress={scrollToTop} style={{ height: 100 }} />
                    <View style={styles.body_bio}>
                        <BodyText text={user.bioLong} style={styles.bio_text} />
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        position: 'relative',
    },
    distance: {
        position: 'absolute',
        top: -10,
        right: 30
    },
    seen: {
        position: 'absolute',
        top: -10,
        left: 30
    },
    text: {
        color: colors.secondary,
        fontSize: 8
    },
    header_background: {
        top: -5,
        left: 0
    },
    body: {
        flex: 1,
        flexDirection: 'column',
    },
    profile: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: -40
    },
    profile_body: {
        alignItems: 'flex-start',
        marginLeft: 10,
        top: 35
    },
    profile_text: {
        marginTop: 10,
        color: colors.primary,
        fontSize: 18
    },
    header_button: {
        alignSelf: 'center'
    },
    sub_profile_text: {
        fontSize: 12,
        color: colors.primary,
        marginLeft: 10,
    },
    body_bio: {
        padding: 10
    },
    bio_text: {
        fontSize: 12,
        color: colors.primary,
        lineHeight: 15
    }
})