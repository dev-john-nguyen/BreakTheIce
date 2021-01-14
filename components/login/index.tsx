import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { colors } from '../../utils/styles';
import LoginForm from './components/LoginForm';

const Login = () => {
    return (
        <View style={styles.container}>
            <Text>LetsLink</Text>

            <LoginForm />
            <View>

            </View>
            <View>

            </View>
            <View>

            </View>
            <View>

            </View>
            <View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary
    }
})

export default Login;