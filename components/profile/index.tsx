import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { ProfileScreenRouteProp, HomeStackNavigationProp } from '../navigation/utils';
import { colors, buttonsStyles, modalStyle } from '../../utils/styles';
import { connect } from 'react-redux';
import { send_invitation } from '../../services/invitations/actions';
import { set_error } from '../../services/utils/actions';
import { InvitationsRootProps } from '../../services/invitations/tsTypes';
import { UserRootStateProps } from '../../services/user/tsTypes';
import { NearUsersRootProps, NearByUsersProps } from '../../services/near_users/tsTypes';
import { FriendsRootProps } from '../../services/friends/tsTypes';
import { RootProps } from '../../services';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg } from '../../utils/svgs';
import InvitationModal from '../modal/InvitationModal';
import { set_current_profile, remove_current_profile } from '../../services/profile/actions';
import { ProfileDispatchActionProps, TimelineLocationProps } from '../../services/profile/tsTypes';
import { UtilsDispatchActionProps } from '../../services/utils/tsTypes';
import Gallery from '../gallery';

interface ProfileProps {
    navigation: HomeStackNavigationProp;
    route: ProfileScreenRouteProp;
    set_error: UtilsDispatchActionProps['set_error']
    user: UserRootStateProps;
    nearUsers: NearUsersRootProps['all'];
    friends: FriendsRootProps['users'];
    outboundInvitations: InvitationsRootProps['outbound'];
    set_current_profile: ProfileDispatchActionProps['set_current_profile'];
}

//Summary
///Profile shows the whole profile of the user depending on if the user is PRIVATE or not
const Profile = (props: ProfileProps) => {
    const [profileUser, setProfileUser] = useState<NearByUsersProps>();
    const [notFound, setNotFound] = useState<boolean>(false);
    const [showModalInvite, setShowModalInvite] = useState<boolean>(false);

    useEffect(() => {
        //set redux state profile
        if (!props.route.params || !props.route.params.profileUid) {
            props.set_error('User id not found!', 'error')
            props.navigation.goBack()
            return;
        }

        var mount = true;

        props.set_current_profile(props.route.params.profileUid)
            .then((resProfile) => {
                if (resProfile) {
                    mount && setProfileUser(resProfile)
                } else {
                    mount && setNotFound(true);
                }
            })
            .catch(err => {
                console.log(err)
                props.set_error("Oops! Looks like we had trouble fetching the profile.", "error")
            })

        //remove on unmount
        //note: the fetched profile should have updated redux near_users state
        return () => { mount = false };

    }, [props.route, props.outboundInvitations])

    if (!profileUser) return (<View><ActivityIndicator /></View>)

    if (notFound) return (<View><Text>Not Found</Text></View>)

    const baseText = (text: string | number, additionalStyle: Object) => (
        <Text style={[styles.base_text, additionalStyle]}>
            {text}
        </Text>
    )

    const renderHeaderContentButton = () => {
        if (profileUser.friend) return (
            <Pressable onPress={() => console.log('direct to message')}
                style={({ pressed }) => (
                    pressed ? buttonsStyles.button_primary_pressed : buttonsStyles.button_primary
                )}
            >
                <Text style={buttonsStyles.button_primary_text}>Message</Text>
            </Pressable>
        )

        if (profileUser.sentInvite) return (
            <Pressable style={buttonsStyles.button_inactive}>
                <Text style={buttonsStyles.button_inactive_text}>Pending</Text>
            </Pressable>
        )
        return (
            <Pressable onPress={() => setShowModalInvite(true)}
                style={({ pressed }) => (
                    pressed ? buttonsStyles.button_primary_pressed : buttonsStyles.button_primary
                )}
            >
                <Text style={buttonsStyles.button_primary_text}>Invite</Text>
            </Pressable>
        )
    }

    return (
        <View style={styles.container}>
            <InvitationModal
                visible={showModalInvite && !profileUser.sentInvite && !profileUser.friend}
                targetUser={profileUser}
                handleClose={() => setShowModalInvite(false)}
            />
            <View style={styles.header_section}>
                <SvgXml xml={userDefaultSvg} width='100' height='100' fill={colors.primary} />
                <View style={styles.header_content}>
                    <View style={styles.header_content_text}>
                        {baseText(profileUser.name, { fontSize: 24 })}
                        {baseText(`${profileUser.age} years old`, { fontSize: 14 })}
                    </View>
                    {renderHeaderContentButton()}
                </View>
            </View>
            <View style={styles.bio}>
                {baseText(profileUser.bioLong, { fontSize: 12 })}
            </View>
            <Gallery gallery={profileUser.gallery} nearByUser={true} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 10
    },
    base_text: {
        color: colors.primary,
        fontWeight: '400'
    },
    header_section: {
        flexBasis: 'auto',
        alignItems: "center",
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '20%'
    },
    header_content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    header_content_text: {
        marginBottom: 10,
        alignItems: 'center'
    },
    bio: {
        flexBasis: 'auto',
        padding: 20,
    },
    bioText: {
        fontSize: 12
    },
    invite_modal: {
        flex: 1,
        backgroundColor: 'green'
    }

})


const mapStateToProps = (state: RootProps) => ({
    outboundInvitations: state.invitations.outbound,
    user: state.user,
    friends: state.friends.users,
    nearUsers: state.nearUsers.all
})

export default connect(mapStateToProps, { send_invitation, set_error, set_current_profile })(Profile);