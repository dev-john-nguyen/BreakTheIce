import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { GalleryItemProps } from '../../services/user/types';
import { colors, dropShadow, normalize } from '../utils/styles';
import Card from './components/Card';
import Empty from '../utils/components/Empty';
import { cloneDeepWith } from 'lodash'
import { windowWidth, windowHeight } from '../../utils/variables';
import { getGalleryHeight, ImageWidth } from './utils';

interface GalleryComProps {
    gallery: GalleryItemProps[];
    height: number
}


export default ({ gallery, height }: GalleryComProps) => {
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

    if (!gallery || gallery.length < 1) return (
        <View style={[{
            flexBasis: height,
            width: ImageWidth
        },
            dropShadow,
        styles.empty
        ]}>
            <Empty>No Images</Empty>
        </View>
    )


    return (
        <View style={[styles.container, { flexBasis: height }]}>
            {gallery.map((item, index) => {

                var uri: string = item.cachedUrl ? item.cachedUrl : item.url

                return <Card
                    item={item}
                    index={index}
                    key={item.id}
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
    empty: {
        backgroundColor: colors.secondary,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 10
    },
    container: {
        position: 'relative',
        alignItems: 'center',
        marginTop: 10
    },
    underline_header_underline: {
        backgroundColor: colors.secondary
    },
})

