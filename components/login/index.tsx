import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { baseStyles } from '../../utils/styles';
import firebase from 'firebase';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [signup, setSignup] = useState<boolean>(false);

    const handleSignUp = () => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {

            })
            .catch((error: any) => {
                console.log(error)
                var errorCode = error.code;
                var errorMessage = error.message;
            });
    }

    const handleLogin = () => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch((error: any) => {
                console.log(error)
                var errorCode = error.code;
                var errorMessage = error.message;
            })
    }

    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}>Welcome To LetsLink</Text>
            <TextInput
                style={baseStyles.input}
                placeholder="email"
                textContentType="emailAddress"
                onChangeText={(text) => setEmail(text)}
                autoCompleteType='off'
                autoCapitalize='none'
            />
            <TextInput
                style={baseStyles.input}
                placeholder="password"
                onChangeText={(text) => setPassword(text)}
                onSubmitEditing={signup ? handleSignUp : handleLogin}
                autoCompleteType='password'
                autoCapitalize='none'
                secureTextEntry
            />
            <Pressable style={baseStyles.button} onPress={signup ? handleSignUp : handleLogin}>
                <Text>
                    {signup ? 'Sign Up' : 'Login'}
                </Text>
            </Pressable>
            <Pressable onPress={() => setSignup(signup ? false : true)}>
                <Text style={{ textAlign: 'center' }}>{signup ? 'Login' : 'Sign Up'}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        margin: 10,
        alignItems: 'stretch'
    },
})

export default Login;