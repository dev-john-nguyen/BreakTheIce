import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../../utils/styles';
import { connect } from 'react-redux';
import { login_user, signup_user } from '../../services/signin/actions';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import { SigninDispatchActionProps } from '../../services/signin/types';

interface LoginForm {
    login_user: SigninDispatchActionProps['login_user']
    signup_user: SigninDispatchActionProps['signup_user']
}

const Login = ({ login_user, signup_user }: LoginForm) => {

    const [signup, setSignup] = useState<boolean>(false);

    const renderLogin = () => setSignup(false)

    const renderSignup = () => setSignup(true)

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header_text}>Break The Ice</Text>
                {signup ?
                    <SignUpForm signup_user={signup_user} renderLogin={renderLogin} styles={styles} /> :
                    <LoginForm login_user={login_user} renderSignup={renderSignup} styles={styles} />
                }
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
        alignItems: 'stretch'
    },
    header_text: {
        fontSize: 20,
        color: colors.primary,
        letterSpacing: .5,
        fontWeight: '400'
    },
    content: {
        alignSelf: 'center',
        alignItems: 'center',
        width: '80%',
    },
    text_input: {
        alignSelf: 'stretch',
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 5,
        padding: 12,
        fontSize: 12,
        marginTop: 20
    },
    activity_container: {
        backgroundColor: colors.primary,
        alignSelf: 'stretch'
    }
})

export default connect(null, { login_user, signup_user })(Login)