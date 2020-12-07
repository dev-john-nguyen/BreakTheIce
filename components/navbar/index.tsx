import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { baseStyles } from '../../utils/styles';

const Navbar = () => {
    function handleSignOut() {
        console.log('signing out')
        firebase.auth().signOut()
            .then(user => {
                console.log(user)
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <View style={styles.navbar}>
            <Pressable onPress={handleSignOut} style={baseStyles.button}>
                <Text>SignOut</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        flexBasis: '15%',
        justifyContent: 'center'
    }
})

export default Navbar;