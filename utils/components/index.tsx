import React from 'react';
import { View, Pressable, StyleProp, StyleSheet, Text, ActivityIndicator, Keyboard } from 'react-native';
import { button_styles, underline_header_styles } from '../styles';
import { Feather } from '@expo/vector-icons';
import { useFonts, Rubik_500Medium } from '@expo-google-fonts/rubik';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { TextInput } from 'react-native-gesture-handler';

export const Icon = ({ type, size, color, pressColor, onPress, style }: { type: string, size: number, color: string, pressColor?: string, onPress?: () => void, style?: StyleProp<any> }) => (
    <Pressable onPress={onPress} style={style}>
        {({ pressed }) => <Feather name={type} size={size} color={pressed ? pressColor : color} />}
    </Pressable>
)

interface CustomButtonProps {
    text: string;
    onPress?: () => void;
    type: "primary" | "secondary" | "white_outline" | "red_outline" | "disabled" | "red" | "white";
    moreStyles?: StyleProp<any>;
    indicatorColor?: string | false;
    size?: 'small' | 'regular';
    disabled?: boolean
}

//buttons
export const CustomButton = ({ text, onPress, type, moreStyles, indicatorColor, size, disabled }: CustomButtonProps) => {

    const { pressed, unpressed } = button_styles(size, type)

    const handlePressableStyle = (props: { pressed: boolean }) => [props.pressed ? pressed.button : unpressed.button, moreStyles]

    return <Pressable
        disabled={disabled ? disabled : indicatorColor ? true : false}
        onPress={onPress}
        style={handlePressableStyle}
    >
        {(props) => (
            <View style={{ flexDirection: 'row' }}>
                {indicatorColor ? <ActivityIndicator size='small' color={indicatorColor} /> : <BodyText text={text} styles={props.pressed ? pressed.text : unpressed.text} />}
            </View>
        )}
    </Pressable>
}

export const UnderlineHeader = ({ text, styles }: { text: string, styles?: StyleProp<any> }) => (
    <View style={[underline_header_styles.section, styles]}>
        <View style={underline_header_styles.container}>
            <HeaderText styles={underline_header_styles.text} text={text} />
            <View style={underline_header_styles.underline} />
        </View>
    </View>
)

export const BodyText = ({ styles, text }: { styles?: StyleProp<any>, text: string }) => {
    let [fontsLoaded] = useFonts({
        Roboto_400Regular
    });

    if (!fontsLoaded) {
        return <ActivityIndicator />;
    }

    return <Text style={[{ fontFamily: 'Roboto_400Regular' }, text_styles.body, styles]}>{text}</Text>;

}

export const HeaderText = ({ styles, text }: { styles?: StyleProp<any>, text: string }) => {
    let [fontsLoaded] = useFonts({
        Rubik_500Medium
    });

    if (!fontsLoaded) {
        return <ActivityIndicator />;
    }

    return <Text style={[{ fontFamily: 'Rubik_500Medium' }, text_styles.header, styles]}>{text}</Text>;
}

interface CustomInput {
    styles?: StyleProp<any>;
    placeholder: string;
    multiline?: boolean;
    maxLength: number;
    value: string;
    onChangeText: (text: string) => void,
    keyboardType?: 'numeric';
    textContentType?: 'name'
    autoCapitalize?: 'none'
}

export const CustomInput = ({ styles, placeholder, multiline, maxLength, value, onChangeText, keyboardType, textContentType, autoCapitalize }: CustomInput) => {
    let [fontsLoaded] = useFonts({
        Rubik_500Medium
    });

    if (!fontsLoaded) {
        return <ActivityIndicator />;
    }

    return <TextInput
        style={[styles, text_styles.input, { fontFamily: 'Rubik_500Medium' }]}
        placeholder={placeholder}
        multiline={multiline}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoCapitalize={autoCapitalize}
    />
}

const text_styles = StyleSheet.create({
    body: {
        letterSpacing: .2,
    },
    header: {
        letterSpacing: .5
    },
    input: {
        padding: 10,
        letterSpacing: .2
    }
})

