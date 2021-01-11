import React, { useRef } from "react";
import { Animated, View, StyleSheet, PanResponder, Text } from "react-native";

const App = () => {
    const finalPosition = { toValue: { x: 0, y: 173.99998474121094 }, useNativeDriver: false }

    // const squareArea = 
    const pan = useRef(new Animated.ValueXY()).current;

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
            onPanResponderRelease: (evt, gestureState) => {
                console.log(pan.x, pan.y)
                pan.setOffset({
                    x: pan.x._value,
                    y: 29
                });

                // //get area
                // var panArea = parseInt(pan.x.toString()) * parseInt(pan.y.toString())


                // console.log('finished')

                // Animated.spring({ x: x0, y: y0 } , { useNativeDriver : false }).start()
            }
        })
    ).current;

    console.log(pan.x, pan.y)

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Drag this box!</Text>
            <Animated.View
                style={{
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                    zIndex: 100
                }}
                {...panResponder.panHandlers}
            >
                <View style={styles.box} />
            </Animated.View>
            <View style={{ width: 2, height: 1, borderColor: 'black', borderWidth: 2, backgroundColor: 'black' }}
                ref={(view) => view?.measure((fx, fy, width, height, px, py) => {
                    console.log(px, py)
                })}
                onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    console.log('height:', layout.height);
                    console.log('width:', layout.width);
                    console.log('x:', layout.x);
                    console.log('y:', layout.y);
                    console.log(layout.y - 50)
                }}
            >

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleText: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: "bold"
    },
    box: {
        height: 5,
        width: 150,
        backgroundColor: "blue",
        borderRadius: 5
    }
});

export default App;