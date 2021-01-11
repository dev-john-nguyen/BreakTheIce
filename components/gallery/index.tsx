import React, { useEffect } from 'react';
import { FlatList, View, StyleSheet, Image, ListRenderItemInfo, Text } from 'react-native';
import { GalleryItemProps } from '../../services/user/tsTypes';
import { colors } from '../../utils/styles';
import { cacheImage } from '../../utils/functions';
import _ from 'lodash';
import { NearByUsersProps } from '../../services/near_users/tsTypes';

interface GalleryComProps {
    gallery: (GalleryItemProps & { nearbyUserCachedUrl?: string | void | undefined })[]
    nearByUser?: true
}

export default ({ gallery, nearByUser }: GalleryComProps) => {

    const renderItem = ({ item, index }: ListRenderItemInfo<GalleryItemProps>) => {
        var uri: string = '';
        if (nearByUser) {
            const { nearbyUserCachedUrl, url } = gallery[index];
            uri = nearbyUserCachedUrl ? nearbyUserCachedUrl : url

        } else {
            const { cachedUrl, url } = gallery[index]
            uri = cachedUrl ? cachedUrl : url
        }

        return <View style={[styles.gallery_container, index > 0 ? { margin: 30 } : { marginTop: 0, margin: 30 }]}>
            <Image source={{ uri, cache: 'force-cache' }} style={styles.gallery_image} />
            <View style={styles.gallery_text_container}>
                <Text style={styles.gallery_text}>{item.description}</Text>
            </View>
        </View>
    }

    return <FlatList
        style={styles.container}
        data={gallery}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? item.id : index.toString()}
    />
}


const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10
    },
    gallery_container: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(40,223,153,.5)',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        backgroundColor: '#eee'
    },
    gallery_image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    gallery_text_container: {
        padding: 10,
        marginTop: 5,
        marginBottom: 5
    },
    gallery_text: {
        color: colors.darkGreen,
        fontSize: 12,
        alignSelf: 'flex-start',
        fontWeight: "400",
        letterSpacing: .5
    }
})

