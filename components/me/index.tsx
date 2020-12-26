import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg, closeSvg } from '../../utils/svgs';
import { colors, buttonsStyles } from '../../utils/styles';
import { MeStackNavigationProp } from '../navigation/utils';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { AirplaneSvg } from '../../utils/components';
import { PlaceProp } from '../placesvisted/utils';
const Me = ({ navigation, user }: { navigation: MeStackNavigationProp, user: RootProps['user'] }) => {
    const testUser = {
        age: 23,
        name: 'John Nguyen',
        bioLong: `The ambitious, 13-minute "You Rock My World" short film features guest appearances from Chris Tucker, Michael Madsen, and Marlon Brando (in one of his final film appearances). All night dance with you. The magic that must be love. When you feel that beat you must ride the boogy. I wanna rock with you.`
    }

    const exLocationHistory = [
        {
            docId: '1',
            country: 'USA',
            city: 'Bellevue',
            state: 'Washington',
            bio: 'I live here',
            fromDate: new Date('12/20/2017'),
            toDate: new Date('12/20/2018'),
            createdAt: new Date(),
            updatedAt: new Date(),
            placesVisted: [
                {
                    docId: '1',
                    coordinate: {
                        latitude: 47.59015499248588,
                        longitude: -122.146
                    },
                    name: 'My Home',
                    comment: "I'll be moving soon"
                },
                {
                    docId: '2',
                    coordinate: {
                        latitude: 47.62370846178976,
                        longitude: -122.16476331523303
                    },
                    name: 'International Ballet Academy',
                    comment: 'I come here to workout ands a great place'
                }
            ]
        },
    ]

    const onPlacePress = (placesVisted: PlaceProp[]) => {
        navigation.push('PlacesVisted', { placesVisted })
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
            <View style={styles.timeline_section}>
                <Text style={styles.timeline_header}>Where I've Been</Text>
                {exLocationHistory ? <FlatList
                    data={exLocationHistory}
                    style={styles.timeline_list_container}
                    keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
                    renderItem={({ item, index }) => {
                        var itemLeft = false;
                        if (index % 2 == 0) itemLeft = true;

                        return <Pressable
                            style={({ pressed }) => [pressed ? styles.timeline_list_item_pressed : styles.timeline_list_item, { alignSelf: itemLeft ? 'flex-start' : 'flex-end' }]}
                            onPress={() => onPlacePress(item.placesVisted)}
                        >
                            <View style={styles.timeline_list_header_container}>
                                <Text style={styles.timeline_list_header}>{`${item.city}, ${item.state ? item.state : item.country}`}</Text>
                            </View>
                            <Text style={styles.timline_list_body}>{item.bio}</Text>
                            <AirplaneSvg styles={itemLeft ? styles.airplaneLeft : styles.airplaneRight} />
                        </Pressable>
                    }}
                /> : <View>No Locations</View>}
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
    timeline_section: {
        flex: 1,
        padding: 10,
    },
    timeline_header: {
        alignSelf: 'center',
        fontSize: 16,
        color: colors.primary
    },
    timeline_list_container: {
        flex: 1,
        marginTop: 20,
        position: 'relative'
    },
    timeline_list_item: {
        flexDirection: 'column',
        padding: 10,
        width: '50%',
        minHeight: 100,
    },
    timeline_list_item_pressed: {
        flexDirection: 'column',
        padding: 10,
        width: '50%',
        minHeight: 100,
        backgroundColor: colors.secondary,
        borderRadius: 10
    },
    timeline_list_header_container: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        marginBottom: 10
    },
    timeline_list_header: {
        color: colors.primary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10
    },
    timline_list_body: {
        color: colors.primary,
        fontSize: 10,
        textAlign: 'center'
    },
    airplaneLeft: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        transform: [{ rotate: '90deg' }]
    },
    airplaneRight: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        transform: [{ rotate: '180deg' }]
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect()(Me);