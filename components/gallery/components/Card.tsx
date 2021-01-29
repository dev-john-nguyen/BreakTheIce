
import React, { useRef } from 'react';
import { View, Animated, PanResponder, StyleSheet } from 'react-native';
import { windowWidth } from '../../../utils/variables';
import { GalleryItemProps } from '../../../services/user/types';
import { BodyText } from '../../utils';
import { colors, drop_shadow, opacity_colors } from '../../utils/styles';
import { PinchGestureHandler, PinchGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';

interface CardProps {
    item: GalleryItemProps;
    index: number;
    uri: string;
}

export default ({ item, index, uri }: CardProps) => {
    const pan: any = useRef(new Animated.ValueXY()).current;
    const cardIndex: any = useRef(new Animated.Value(index)).current;
    const textOpacity: Animated.Value = useRef(new Animated.Value(0)).current;
    const baseScale = new Animated.Value(1);
    const pinchScale: Animated.Value = useRef(new Animated.Value(1)).current;
    const scale = Animated.multiply(baseScale, pinchScale)

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

    const onPinchGestureEvent = Animated.event(
        [{ nativeEvent: { scale: pinchScale } }],
        { useNativeDriver: true }
    )

    const onPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
        hideText()

        if (event.nativeEvent.oldState === State.ACTIVE) {
            pinchScale.setValue(1)
            Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
            }).start();
        }
    }

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
                drop_shadow,
                {
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                    zIndex: cardIndex
                }
            ]
            }
            onTouchStart={showText}
            onTouchEnd={hideText}

        >
            <PinchGestureHandler
                onGestureEvent={onPinchGestureEvent}
                onHandlerStateChange={onPinchHandlerStateChange}
            >
                <Animated.View style={styles.content_container} collapsable={false}>
                    <Animated.Image
                        source={{ uri, cache: 'force-cache' }}
                        style={[styles.image,
                        {
                            transform: [{ scale: scale }]
                        }
                        ]}
                    />
                    {!!item.description &&
                        <Animated.View style={[styles.text_container, drop_shadow, { opacity: textOpacity }]}>
                            <BlurView style={styles.text_blur} intensity={70}>
                                <View style={styles.text_content} >
                                    <BodyText style={styles.text}>{item.description}</BodyText>
                                </View>
                            </BlurView>
                        </Animated.View>
                    }
                </Animated.View>

            </PinchGestureHandler>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        marginRight: 40,
        marginLeft: 40,
        borderRadius: 5
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
    text_blur: {
        flex: 1,
        marginBottom: 20
    },
    text_content: {
        flex: 1,
        padding: 20,
        backgroundColor: opacity_colors.secondary_medium
    },
    text: {
        color: colors.white,
        fontSize: 14
    }
})

