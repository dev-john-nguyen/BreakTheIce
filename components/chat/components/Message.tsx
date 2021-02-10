import React, { useEffect, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, FlatList, Text, StyleSheet, ActivityIndicator, Pressable, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { colors } from '../../utils/styles';
import { ChatStackParams, ChatStackNavigationProp } from '../../navigation/utils/types';
import { RouteProp } from '@react-navigation/native';
import { fireDb } from '../../../services/firebase';
import { ChatDb, ChatMessageDb } from '../../../utils/variables';
import { MessageProps, ChatRootProps } from '../../../services/chat/types';
import { RootProps } from '../../../services';
import { set_banner } from '../../../services/banner/actions';
import { BannerDispatchActionProps } from '../../../services/banner/tsTypes';
import { CustomButton, BodyText, HeaderText } from '../../utils';
import { ProfileImgProps } from '../../../services/user/types';
import { timestamp } from '../../../utils/variables';
import ProfileImage from '../../profile/components/ProfileImage';
import { update_if_read, search_redux_chat, set_if_read, database_fetch_chat } from './utils';
import { MessageCurve } from '../../utils/svgs';

interface ComMessageProps {
    route: RouteProp<ChatStackParams, "Message">;
    navigation: ChatStackNavigationProp;
    user: RootProps['user'];
    set_banner: BannerDispatchActionProps['set_banner'];
    chatPreviews: ChatRootProps['previews'];
}

export interface TargetUserProps {
    uid: string;
    username: string;
    profileImg: ProfileImgProps | null
}

const Message = ({ route, navigation, user, set_banner, chatPreviews }: ComMessageProps) => {
    const { msgDocId } = route.params;
    const [messages, setMessages] = useState<MessageProps[] | 'empty'>();
    const [messageTxt, setMessageTxt] = useState<string>('');
    const [targetChatDocId, setTargetChatDocId] = useState<string | undefined>(msgDocId)


    const initChatListener = (msgDocId: string, setRead: boolean) => {
        //check to see if read needs to be updated and updates profile image
        update_if_read(user, msgDocId, setRead);

        return fireDb.collection(ChatDb).doc(msgDocId).collection(ChatMessageDb).onSnapshot((querySnapshot) => {
            var messages: MessageProps[] = [];

            querySnapshot.docs.forEach((doc) => {
                if (doc.exists) {
                    const { message, sentAt, sentBy, sentTo } = doc.data();
                    messages.push({ message, sentAt: sentAt.toDate(), sentBy, docId: doc.id })
                }
            })

            //sort by time;
            messages.sort((msg1: MessageProps, msg2: MessageProps) => (new Date(msg2.sentAt) as any) - (new Date(msg1.sentAt) as any))

            setMessages(messages)
        },
            err => {
                console.log(err)
                set_banner('Oops! Failed to get messages', 'error')
                setMessages('empty');
            }
        )
    }

    const fetchChatAndListen = async (targetUser: TargetUserProps) => {
        var docId: string | undefined;

        const foundChat = search_redux_chat(targetUser, chatPreviews);

        if (!foundChat) {
            const fetchedDocId = await database_fetch_chat(targetUser, user, setMessages, set_banner)
                .catch(err => {
                    console.log(err)
                })

            if (!fetchedDocId) {
                setMessages('empty')
                return;
            }

            docId = fetchedDocId.docId;
        } else {
            docId = foundChat.docId
            const { unread, recentUid } = foundChat
            set_if_read(docId, unread, recentUid, user.uid)
        }

        setTargetChatDocId(docId);

        return initChatListener(docId, false)
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={{ alignItems: 'center' }}>
                    <ProfileImage size='regular' image={route.params.targetUser.profileImg} />
                    <HeaderText style={{ color: colors.primary, fontSize: 12 }}>{route.params.targetUser.username}</HeaderText>
                </View>
            )
        })
    }, [route.params])

    useEffect(() => {
        var unsubscribeMessages: () => void | undefined;

        const { targetUser, msgDocId, setRead } = route.params;

        if (msgDocId) {
            //check if docId can be found if not set error and setread if true
            unsubscribeMessages = initChatListener(msgDocId, setRead)
        } else if (targetUser) {

            fetchChatAndListen(targetUser)
                .then((chatListener) => {
                    if (chatListener) {
                        unsubscribeMessages = chatListener
                    }
                })

        } else {
            set_banner('Unable to identify the target user.', 'error')
            navigation.goBack()
        }

        return () => {
            unsubscribeMessages && unsubscribeMessages()
        };
    }, [route.params, targetChatDocId])

    const handleSendMessage = () => {

        if (messageTxt.length < 1) return set_banner('Say something cool.', 'warning')

        Keyboard.dismiss();

        //there should be only two users in the chat so the sentTo uid
        //can be one or the other
        var batch = fireDb.batch();

        //initate vars
        var chatRef;

        var chatObj: any = {
            recentMsg: messageTxt,
            dateSent: new Date(),
            unread: true,
            recentUid: user.uid,
            timestamp,
            updatedAt: new Date()
        }

        var newChatId: string;

        if (targetChatDocId) {
            //the chat was found
            chatRef = fireDb.collection(ChatDb).doc(targetChatDocId);
        } else if (route.params.targetUser) {
            //create new chat
            chatRef = fireDb.collection(ChatDb).doc();

            const { targetUser } = route.params;

            //init chat data
            chatObj.dateCreated = new Date();

            chatObj.usersInfo = [{
                username: targetUser.username,
                uid: targetUser.uid
            },
            {
                username: user.username,
                uid: user.uid
            }]

            if (user.profileImg) {
                chatObj.profileImgs = {
                    [user.uid]: {
                        uri: user.profileImg.uri,
                        updatedAt: new Date()
                    }
                }
            }

            if (targetUser.profileImg) {
                chatObj.profileImgs = {
                    ...chatObj.profileImgs,
                    [targetUser.uid]: {
                        uri: targetUser.profileImg.uri,
                        updatedAt: new Date()
                    }
                }
            }

            //set new targetChatDocId and this will eventually set the listener
            newChatId = chatRef.id;
        } else {
            //fail
            return set_banner("Oops! Wasn't able to find user information", 'error');
        }

        try {
            batch.set(chatRef, chatObj, { merge: true })
        } catch (err) {
            console.log(err)
            set_banner("Failed to initate the chat", 'error')
        }


        var newMsgRef = chatRef.collection(ChatMessageDb).doc();

        batch.set(newMsgRef, {
            sentBy: user.uid,
            sentAt: new Date(),
            message: messageTxt,
            timestamp,
            updatedAt: new Date()
        }
        )

        batch.commit()
            .then(() => {
                //if chatId is not undefined then a new Chat was created
                newChatId && setTargetChatDocId(newChatId);
                setMessageTxt('');
            })
            .catch((err) => {
                console.log(err)
                set_banner("Sorry, wasn't able to send your message, please try again.", 'error')
            })
    }


    const renderTextMsgs = () => {
        if (!messages) return <ActivityIndicator size='large' color={colors.primary} style={{ flex: 1 }} />

        if (messages === 'empty') {
            return <View style={styles.empty}>
                <Text>No Messages</Text>
            </View>
        }

        return <FlatList
            style={styles.messages}
            data={messages}
            inverted
            initialNumToRender={10}
            renderItem={({ item, index, separators }) => {
                if (item.sentBy === user.uid) {
                    return (
                        <View key={item.docId} style={styles.message_right}>
                            <BodyText style={styles.message_right_text}>{item.message}</BodyText>
                            <MessageCurve style={styles.message_curve_right} color='grey' />
                        </View>
                    )
                } else {
                    return (
                        <View key={item.docId} style={styles.message_left}>
                            <BodyText style={styles.message_left_text}>{item.message}</BodyText>
                            <MessageCurve style={styles.message_curve} color='primary' />
                        </View>
                    )
                }
            }}
            keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
        />
    }


    return (
        <View style={styles.container}>
            {renderTextMsgs()}
            <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={'padding'} style={styles.message_form}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.message_form_content}>
                        <TextInput
                            style={styles.message_form_input}
                            onChangeText={text => setMessageTxt(text)}
                            value={messageTxt}
                            multiline />
                        <CustomButton type='primary' onPress={handleSendMessage} text='Send' />
                    </View>
                </ TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    message_form: {
        borderTopColor: colors.primary,
        borderTopWidth: 1,
    },
    message_form_content: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center'
    },
    message_form_input: {
        color: 'black',
        flexBasis: '70%',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        padding: 10,
        paddingTop: 10,
        borderColor: colors.primary,
        alignSelf: 'stretch'
    },
    profile_content: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    username: {
        marginLeft: 10,
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center'
    },
    messages: {
        flex: 1
    },
    message_left: {
        left: 20,
        marginTop: 10,
        marginBottom: 10,
        padding: 20,
        paddingLeft: 20,
        backgroundColor: colors.primary,
        position: 'relative',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        alignSelf: 'flex-start',
        maxWidth: '60%'
    },
    message_curve: {
        position: 'absolute',
        left: -20,
        bottom: 0,
        width: 30,
        height: 30
    },
    message_left_text: {
        color: colors.white,
        fontSize: 12
    },
    message_right: {
        alignSelf: 'flex-end',
        right: 20,
        marginTop: 10,
        marginBottom: 10,
        position: 'relative',
        padding: 20,
        paddingRight: 20,
        backgroundColor: colors.lightGrey,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 20,
        maxWidth: '60%'
    },
    message_curve_right: {
        position: 'absolute',
        right: -20,
        bottom: 0,
        width: 30,
        height: 30
    },
    message_right_text: {
        color: colors.black,
        fontSize: 12
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
    chatPreviews: state.chat.previews
})
export default connect(mapStateToProps, { set_banner })(Message);