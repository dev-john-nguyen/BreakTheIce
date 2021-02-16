import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { InvitationsStackNavigationProp } from '../navigation/utils/types';
import { InvitationsRootProps, InvitationObject, InvitationsDispatchActionProps, InvitationStatusOptions } from '../../services/invitations/types';
import { update_invitation_from_invitations } from '../../services/invitations/actions';
import { colors, dropShadowListContainer, normalize } from '../utils/styles';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { renderDate } from '../chat/utils';
import { ListProfileImage } from '../profile/components/ProfileImage';
import Empty from '../utils/components/Empty';
import { Icon, BodyText } from '../utils';

interface Invitations {
    navigation: InvitationsStackNavigationProp;
    invitation: InvitationsRootProps;
    update_invitation_from_invitations: InvitationsDispatchActionProps['update_invitation_from_invitations']
}

const Invitations = ({ navigation, invitation, update_invitation_from_invitations }: Invitations) => {
    const [showPreview, setShowPreview] = useState(false);
    const previewAdmin = useRef(new Animated.Value(0)).current


    useEffect(() => {
        if (showPreview) {
            Animated.timing(previewAdmin, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false
            }).start(() => {
                previewAdmin.setValue(0)
            })
            setShowPreview(false)
        }
    }, [showPreview])


    const handleDirectToProfile = (inviterObj: InvitationObject) => {
        navigation.push('Profile', {
            profileUid: inviterObj.sentBy.uid,
            title: inviterObj.sentBy.username
        })
    }

    const handleShowPreview = () => setShowPreview(true)

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
                    <Icon type='arrow-left-circle' size={40} color={colors.white} pressColor={colors.white} />
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
                    <Icon type='arrow-right-circle' size={40} color={colors.white} pressColor={colors.white} />
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
            contentContainerStyle={styles.flat_list}
            renderItem={({ item, index, separators }) => (
                <View style={[styles.container, dropShadowListContainer]}>
                    {index === 0 && renderAnimation()}
                    <Swipeable
                        renderRightActions={renderRightActions}
                        renderLeftActions={renderLeftActions}
                        onSwipeableRightOpen={() => handleOnStatusUpdatePress(item, InvitationStatusOptions.denied)}
                        onSwipeableLeftOpen={() => handleOnStatusUpdatePress(item, InvitationStatusOptions.accepted)}
                        containerStyle={styles.swipe_container}
                    >
                        <Pressable style={styles.content_container} onPress={handleShowPreview}>
                            <View style={styles.profile_section}>
                                <ListProfileImage
                                    image={item.sentBy.profileImg}
                                    onImagePress={() => handleDirectToProfile(item)}
                                    friend={false}
                                />
                                <View style={styles.profile_section_text}>
                                    <BodyText style={styles.username} numberOfLines={1}>{item.sentBy.username ? item.sentBy.username : 'UnknownUser'}</BodyText>
                                    <BodyText style={styles.age}>{item.sentBy.age ? item.sentBy.age : 0} years old</BodyText>
                                </View>
                            </View>
                            <View style={styles.content_section}>
                                <View style={styles.topLeft}>
                                    <BodyText style={styles.topLeft_text}>{item.createdAt && renderDate(item.createdAt)}</BodyText>
                                </View>
                                <BodyText style={styles.content_section_text}>{item.message ? item.message : 'No Message...'}</BodyText>
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
    flat_list: {
        paddingBottom: 80
    },
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
        flexDirection: 'row',
        marginTop: 20
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
        height: 150,
    },
    profile_section: {
        flex: .5,
        marginRight: 10,
        flexDirection: 'column'
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
        justifyContent: 'space-evenly',
        paddingLeft: 20,
        paddingRight: 10,
        alignSelf: 'stretch'
    },
    content_section_text: {
        fontSize: 12,
        color: colors.primary,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
    },
    topLeft: {
        position: 'absolute',
        top: 5,
        left: 5,
    },
    topLeft_text: {
        fontSize: normalize(6),
        color: colors.primary
    },
})

const mapStateToProps = (state: RootProps) => ({
    invitation: state.invitations
})

export default connect(mapStateToProps, { update_invitation_from_invitations })(Invitations);