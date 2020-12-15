import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ActivityIndicator, Modal, StyleProp } from 'react-native';
import { ProfileScreenRouteProp, HomeStackNavigationProp } from '../navigation/utils';
import { messageMaxLen, messagePlaceholder, ProfileDb } from '../../utils/variables';
import { colors, buttonsStyles, modalStyle } from '../../utils/styles';
import { connect } from 'react-redux';
import { send_invitation } from '../../services/invitations/actions';
import { set_error } from '../../services/utils/actions';
import { InvitationsDispatchActionProps, InvitationObject, InvitationStatusOptions, InvitationsRootProps } from '../../services/invitations/tsTypes';
import { UserRootStateProps } from '../../services/user/tsTypes';
import { NearUsersRootProps } from '../../services/near_users/tsTypes';
import { FriendsRootProps } from '../../services/friends/tsTypes';
import { RootProps } from '../../services';
import { fireDb } from '../../App';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg, closeSvg } from '../../utils/svgs';

interface ProfileProps {
    navigation: HomeStackNavigationProp;
    route: ProfileScreenRouteProp;
    send_invitation: InvitationsDispatchActionProps['send_invitation'];
    set_error: (message: string) => void;
    user: UserRootStateProps;
    nearUsers: NearUsersRootProps['all'];
    friends: FriendsRootProps['users'];
    outboundInvitations: InvitationsRootProps['outbound'];
}

interface ProfileUserProps extends UserRootStateProps {
    friend: boolean;
    sentInvite: boolean;
}

//Summary
///Profile shows the whole profile of the user depending on if the user is PRIVATE or not
const Profile = (props: ProfileProps) => {
    const [message, setMessage] = useState<string>('');
    const [profileUser, setProfileUser] = useState<ProfileUserProps | undefined>();
    const [sentInvite, setSentInvite] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [warningMsg, setWarningMsg] = useState<string>('');
    const [showModalInvite, setShowModalInvite] = useState<boolean>(false);
    const [sendStatus, setSendStatus] = useState<string>('Send');

    useEffect(() => {
        if (!props.route.params.profileUid) {
            props.set_error('User id not found!')
            props.navigation.goBack()
            return;
        }

        //fetch the profile of the user using profileUid that is passed in params
        (async () => {
            const { profileUid } = props.route.params;

            //check if user is friends profile user (friends should be up to date in redux state)
            var friend: boolean = false;

            for (let i = 0; i < props.friends.length; i++) {
                if (props.friends[i].uid === profileUid) {
                    friend = true;
                    break;
                }
            }

            //first search in all users to get the profile
            //reason I can't get from friends is because if the friends updates profile
            //the friendsObj will not update, but rather near_users and profile will only update
            var profileUserObj: ProfileUserProps | undefined;

            for (let i = 0; i < props.nearUsers.length; i++) {
                if (props.nearUsers[i].uid === profileUid) {
                    profileUserObj = { ...props.nearUsers[i], friend, sentInvite }
                    break;
                }
            }

            //check to see if the profileObj is empty... if it is fetch it from server
            if (!profileUserObj) {
                profileUserObj = await fireDb.collection(ProfileDb).doc(profileUid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const docData = doc.data();

                            if (!docData) return undefined;

                            const { location, name, bioShort, bioLong, stateCity, gender, age, isPrivate } = docData

                            return {
                                uid: doc.id,
                                location,
                                name,
                                bioShort,
                                bioLong,
                                stateCity,
                                gender,
                                age,
                                isPrivate,
                                friend,
                                sentInvite
                            }

                        } else {
                            return undefined;
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        return undefined;
                    })
            }

            //if the profileUserObj is still empty it meant that we weren't able to find the profile
            //and so set error or not found
            console.log(profileUserObj)
            if (!profileUserObj) {
                setErrorMsg("Oops! User not found.")
            } else {
                setProfileUser(profileUserObj)
            }

        })()

    }, [props.route])

    useEffect(() => {
        //if friends is false then see if an invitation was already sent to this user
        //maybe have invitation request implementation so a user can send multiple invitations request
        //on separate days
        for (let i = 0; i < props.outboundInvitations.length; i++) {
            if (props.outboundInvitations[i].uid === profileUid) {
                setSentInvite(true)
                break;
            }
        }
    }, [props.outboundInvitations])

    if (errorMsg) return (<View><Text>{errorMsg}</Text></View>)

    if (!profileUser) return (<View><ActivityIndicator /></View>)

    const { profileUid } = props.route.params;


    const handleRequestToLink = async () => {
        if (message.length < 10) return console.log('not long enough bitch')
        if (!profileUid || !props.user.uid) return console.log('not able to get uid');
        //init invitation object

        setSendStatus('Sending...')

        const invitationContent: InvitationObject = {
            uid: profileUid,
            message: message,
            status: InvitationStatusOptions.pending,
            date: new Date()
        }

        await props.send_invitation(props.user.uid, invitationContent)
            .then((obj) => {
                console.log(obj)
                setSendStatus('Sent')
            })
            .catch((err) => {
                console.log(err)
                setSendStatus('Failed')
            })
    }

    const modal = (
        <Modal
            visible={showModalInvite}
            animationType='fade'
            transparent={true}
            onRequestClose={() => setShowModalInvite(false)}
        >
            <View style={modalStyle.center_view}>
                <View style={modalStyle.modal_view}>
                    <Pressable style={modalStyle.close_button} onPress={() => setShowModalInvite(false)}>
                        <SvgXml xml={closeSvg} width='20' height='20' fill={colors.white} />
                    </Pressable>
                    <Text style={modalStyle.header_text}>Invite</Text>
                    <TextInput
                        multiline
                        placeholder={'100 character limit'}
                        numberOfLines={4}
                        onChangeText={text => setMessage(text)}
                        value={message}
                        autoCompleteType='off'
                        maxLength={messageMaxLen}
                        style={modalStyle.text_area}
                        placeholderTextColor={colors.secondary}
                    />
                    <Pressable onPress={handleRequestToLink} style={buttonsStyles.button_secondary}>
                        <Text style={buttonsStyles.button_secondary_text}>
                            {sendStatus}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )

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

        //if sentInvite is false it means an invite was already sent
        if (!profileUser.sentInvite) return (
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
            {modal}
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
            <View style={styles.timeline}>

            </View>
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
        color: colors.primary
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
    timeline: {
        flex: 1,
        padding: 20,
        backgroundColor: 'orange',
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

export default connect(mapStateToProps, { send_invitation, set_error })(Profile);