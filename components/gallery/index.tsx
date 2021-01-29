import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GalleryItemProps } from '../../services/user/types';
import { colors } from '../utils/styles';
import Card from './components/Card';
import Empty from '../utils/components/Empty';

interface GalleryComProps {
    gallery: GalleryItemProps[];
}


export default ({ gallery }: GalleryComProps) => {
    if (!gallery.length) return (
        <View style={styles.container}>
            <Empty style={{ marginTop: 20 }}>No Images</Empty>
        </View>
    )


    return (
        <View style={styles.container}>
            {gallery.map((item, index) => {

                var uri: string = item.cachedUrl ? item.cachedUrl : item.url

                return <Card
                    item={item}
                    index={index}
                    key={index}
                    uri={uri}
                />
            })}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    underline_header_text: {
        color: colors.primary,
        fontSize: 24
    },
    underline_header_underline: {
        backgroundColor: colors.secondary
    },
})

