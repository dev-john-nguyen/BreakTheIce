import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { GalleryItemProps } from '../../services/user/types';
import { colors } from '../../utils/styles';
import { BodyText, UnderlineHeader } from '../../utils/components';
import Card from './components/Card';

interface GalleryComProps {
    gallery: GalleryItemProps[];
}


export default ({ gallery }: GalleryComProps) => {
    if (!gallery.length) return (
        <View style={styles.container}>
            <UnderlineHeader text='No Images' />
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
    }
})

