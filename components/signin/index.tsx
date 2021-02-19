import React, { useState, useRef } from 'react';
import { View, StyleSheet, ImageBackground, Animated } from 'react-native';
import { Item1, Item2, Item3, Item4 } from './svg';
import { colors, normalize, dropShadow } from '../utils/styles';
import { UnderlineHeader, CustomButton, Icon } from '../utils';
import LoginForm from './components/LoginForm';


export default () => {
    const [signIn, setSignIn] = useState('');
    const fadeAdmin = useRef(new Animated.Value(0)).current

    const handleLogin = () => {
        Animated.timing(fadeAdmin, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            setSignIn('')
        })
    }

    const handleShow = (type: string) => {
        setSignIn(type)
        Animated.timing(fadeAdmin, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    const renderLogin = () => (
        <Animated.View style={[styles.modal, {
            opacity: fadeAdmin
        }]}>
            <View style={[styles.modal_content, dropShadow]}>
                <UnderlineHeader
                    textStyle={styles.modal_header}
                    height={10}
                    colorFrom={colors.secondary}
                    colorTo={colors.tertiary}
                >{signIn}</UnderlineHeader>
                <LoginForm />
                <Icon type='x' size={15} color={colors.black} style={{ position: 'absolute', right: 10, top: 10 }} onPress={handleLogin} />
            </View>
        </Animated.View>
    )

    return (
        <View style={styles.container}>
            {!!signIn && renderLogin()}
            <ImageBackground
                source={require('./header-image.jpg')}
                style={{
                    flex: .8,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >

                <UnderlineHeader
                    textStyle={styles.header}
                    height={12}
                    colorFrom={colors.primary}
                    colorTo={colors.tertiary}
                >LetsLink</UnderlineHeader>
            </ImageBackground>

            <View style={{ flex: 1 }}>
                <View style={styles.section}>
                    <View style={{ flex: 1 }}>
                        <Item1 />
                    </View>
                    <View style={{ flex: 1 }} />
                </View>
                <View style={styles.section}>
                    <View style={styles.button_container}>
                        <View>
                            <CustomButton type='primary' text='Login' onPress={() => handleShow('Login')} />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Item2 />
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={{ flex: 1 }}>
                        <Item3 />
                    </View>
                    <View style={styles.button_container}>
                        <View>
                            <CustomButton type='secondary' text='Sign Up' onPress={() => handleShow('Sign Up')} />
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 1 }}>
                        <Item4 />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        zIndex: 0
    },
    header: {
        alignSelf: 'center',
        fontSize: normalize(25),
        color: colors.white
    },
    section: {
        flexDirection: 'row',
        flex: 1,
        margin: 10
    },
    button_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        paddingTop: 100,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10
    },
    modal_content: {
        backgroundColor: colors.white,
        height: '50%',
        width: '80%',
        minHeight: 400,
        minWidth: 300,
        borderRadius: 20,
        padding: 30,
        zIndex: 100
    },
    modal_header: {
        alignSelf: 'center',
        fontSize: normalize(20),
        color: colors.primary
    }
})