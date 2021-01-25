import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { GalleryItemProps } from '../../services/user/types';
import { colors } from '../../utils/styles';
import { BodyText } from '../../utils/components';
import Card from './components/Card';

interface GalleryComProps {
    gallery: GalleryItemProps[];
    nearByUser?: true
}


export default ({ gallery, nearByUser }: GalleryComProps) => {
    return (
        <View style={styles.container}>
            {gallery.reverse().map((item, index) => {

                var uri: string = '';

                if (nearByUser) {
                    const { url, nearUserUri } = gallery[index];
                    uri = nearUserUri ? nearUserUri : url

                } else {
                    const { cachedUrl, url } = gallery[index]
                    uri = cachedUrl ? cachedUrl : url
                }

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

