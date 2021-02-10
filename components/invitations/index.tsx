import React, { useRef, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { InvitationsStackNavigationProp } from '../navigation/utils/types';
import { InvitationsRootProps, InvitationObject, InvitationsDispatchActionProps, InvitationStatusOptions } from '../../services/invitations/types';
import { update_invitation_from_invitations } from '../../services/invitations/actions';
import { colors, opacity_colors } from '../utils/styles';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { renderDate } from '../chat/utils';
import ProfileImage from '../profile/components/ProfileImage';
import Empty from '../utils/components/Empty';
import { Icon } from '../utils';

interface Invitations {
    navigation: InvitationsStackNavigationProp;
    invitation: InvitationsRootProps;
    update_invitation_from_invitations: InvitationsDispatchActionProps['update_invitation_from_invitations']
}

const Invitations = ({ navigation, invitation, update_invitation_from_invitations }: Invitations) => {
    const previewAdmin = useRef(new Animated.Value(0)).current


    useEffect(() => {
        Animated.timing(previewAdmin, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false
        }).start(() => {
            previewAdmin.setValue(0)
        })
    }, [])


    const handleDirectToProfile = (inviterObj: InvitationObject) => {
        navigation.push('Profile', {
            profileUid: inviterObj.sentBy.uid,
            title: inviterObj.sentBy.username
        })
    }

    const handleOnStatusUpdatePress = (inviterObj: InvitationObject, updatedStatus: InvitationObject['status']) => {
        update_invitation_from_invitations(inviterObj, updatedStatus);
    }

    const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
        const trans = progress.interpolate({
            inputRange: [0, .4, .5, 1],
            outputRange: [0, -50, -150, -350],
        });

        return (
            <View style={styles.rightAction}>
                <Animated.View style={
                    {
                        transform: [{ translateX: trans }]
                    }
                }>
                    <Icon type='arrow-left-circle' size={30} color={colors.white} pressColor={colors.white} />
                </Animated.View>
            </View>
        )
    }

    const renderLeftActions = (progress: Animated.AnimatedInterpolation) => {
        const trans = progress.interpolate({
            inputRange: [0, .4, .5, 1],
            outputRange: [0, 50, 150, 350],
        });

        return (
            <View style={styles.leftAction}>
                <Animated.View style={
                    {
                        transform: [{ translateX: trans }]
                    }
                }>
                    <Icon type='arrow-right-circle' size={30} color={colors.white} pressColor={colors.white} />
                </Animated.View>
            </View>
        )
    }

    const renderAnimation = () => {
        return (
            <Animated.View style={{
                width: previewAdmin.interpolate({
                    inputRange: [0, .6, 1],
                    outputRange: [.01, 60, .01],
                }),
                backgroundColor: colors.green,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Icon type='arrow-right-circle' size={30} color={colors.white} pressColor={colors.white} />
            </Animated.View>
        )
    }

    const renderInvitationList = () => {
        return <FlatList
            ListEmptyComponent={() => (
                <Empty style={{ marginTop: 50 }}>No Invitations</Empty>
            )}
            data={invitation.inbound}
            renderItem={({ item, index, separators }) => (
                <View style={styles.container}>
                    {index === 0 && renderAnimation()}
                    <Swipeable
                        renderRightActions={renderRightActions}
                        renderLeftActions={renderLeftActions}
                        onSwipeableRightOpen={() => handleOnStatusUpdatePress(item, InvitationStatusOptions.denied)}
                        onSwipeableLeftOpen={() => handleOnStatusUpdatePress(item, InvitationStatusOptions.accepted)}
                        containerStyle={styles.swipe_container}
                    >
                        <Pressable style={styles.content_container}>
                            <View style={styles.profile_section}>
                                <ProfileImage size='regular' image={item.sentBy.profileImg} onImagePress={() => handleDirectToProfile(item)} />
                                <View style={styles.profile_section_text}>
                                    <Text style={styles.username} numberOfLines={1}>{item.sentBy.username ? item.sentBy.username : 'UnknownUser'}</Text>
                                </View>
                            </View>
                            <View style={styles.content_section}>
                                <Text style={styles.content_section_text}>{item.message ? item.message : 'No Message...'}</Text>
                                <View style={styles.content_section_small}>
                                    <Text style={styles.content_section_small_text}>{item.createdAt && renderDate(item.createdAt)}</Text>
                                </View>
                            </View>
                        </Pressable>
                    </Swipeable>
                </View>
            )}
            keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
        />

    }


    return (
        <View style={{ flex: 1 }}>
            {renderInvitationList()}
        </View>
    )

}

const styles = StyleSheet.create({
    leftAction: {
        flex: 1,
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    rightAction: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.red,
    },
    container: {
        flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: colors.primary,
        borderTopColor: colors.primary,
    },
    swipe_container: {
        width: '100%',
        backgroundColor: colors.white,
        position: 'relative'
    },
    content_container: {
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    profile_section: {
        flexBasis: '30%',
        marginRight: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profile_section_text: {
        bottom: 5
    },
    username: {
        marginTop: 15,
        fontSize: 14,
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
    content_section_small: {
        alignSelf: 'flex-end',
        flexDirection: 'row'
    },
    content_section_small_text: {
        fontSize: 8,
        color: colors.primary,
        margin: 5
    }
})

const mapStateToProps = (state: RootProps) => ({
    invitation: state.invitations
})

export default connect(mapStateToProps, { update_invitation_from_invitations })(Invitations);