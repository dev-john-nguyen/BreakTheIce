import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import Timeline from '../timeline';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg } from '../../utils/svgs';
import { colors, buttonsStyles } from '../../utils/styles';
import { MeStackNavigationProp } from '../navigation/utils';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { TimelineLocationProps } from '../../services/profile/tsTypes';
import { set_timeline } from '../../services/profile/actions';
import { TimelineDispatchActionProps } from '../../services/profile/tsTypes';
import { set_error } from '../../services/utils/actions';
import { UtilsDispatchActionProps } from '../../services/utils/tsTypes';

interface MeProps {
    navigation: MeStackNavigationProp;
    user: RootProps['user'];
    set_timeline: TimelineDispatchActionProps['set_timeline'];
    set_error: UtilsDispatchActionProps['set_error'];
}

const Me = ({ navigation, user, set_timeline, set_error }: MeProps) => {

    useEffect(() => {
        !user.timeline && set_timeline(user.uid)
    }, [])

    const onPlacePress = (location: TimelineLocationProps) => {
        if (location.placesVisited) {
            navigation.push('PlacesVisited',
                {
                    placesVisited: location.placesVisited,
                    locationDocId: location.docId,
                    uid: user.uid,
                    title: location.city
                })
        } else {
            set_error("No locations have been saved for this location", "warning")
        }
    }

    const redirectNewLocation = () => {
        navigation.push('NewLocation');
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
            <Timeline
                timeline={user.timeline}
                onPlacePress={onPlacePress}
                auth={true}
                redirectNewLocation={redirectNewLocation}
            />
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
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect(mapStateToProps, { set_timeline, set_error, })(Me);