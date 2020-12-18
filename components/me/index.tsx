import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg, closeSvg } from '../../utils/svgs';
import { colors, buttonsStyles } from '../../utils/styles';
import { MeStackNavigationProp } from '../navigation/utils';
import { connect } from 'react-redux';
import { RootProps } from '../../services';

const Me = ({ navigation, user }: { navigation: MeStackNavigationProp, user: RootProps['user'] }) => {
    const testUser = {
        age: 23,
        name: 'John Nguyen',
        bioLong: `The ambitious, 13-minute "You Rock My World" short film features guest appearances from Chris Tucker, Michael Madsen, and Marlon Brando (in one of his final film appearances). All night dance with you. The magic that must be love. When you feel that beat you must ride the boogy. I wanna rock with you.`
    }

    const baseText = (text: string | number, additionalStyle: Object) => (
        <Text style={[styles.base_text, additionalStyle]}>
            {text}
        </Text>
    )
    return (
        <View style={styles.container}>
            <View style={styles.header_section}>
                <SvgXml xml={userDefaultSvg} width='100' height='100' fill={colors.primary} />
                <View style={styles.header_content}>
                    <View style={styles.header_content_text}>
                        {baseText(testUser.name, { fontSize: 24 })}
                        {baseText(`${testUser.age} years old`, { fontSize: 14 })}
                    </View>
                    <Pressable onPress={() => navigation.push('Friends')}
                        style={({ pressed }) => (
                            pressed ? buttonsStyles.button_primary_pressed : buttonsStyles.button_primary
                        )}
                    >
                        <Text style={buttonsStyles.button_primary_text}>Friends</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.bio}>
                {baseText(testUser.bioLong, { fontSize: 12 })}
            </View>
            <View style={styles.timeline}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 10
    },
    base_text: {
        color: colors.primary,
        fontWeight: '400'
    },
    header_section: {
        flexBasis: 'auto',
        alignItems: "center",
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '20%'
    },
    header_content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    header_content_text: {
        marginBottom: 10,
        alignItems: 'center'
    },
    bio: {
        flexBasis: 'auto',
        padding: 20,
    },
    bioText: {
        fontSize: 12
    },
    timeline: {
        flex: 1,
        padding: 20,
        backgroundColor: 'orange',
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect()(Me);