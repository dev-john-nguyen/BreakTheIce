import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { ProfileScreenRouteProp, HomeStackNavigationProp } from '../navigation/utils';
import { colors, buttonsStyles } from '../../utils/styles';
import { connect } from 'react-redux';
import { send_invitation, update_invitation } from '../../services/invitations/actions';
import { set_error } from '../../services/utils/actions';
import { InvitationsRootProps, InvitationsDispatchActionProps, InvitationStatusOptions } from '../../services/invitations/tsTypes';
import { UserRootStateProps } from '../../services/user/types';
import { NearUsersRootProps } from '../../services/near_users/types';
import { FriendsRootProps } from '../../services/friends/tsTypes';
import { RootProps } from '../../services';
import InvitationModal from '../modal/InvitationModal';
import { set_current_profile } from '../../services/profile/actions';
import { ProfileDispatchActionProps, ProfileUserProps } from '../../services/profile/tsTypes';
import { UtilsDispatchActionProps } from '../../services/utils/tsTypes';
import Gallery from '../gallery';
import ProfileImage from '../components/ProfileImage';
import RespondButton from '../components/RespondButton';

interface ProfileProps {
    navigation: HomeStackNavigationProp;
    route: ProfileScreenRouteProp;
    set_error: UtilsDispatchActionProps['set_error']
    user: UserRootStateProps;
    nearUsers: NearUsersRootProps['all'];
    friends: FriendsRootProps['users'];
    outboundInvitations: InvitationsRootProps['outbound'];
    set_current_profile: ProfileDispatchActionProps['set_current_profile'];
    update_invitation: InvitationsDispatchActionProps['update_invitation']
}

//Summary
///Profile shows the whole profile of the user depending on if the user is PRIVATE or not
const Profile = (props: ProfileProps) => {
    const [profileUser, setProfileUser] = useState<ProfileUserProps>();
    const [notFound, setNotFound] = useState<boolean>(false);
    const [showModalInvite, setShowModalInvite] = useState<boolean>(false);
    const [inviteStatusLoading, setInviteStatusLoading] = useState<boolean>(false);

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
                mount && setNotFound(true)
            })

        //remove on unmount
        //note: the fetched profile should have updated redux near_users state
        return () => { mount = false };

    }, [props.route, props.outboundInvitations])

    const handleInvitationUpdate = async (status: InvitationStatusOptions) => {
        if (!profileUser) return;

        return await props.update_invitation(profileUser.uid, status)
    }

    const renderHeaderContentButton = () => {
        if (!profileUser) return;

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
            <Pressable style={buttonsStyles.button_disabled}>
                <Text style={buttonsStyles.button_disabled_text}>Pending</Text>
            </Pressable>
        )

        if (profileUser.receivedInvite) return <RespondButton handleInvitationUpdate={handleInvitationUpdate}
            setLoading={setInviteStatusLoading}
            loading={inviteStatusLoading}
        />

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

    const baseText = (text: string | number, additionalStyle: Object) => (
        <Text style={[styles.base_text, additionalStyle]}>
            {text}
        </Text>
    )

    if (notFound) return (<View><Text>Not Found</Text></View>)

    if (!profileUser) return (<View><ActivityIndicator /></View>)

    return (
        <View style={styles.container}>
            <InvitationModal
                visible={showModalInvite && !profileUser.sentInvite && !profileUser.friend}
                targetUser={profileUser}
                handleClose={() => setShowModalInvite(false)}
            />
            <View style={styles.header_section}>
                <ProfileImage image={profileUser.profileImg} size='large' />
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
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '20%'
    },
    header_content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 10
    },
    header_content_text: {
        marginBottom: 10,
        alignItems: 'center'
    },
    bio: {
        flexBasis: 'auto',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10
    },
    bioText: {
        fontSize: 12
    },
    invite_modal: {
        flex: 1,
        backgroundColor: 'green'
    },
    invitation_buttons: {
        flexDirection: 'row'
    }
})


const mapStateToProps = (state: RootProps) => ({
    outboundInvitations: state.invitations.outbound,
    user: state.user,
    friends: state.friends.users,
    nearUsers: state.nearUsers.all
})

export default connect(mapStateToProps, { send_invitation, set_error, set_current_profile, update_invitation })(Profile);