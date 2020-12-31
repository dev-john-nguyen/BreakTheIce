import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../utils/styles';
import { AirplaneSvg, CustomButton } from '../../utils/components';
import { PlaceProp, TimelineLocationProps } from '../../services/profile/tsTypes';

interface TimelineProps {
    timeline: TimelineLocationProps[] | undefined;
    onPlacePress: (placeVisted: TimelineLocationProps) => void;
    auth: boolean;
    redirectNewLocation: () => void;
}

const Timeline = (props: TimelineProps) => {
    return (
        <View style={styles.timeline_section}>
            <Text style={styles.timeline_header}>Where I've Been</Text>
            <View>
                <Pressable
                    style={({ pressed }) => [pressed ? styles.timeline_list_item_pressed : styles.timeline_list_item, { alignSelf: 'flex-start' }]}
                    onPress={props.redirectNewLocation}
                >
                    <View style={styles.timeline_list_header_container}>
                        <Text style={styles.timeline_list_header}>Add Location</Text>
                    </View>
                    <AirplaneSvg styles={styles.airplaneLeft} />
                </Pressable>
            </View>
            {props.timeline && <FlatList
                data={props.timeline}
                style={styles.timeline_list_container}
                keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
                renderItem={({ item, index }) => {
                    var itemLeft = false;
                    if (index % 2 != 0) itemLeft = true;

                    return <Pressable
                        key={item.docId}
                        style={({ pressed }) => [pressed ? styles.timeline_list_item_pressed : styles.timeline_list_item, { alignSelf: itemLeft ? 'flex-start' : 'flex-end' }]}
                        onPress={() => {
                            props.onPlacePress(item)
                        }}
                    >
                        <View style={styles.timeline_list_header_container}>
                            <Text style={styles.timeline_list_header}>{`${item.city}, ${item.state ? item.state : item.country}`}</Text>
                        </View>
                        <Text style={styles.timline_list_body}>{item.comment}</Text>
                        <AirplaneSvg styles={itemLeft ? styles.airplaneLeft : styles.airplaneRight} />
                    </Pressable>
                }}
            />}
        </View>
    )
}

const styles = StyleSheet.create({
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

export default Timeline