import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { colors, normalize } from '../utils/styles';
import { UnderlineHeader, HeaderText } from '../utils';
import LoginForm from './components/LoginForm';
import { LinearGradient } from 'expo-linear-gradient';


export default () => {
    return (
        <ImageBackground
            source={require('./signinback.png')}
            style={{ flex: 1 }}
        >
            <LinearGradient
                colors={[`rgba(${colors.primary_rgb}, 1)`, 'rgba(0, 0, 0, 0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Image source={require('./icon.png')} style={styles.logo} />
                    <UnderlineHeader
                        textStyle={styles.header_text}
                        height={10}
                        colorFrom={colors.primary}
                        colorTo={colors.white}
                    >LetsLink</UnderlineHeader>
                </View>
                <View style={styles.content}>
                    <HeaderText style={styles.content_header_text}>Sign In</HeaderText>
                    <LoginForm />
                </View>
            </LinearGradient>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    content: {
        height: '50%',
        width: '80%',
        minHeight: 400,
        minWidth: 300,
        borderRadius: 20,
        padding: 30,
        zIndex: 100,
        alignItems: 'center',
    },
    content_header_text: {
        fontSize: normalize(18),
        color: colors.white
    },
    header: {
        alignItems: 'center'
    },
    header_text: {
        alignSelf: 'center',
        fontSize: normalize(22),
        color: colors.white,
        marginTop: 20
    }
})