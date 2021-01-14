import React, { useEffect, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, FlatList, Text, StyleSheet, ActivityIndicator, Pressable, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ProfileImg } from '../../../utils/components';
import { colors, buttonsStyles } from '../../../utils/styles';
import { ChatStackParams, ChatStackNavigationProp } from '../../navigation/utils';
import { RouteProp } from '@react-navigation/native';
import { fireDb } from '../../../services/firebase';
import { ChatDb, ChatMessageDb } from '../../../utils/variables';
import { MessageProps, ChatPreviewProps } from '../../../services/chat/types';
import { RootProps } from '../../../services';
import { set_banner } from '../../../services/utils/actions';
import { UtilsDispatchActionProps } from '../../../services/utils/tsTypes';

interface ComMessageProps {
    route: RouteProp<ChatStackParams, "Message">;
    navigation: ChatStackNavigationProp;
    user: RootProps['user'];
    set_banner: UtilsDispatchActionProps['set_banner']
}

const Message = (props: ComMessageProps) => {
    const { msgDocId } = props.route.params;
    const [messages, setMessages] = useState<MessageProps[] | 'empty'>();
    const [messageTxt, setMessageTxt] = useState<string>('');
    const [targetChatDocId, setTargetChatDocId] = useState<string | undefined>(msgDocId)


    const dbListener = (msgDocId: string) => {
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
                props.set_banner('Oops! Failed to get messages', 'error')
                setMessages('empty');
            }
        )
    }

    const fetchChat = async () => {
        const { user } = props;
        const { targetUser } = props.route.params;

        if (targetUser) {
            return fireDb.collection(ChatDb)
                .where('usersInfo', 'array-contains', { uid: user.uid, username: user.username })
                .get()
                .then(querySnapShot => {

                    const docId = querySnapShot.docs.find(doc => {
                        var chatFound: boolean = false

                        if (doc.exists) {
                            const { usersInfo } = doc.data() as ChatPreviewProps;

                            usersInfo.forEach(userInfo => {
                                if (userInfo.uid === targetUser.uid) {
                                    chatFound = true
                                }
                            })
                        }

                        return chatFound
                    })

                    if (docId) {
                        return docId.id
                    }

                    setMessages('empty')
                })
                .catch((err) => {
                    console.log(err)
                    props.set_banner('Oops! Something went wrong getting the chat messages.', 'error')
                    setMessages('empty')
                })
        } else {
            props.navigation.goBack()
        }
    }

    useEffect(() => {
        //route.params change remove listener and
        // const { msgDocId, targetUser } = props.route.params;
        var unsubscribeMessages: () => void | undefined;

        const { targetUser, msgDocId, unread } = props.route.params;

        if (msgDocId) {
            if (unread) {
                //set message read
                fireDb.collection(ChatDb).doc(msgDocId).set({ unread: false }, { merge: true })
            }
            //check if docId can be found if not set error
            unsubscribeMessages = dbListener(msgDocId)
        } else if (targetUser) {
            //search if message already exists between users
            fetchChat()
                .then((docId) => {
                    if (docId) {
                        unsubscribeMessages = dbListener(docId)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            props.set_banner('Unable to identify the target user.', 'error')
            props.navigation.goBack()
        }

        return () => {
            unsubscribeMessages && unsubscribeMessages()
        };
    }, [props.route.params, targetChatDocId])

    const handleSentMessage = () => {

        if (messageTxt.length < 1) return props.set_banner('empty', 'error')

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
            recentUid: props.user.uid
        }
        var newChatId: string;

        if (targetChatDocId) {
            //listener was set so targetChatDocId
            chatRef = fireDb.collection(ChatDb).doc(targetChatDocId);
        } else if (props.route.params.targetUser) {
            //listener or targetChatDocId 
            chatRef = fireDb.collection(ChatDb).doc();

            const { targetUser } = props.route.params;

            chatObj.dateCreated = new Date();
            chatObj.usersInfo = [{ username: targetUser.username, uid: targetUser.uid }, { username: props.user.username, uid: props.user.uid }]

            //set new targetChatDocId and this will eventually set the listener
            newChatId = chatRef.id;
        } else {
            //fail
            return props.set_banner("Oops! Wasn't able to find user information", 'error');
        }

        batch.set(chatRef, chatObj, { merge: true })

        var newMsgRef = chatRef.collection(ChatMessageDb).doc();

        batch.set(newMsgRef, {
            sentBy: props.user.uid,
            sentAt: new Date(),
            message: messageTxt
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
                props.set_banner("Sorry, wasn't able to send your message, please try again.", 'error')
            })
    }


    const TextMsgs = () => {
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
                if (item.sentBy === props.user.uid) {
                    return (
                        <View key={item.docId} style={styles.message_right}>
                            <Text style={styles.message_right_text}>{item.message}</Text>
                        </View>
                    )
                } else {
                    return (
                        <View key={item.docId} style={styles.message_left}>
                            <Text style={styles.message_left_text}>{item.message}</Text>
                        </View>
                    )
                }
            }}
            keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
        />
    }


    return (
        <View style={styles.container}>
            <TextMsgs />
            <KeyboardAvoidingView keyboardVerticalOffset={120} behavior={'padding'} style={styles.message_form}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.message_form_content}>
                        <ScrollView style={styles.message_form_input}>
                            <TextInput
                                style={styles.message_form_input_text}
                                onChangeText={text => setMessageTxt(text)}
                                value={messageTxt}
                                multiline />
                        </ScrollView>
                        <Pressable style={({ pressed }) => pressed ? buttonsStyles.button_white_outline_pressed : buttonsStyles.button_white_outline} onPress={handleSentMessage}
                        >
                            {({ pressed }) => <Text style={pressed ? buttonsStyles.button_white_outline_text_pressed : buttonsStyles.button_white_outline_text}>Send</Text>}
                        </Pressable>
                    </View>
                </ TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    message_form: {
        backgroundColor: colors.secondary
    },
    message_form_content: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: colors.secondary,
        alignItems: 'center'
    },
    message_form_input: {
        flexBasis: '70%',
        borderWidth: 2,
        borderRadius: 20,
        marginRight: 10,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: colors.white,
        borderColor: colors.white,
        maxHeight: 80
    },
    message_form_input_text: {
        color: 'black'
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
        left: -10,
        marginTop: 10,
        marginBottom: 10,
        width: '70%',
        padding: 20,
        paddingLeft: 30,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 20
    },
    message_left_text: {
        color: colors.primary
    },
    message_right: {
        alignSelf: 'flex-end',
        right: -10,
        marginTop: 10,
        marginBottom: 10,
        width: '70%',
        padding: 20,
        paddingRight: 30,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        borderRadius: 20
    },
    message_right_text: {
        color: colors.white
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})
export default connect(mapStateToProps, { set_banner })(Message);