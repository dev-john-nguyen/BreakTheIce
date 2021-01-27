import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ProfileScreenRouteProp, RootBottomParamList, HomeStackNavigationProp } from '../navigation/utils/types';
import { colors } from '../../utils/styles';
import { connect } from 'react-redux';
import { send_invitation, update_invitation } from '../../services/invitations/actions';
import { InvitationsRootProps, InvitationsDispatchActionProps, InvitationStatusOptions } from '../../services/invitations/types';
import { UserRootStateProps, UserDispatchActionsProps } from '../../services/user/types';
import { NearUsersRootProps } from '../../services/near_users/types';
import { FriendsRootProps, FriendDispatchActionProps } from '../../services/friends/types';
import { RootProps } from '../../services';
import InvitationModal from '../modal/InvitationModal';
import { set_current_profile } from '../../services/profile/actions';
import { ProfileDispatchActionProps, ProfileUserProps, ProfileRootProps } from '../../services/profile/types';
import { UtilsDispatchActionProps } from '../../services/utils/tsTypes';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import HeaderRight from './components/HeaderRight';
import { unfriend_user } from '../../services/friends/actions';
import { set_banner } from '../../services/utils/actions';
import { UnderlineHeader } from '../../utils/components';
import ProfileContent from './components/ProfileContent';
import { TopProfileBackground } from '../../utils/svgs';
import { windowWidth } from '../../utils/variables';
import { update_block_user } from '../../services/user/actions';

interface ProfileProps {
    navigation: BottomTabNavigationProp<RootBottomParamList, 'Home'> & HomeStackNavigationProp
    route: ProfileScreenRouteProp;
    user: UserRootStateProps;
    nearUsers: NearUsersRootProps['all'];
    friends: FriendsRootProps['users'];
    profile: ProfileRootProps;
    outboundInvitations: InvitationsRootProps['outbound'];
    set_current_profile: ProfileDispatchActionProps['set_current_profile'];
    update_invitation: InvitationsDispatchActionProps['update_invitation'];
    unfriend_user: FriendDispatchActionProps['unfriend_user'];
    set_banner: UtilsDispatchActionProps['set_banner'];
    update_block_user: UserDispatchActionsProps['update_block_user'];
}

//Summary
///Profile shows the whole profile of the user depending on if the user is PRIVATE or not
const Profile = (props: ProfileProps) => {
    const [profileUser, setProfileUser] = useState<ProfileUserProps>();
    const [notFound, setNotFound] = useState<boolean>(false);
    const [showModalInvite, setShowModalInvite] = useState<boolean>(false);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                const blocked = props.user.blockedUsers.find(user => user.uid === profileUser?.uid) ? true : false;

                const friend = profileUser?.friend ? true : false;

                return (
                    <HeaderRight handleUnfriendUser={handleUnfriendUser} handleBlockUser={handleUpdateBlockUser} blocked={blocked} friend={friend} />
                )
            },
            headerTintColor: colors.white
        })
    }, [profileUser, props.unfriend_user, props.user.blockedUsers])

    const handleUpdateBlockUser = async () => {
        if (!profileUser) return
        return await props.update_block_user(profileUser.uid)
    }

    const handleUnfriendUser = async () => {
        if (!profileUser) return
        return await props.unfriend_user(profileUser.uid)
    }

    useEffect(() => {
        //set redux state profile
        if (!props.route.params || !props.route.params.profileUid) {
            props.set_banner("Sorry, couldn't find the user information.", 'error')
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

    }, [props.route, props.outboundInvitations, props.profile.history])

    const handleInvitationUpdate = async (status: InvitationStatusOptions) => {
        if (!profileUser) return;

        return await props.update_invitation(profileUser.uid, status)
    }

    const directToMessage = () => {
        if (!profileUser) return;

        const { uid, username, profileImg } = profileUser;

        const targetUser = { uid, username, profileImg }

        props.navigation.navigate('Chat', {
            screen: 'Message',
            initial: false,
            params: {
                targetUser,
                title: targetUser.username
            }
        })
    }


    const renderContent = () => {
        if (notFound || !profileUser) {
            return (
                <View style={styles.utils_container}>
                    <TopProfileBackground style={styles.header_background} height={'180'} width={windowWidth.toString()} />
                    {notFound ? <UnderlineHeader text='User Not Found' /> : <ActivityIndicator size='large' color={colors.primary} />}
                </View>
            )

        }

        return (
            <>
                <InvitationModal
                    visible={showModalInvite && !profileUser.sentInvite && !profileUser.friend}
                    targetUser={profileUser}
                    handleClose={() => setShowModalInvite(false)}
                />
                <ProfileContent
                    user={profileUser}
                    admin={false}
                    directToMessage={directToMessage}
                    handleInvitationUpdate={handleInvitationUpdate}
                    setShowModalInvite={setShowModalInvite}
                />
            </>
        )

    }

    return (
        <View style={styles.container}>
            {renderContent()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    utils_container: {
        flex: 1,
        justifyContent: 'center'
    },
    invite_modal: {
        flex: 1,
        backgroundColor: 'green'
    },
    invitation_buttons: {
        flexDirection: 'row'
    },
    header_background: {
        position: 'absolute',
        top: 0,
        left: 0
    },
})


const mapStateToProps = (state: RootProps) => ({
    outboundInvitations: state.invitations.outbound,
    user: state.user,
    friends: state.friends.users,
    nearUsers: state.nearUsers.all,
    profile: state.profile
})

export default connect(mapStateToProps, { send_invitation, set_current_profile, update_invitation, unfriend_user, set_banner, update_block_user })(Profile);