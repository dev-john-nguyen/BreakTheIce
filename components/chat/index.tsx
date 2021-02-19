import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleProp, StyleSheet, Animated, Pressable } from 'react-native';
import { colors, opacity_colors, dropShadowListContainer, normalize } from '../utils/styles';
import { connect } from 'react-redux';
import { ChatStackNavigationProp } from '../navigation'
import { RootProps } from '../../services';
import { ChatPreviewProps, ChatDispatchActionsProps } from '../../services/chat/types'
import { ListProfileImage } from '../profile/components/ProfileImage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { Icon, BodyText } from '../utils';
import { delete_chat } from '../../services/chat/actions';
import { renderOtherUser } from './utils';
import Empty from '../utils/components/Empty';
import { calcDateDiff } from '../../utils/functions';

interface ChatProps {
    navigation: ChatStackNavigationProp;
    chat: RootProps['chat'];
    user: RootProps['user'];
    delete_chat: ChatDispatchActionsProps['delete_chat'];
}

const Chat = ({ navigation, chat, user, delete_chat }: ChatProps) => {
    const [chatPreviews, setChatPreviews] = useState<ChatPreviewProps[]>()
    useEffect(() => {
        //sort by time;
        chat.previews.sort((chat1: ChatPreviewProps, chat2: ChatPreviewProps) => (new Date(chat2.dateSent) as any) - (new Date(chat1.dateSent) as any))

        setChatPreviews([...chat.previews])
    }, [chat.previews])

    const directToMessage = (preview: ChatPreviewProps) => {
        var otherUser = renderOtherUser(preview.usersInfo, user.uid);

        if (!otherUser) return;

        const targetUser = {
            ...otherUser,
            profileImg: preview.profileImgs[otherUser.uid]
        }

        var title = otherUser ? otherUser.username : 'RandomUser'

        //figure out if unread should be updated ....
        const setRead = preview.unread && user.uid !== preview.recentUid ? true : false

        navigation.navigate('Message', { msgDocId: preview.docId, setRead, targetUser });
    }

    const directToProfile = (user: { uid: string, username: string } | undefined) => {
        if (!user) return;
        navigation.navigate('Profile', {
            profileUid: user.uid,
            title: user.username
        })
    }

    const renderRightActions = (progress: Animated.AnimatedInterpolation) => {

        const trans = progress.interpolate({
            inputRange: [0, .4, .5, 1],
            outputRange: [0, -10, -120, -320],
        });

        return (
            <RectButton style={styles.rightAction}>
                <Animated.View
                    style={[
                        styles.actionText,
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}>
                    <Icon type='trash-2' color={colors.white} size={30} />
                </Animated.View>
            </RectButton>
        )
    }

    if (!chatPreviews) return <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
    </View>

    return (
        <View style={{ flex: 1, paddingBottom: 100 }}>
            <FlatList
                ListEmptyComponent={() => (
                    <Empty style={{ marginTop: 50 }}>No Messages</Empty>
                )}
                data={chatPreviews}
                contentContainerStyle={styles.flat_list}
                renderItem={({ item, index }) => {

                    var unread = item.unread && item.recentUid !== user.uid;

                    var otherUser = renderOtherUser(item.usersInfo, user.uid);

                    var otherUserImg = null;

                    if (otherUser) {
                        otherUserImg = item.profileImgs[otherUser.uid]
                    }

                    const list_style = chat_styles(unread)

                    return (
                        <View style={dropShadowListContainer}>
                            <Swipeable
                                key={item.docId ? item.docId : index.toString()}
                                renderRightActions={renderRightActions}
                                containerStyle={list_style.container}
                                onSwipeableRightOpen={() => delete_chat(item.docId)}
                            >
                                <Pressable style={({ pressed }) => [list_style.content_container, pressed && { backgroundColor: opacity_colors.secondary_medium }]} onPress={() => directToMessage(item)}>
                                    <View style={list_style.profile_section}>
                                        <ListProfileImage
                                            friend={true}
                                            image={otherUserImg}
                                            onImagePress={() => directToProfile(otherUser)}
                                        />
                                        <View style={list_style.profile_section_text}>
                                            <BodyText style={list_style.username} numberOfLines={1}>{otherUser ? otherUser.username.toLowerCase() : 'RandomUser'}</BodyText>
                                        </View>
                                    </View>
                                    <View style={list_style.content_section}>
                                        <BodyText style={list_style.content_section_text} numberOfLines={4}>{item.recentMsg ? item.recentMsg : 'no recent message...'}</BodyText>
                                    </View>
                                    <View style={list_style.top_right}>
                                        <BodyText style={list_style.top_right_text}>{calcDateDiff(item.dateSent)}</BodyText>
                                    </View>
                                </Pressable>
                            </Swipeable>
                        </View>
                    )
                }}
                keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    leftAction: {
        flex: 1,
        backgroundColor: colors.red,
        justifyContent: 'center',
    },
    actionText: {
        color: colors.white,
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
    rightAction: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.red,
    },
    flat_list: {
        paddingBottom: 80
    }
})

const chat_styles = (unread: boolean): StyleProp<any> => StyleSheet.create({
    container: {
        position: 'relative'
    },
    content_container: {
        flex: 1,
        backgroundColor: unread ? colors.secondaryMedium : colors.white,
        flexDirection: 'row',
        paddingLeft: 30,
        height: 150,
        marginBottom: 20
    },
    profile_section: {
        flex: .5,
        marginRight: 10,
        flexDirection: 'column',
        height: 150,
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
        alignSelf: 'center'
    },
    content_section_text: {
        fontSize: 12,
        color: colors.primary,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
    },
    top_right: {
        position: 'absolute',
        top: 5,
        right: 10
    },
    top_right_text: {
        fontSize: normalize(8),
        color: colors.primary,
        margin: 5
    }
})

const mapStateToProps = (state: RootProps) => ({
    chat: state.chat,
    user: state.user
})
export default connect(mapStateToProps, { delete_chat })(Chat);