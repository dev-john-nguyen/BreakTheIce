
import React, { useRef } from 'react';
import { View, Image, Animated, PanResponder, StyleSheet, Pressable } from 'react-native';
import { windowWidth } from '../../../utils/variables';
import { GalleryItemProps } from '../../../services/user/types';
import { BodyText } from '../../../utils/components';
import { colors } from '../../../utils/styles';

interface CardProps {
    item: GalleryItemProps;
    index: number;
    uri: string;
}

export default ({ item, index, uri }: CardProps) => {
    const pan: any = useRef(new Animated.ValueXY()).current;
    const cardIndex: any = useRef(new Animated.Value(index)).current;
    const textOpacity: Animated.Value = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value
                });
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    { dx: pan.x, dy: pan.y }
                ],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (event, gestureState) => {
                if (pan.x._value > 120 || pan.x._value < -120) {

                    Animated.spring(pan, {
                        toValue: {
                            x: pan.x._value < 0 ? -windowWidth : windowWidth,
                            y: pan.y._value
                        },
                        velocity: gestureState.vx,
                        useNativeDriver: false
                    }).start()

                    Animated.spring(pan, {
                        toValue: {
                            x: 0,
                            y: 0
                        },
                        velocity: gestureState.vx,
                        useNativeDriver: false
                    }).start()

                    cardIndex.setValue(cardIndex._value - 3)

                } else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                }
            }
        })
    ).current;

    const showText = () => {
        Animated.timing(textOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    const hideText = () => {
        Animated.timing(textOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    return (
        <Animated.View
            key={index}
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                    zIndex: cardIndex
                }
            ]
            }
            onTouchStart={showText}
            onTouchEnd={hideText}

        >
            <View style={styles.content_container}>
                <Image source={{ uri, cache: 'force-cache' }} style={styles.image} />
                <Animated.View style={[styles.text_container, { opacity: textOpacity }]}>
                    <View style={styles.text_content}>
                        <BodyText text={item.description} styles={styles.text} />
                    </View>
                </Animated.View>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        marginRight: 40,
        marginLeft: 40,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    content_container: {
        position: 'relative'
    },
    image: {
        width: '100%',
        aspectRatio: 3.2 / 4,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2
    },
    text_container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    text_content: {
        backgroundColor: `rgba(${colors.secondary_rgb}, .9)`,
        borderColor: colors.primary,
        borderWidth: 1,
        padding: 20,
        margin: 10,
        borderRadius: 5
    },
    text: {
        color: colors.white,
        fontSize: 12
    }
})

