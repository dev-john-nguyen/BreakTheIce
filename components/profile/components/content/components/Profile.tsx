import React, { useLayoutEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { GalleryItemProps } from '../../../../../services/user/types';
import { CustomButton, BodyText, HeaderText, Icon } from '../../../../utils';
import ProfileImage from '../../ProfileImage';
import { colors, normalize } from '../../../../utils/styles';
import Gallery from '../../../../gallery';
import { calcDateDiff } from '../../../../../utils/functions';
import { getGalleryHeight } from '../../../../gallery/utils';

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

export interface ProfileComProps {
    user: UserProps;
    directToMessage?: () => void;
    directToFriends?: () => void;
    admin: boolean;
    showInviteModal?: () => void;
    showRespondModal?: () => void;
    showInterview: () => void;
}


export default ({ user, showInviteModal, showRespondModal, admin, directToMessage, directToFriends, showInterview }: ProfileComProps) => {
    const [forceGalUpdate, setForceGalUpdate] = useState(0)
    const firstUpdate = useRef<boolean>(true)

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

        if (showInviteModal) return <CustomButton onPress={showInviteModal} text='Invite' type='primary' style={styles.header_button} />

        return <CustomButton type='disabled' text='unavailable' style={styles.header_button} />

    }

    var dateDiff = calcDateDiff(user.updatedAt)
    var height = getGalleryHeight(user.gallery)

    return (
        <View style={{ height: height + 60 }}>
            <View style={styles.distance}>
                <BodyText style={styles.text}>About {user.distance ? user.distance : 0} meters away</BodyText>
            </View>
            <View style={styles.seen}>
                <BodyText style={styles.text}>Last seen {dateDiff ? dateDiff : 'now'}</BodyText>
            </View>
            <Gallery gallery={user.gallery} key={forceGalUpdate} height={height} />
            <View style={styles.body} >

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
            </View>

            <Icon type='chevrons-right' color={colors.primary} size={30} pressColor={colors.secondary} onPress={showInterview} style={{
                position:
                    'absolute', bottom: 10, right: 0
            }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        position: 'absolute',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
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
        fontSize: normalize(7)
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
        fontSize: normalize(14)
    },
    header_button: {
        alignSelf: 'stretch',
        justifyContent: 'space-between'
    },
    sub_profile_text: {
        fontSize: normalize(10),
        color: colors.primary,
        marginLeft: 10,
    },
})