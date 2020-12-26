import React, { useState, useEffect } from 'react';
import { View, Dimensions, Pressable, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PlaceProp } from './utils';
import { buttonsStyles, colors } from '../../utils/styles';
//set on first location and then go from there

interface PlacesVistedProps {
    navigation: any,
    route: any,
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const PlacesVisted = (props: PlacesVistedProps) => {
    const { placesVisted } = props.route.params;

    const [curPlace, setCurPlace] = useState<number>(0);

    const handleNext = () => {
        if (curPlace < placesVisted.length - 1) {
            setCurPlace(curPlace + 1);
        } else {
            setCurPlace(0)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.content_container}>
                <Text style={styles.content_text_name}>{placesVisted[curPlace].name}</Text>
                <Text style={styles.content_text_comment}>{placesVisted[curPlace].comment}</Text>
            </View>
            <MapView
                style={{ flex: 1 }}
                onPress={(e) => console.log(e.nativeEvent)}
                region={{
                    ...placesVisted[curPlace].coordinate,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }}
            >
                {
                    placesVisted && placesVisted.map((place: PlaceProp) => (
                        <Marker
                            key={place.docId}
                            coordinate={place.coordinate}
                            onPress={(e) => console.log(place)}
                        >

                        </Marker>
                    ))
                }
            </MapView >
            <Pressable onPress={handleNext}
                style={({ pressed }) => pressed ? [styles.listView, buttonsStyles.button_primary_pressed] : [styles.listView, buttonsStyles.button_primary]}>
                <Text style={buttonsStyles.button_primary_text}>Next</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    content_container: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        zIndex: 10,
        padding: 20,
        width: '100%'
    },
    content_text_name: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1
    },
    content_text_comment: {
        color: colors.white,
        fontSize: 12,
        marginTop: 5,
        fontWeight: '500'
    },
    listView: {
        position: 'absolute',
        bottom: 10,
        right: 10
    }
})

export default PlacesVisted;