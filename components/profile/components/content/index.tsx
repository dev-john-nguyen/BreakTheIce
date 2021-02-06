import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { TopProfileBackground } from '../../../utils/svgs';
import { windowWidth } from '../../../../utils/variables';
import Profile, { ProfileComProps } from './components/Profile';
import Interview, { InterviewComProps } from './components/Interview';

interface ContentProps extends Omit<ProfileComProps, 'showInterview' | 'user'> {
    user: ProfileComProps['user'] & { interview: InterviewComProps['interview'] }
}

export default ({ user, directToMessage, directToFriends, admin, showInviteModal, showRespondModal }: ContentProps) => {
    const profileAdmin = useRef(new Animated.Value(0)).current
    const interviewAdmin = useRef(new Animated.Value(0)).current


    const showInterview = () => {
        Animated.sequence([
            Animated.timing(profileAdmin, {
                duration: 500,
                toValue: 1,
                useNativeDriver: false
            }),
            // Animated.timing(interviewAdmin, {
            //     delay: 100,
            //     duration: 500,
            //     toValue: 1,
            //     useNativeDriver: false
            // })
        ]).start()
    }

    const showProfile = () => {
        Animated.sequence([
            // Animated.timing(interviewAdmin, {
            //     duration: 500,
            //     toValue: 2,
            //     useNativeDriver: false
            // }),
            Animated.timing(profileAdmin, {
                delay: 100,
                duration: 500,
                toValue: 2,
                useNativeDriver: false
            })
        ]).start(() => {
            profileAdmin.setValue(0)
            // interviewAdmin.setValue(0)
        })

    }

    return (
        <>
            <TopProfileBackground style={styles.header_background} height={'14%'} width={windowWidth.toString()} />
            <Animated.View style={{
                flex: 1, flexDirection: 'row',
                right: profileAdmin.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, windowWidth, 0]
                })
            }}>
                <View style={styles.container}>
                    <Profile
                        user={user}
                        showRespondModal={showRespondModal}
                        showInviteModal={showInviteModal}
                        showInterview={showInterview}
                        admin={admin}
                        directToMessage={directToMessage}
                        directToFriends={directToFriends}
                    />
                </View>
                <View style={styles.container}>
                    <Interview
                        showProfile={showProfile}
                        interview={user.interview}
                    />
                </View>
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        position: 'relative',
        height: '100%',
        width: '100%'
    },
    header_background: {
        top: -5,
        left: 0
    }
})