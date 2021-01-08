import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg } from '../../utils/svgs';
import { colors, buttonsStyles } from '../../utils/styles';
import { MeStackNavigationProp } from '../navigation/utils';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { set_error } from '../../services/utils/actions';
import { UtilsDispatchActionProps } from '../../services/utils/tsTypes';
import Gallery from '../gallery';

interface MeProps {
    navigation: MeStackNavigationProp;
    user: RootProps['user'];
    set_error: UtilsDispatchActionProps['set_error'];
}

const Me = ({ navigation, user, set_error }: MeProps) => {

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
                        {baseText(user.name, { fontSize: 24 })}
                        {baseText(`${user.age} years old`, { fontSize: 14 })}
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
                {baseText(user.bioLong, { fontSize: 12 })}
            </View>
            <Gallery gallery={user.gallery} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: 0,
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

    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect(mapStateToProps, { set_error, })(Me);