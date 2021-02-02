import React, { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { GalleryItemProps } from '../../services/user/types';
import { colors } from '../utils/styles';
import Card from './components/Card';
import Empty from '../utils/components/Empty';
import { cloneDeepWith } from 'lodash'

interface GalleryComProps {
    gallery: GalleryItemProps[];
}


export default ({ gallery }: GalleryComProps) => {
    if (!gallery || !gallery.length) return (
        <View style={styles.container}>
            <Empty style={{ marginTop: 20 }}>No Images</Empty>
        </View>
    )

    const animatedValues = gallery.map((gal, index) => new Animated.Value(index * 15))
    const animatedPad = gallery.map((gal, index) => new Animated.Value(index * 5))

    const topRef = useRef(animatedValues).current
    const padRef = useRef(animatedPad.reverse()).current

    const handleUpdateAnimatedRef = (clonedTopRef: number[]) => {

        clonedTopRef.push(clonedTopRef.shift() as number);

        topRef.forEach((top, i) => {
            top.setValue(clonedTopRef[i])
        })


        var clonePadRef: any = cloneDeepWith(padRef, (pad) => {
            return pad._value
        })

        clonePadRef.push(clonePadRef.shift() as number);

        padRef.forEach((pad, i) => {
            pad.setValue(clonePadRef[i])
        })

    }

    return (
        <View style={styles.container}>
            {gallery.map((item, index) => {

                var uri: string = item.cachedUrl ? item.cachedUrl : item.url

                return <Card
                    item={item}
                    index={index}
                    key={index}
                    uri={uri}
                    topRef={topRef}
                    handleUpdateAnimatedRef={handleUpdateAnimatedRef}
                    galleryLen={gallery.length}
                    padRef={padRef}
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

