import React from 'react';
import { View, Pressable, StyleProp, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { button_styles, underline_header_styles, drop_shadow_light } from './styles';
import { Feather } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

export const Icon = ({ type, size, color, pressColor, onPress, style }: { type: any, size: number, color: string, pressColor?: string, onPress?: () => void, style?: StyleProp<any> }) => (
    <Pressable onPress={onPress} style={style} hitSlop={10}>
        {({ pressed }) => <Feather name={type} size={size} color={pressed ? pressColor : color} />}
    </Pressable>
)

interface CustomButtonProps {
    text: string;
    onPress?: () => void;
    type: "primary" | "secondary" | "white_outline" | "red_outline" | "disabled" | "red" | "white";
    moreStyles?: StyleProp<any>;
    style?: StyleProp<any>
    indicatorColor?: string | false;
    size?: 'small' | 'regular';
    disabled?: boolean
}

//buttons
export const CustomButton = ({ text, onPress, type, moreStyles, indicatorColor, size, disabled, style }: CustomButtonProps) => {

    const { pressed, unpressed } = button_styles(size, type)

    const handlePressableStyle = (props: { pressed: boolean }) => [props.pressed ? pressed.button : unpressed.button, moreStyles, style, drop_shadow_light]

    return <Pressable
        disabled={disabled ? disabled : indicatorColor ? true : false}
        onPress={onPress}
        style={handlePressableStyle}
    >
        {(props) => (
            <View style={[{ flexDirection: 'row' }]}>
                {indicatorColor ? <ActivityIndicator size='small' color={indicatorColor} /> : <BodyText text={text} style={props.pressed ? pressed.text : unpressed.text} />}
            </View>
        )}
    </Pressable>
}

interface UnderLineHeaderProps {
    textStyle: StyleProp<{ color: string, fontSize: number }>
    style?: StyleProp<any>
    children: StyleProp<any>
}

export const UnderlineHeader = ({ textStyle, style, children }: UnderLineHeaderProps) => (
    <View style={[underline_header_styles.section, style]}>
        <View style={underline_header_styles.container}>
            <HeaderText style={[underline_header_styles.text, textStyle]}>{children}</HeaderText>
            <View style={[underline_header_styles.underline]} />
        </View>
    </View>
)


export const BodyText = ({ style, text, children, numberOfLines }: { style?: StyleProp<any>, text?: string, children?: any, numberOfLines?: number }) => {
    return <Text style={[{ fontFamily: 'Roboto_400Regular' }, text_styles.body, style]} numberOfLines={numberOfLines}>{text ? text : children}</Text>;

}

export const HeaderText = ({ style, children }: { style?: StyleProp<any>, children: string }) => {
    return <Text style={[{ fontFamily: 'Rubik_500Medium' }, text_styles.header, style]}>{children}</Text>;
}

interface CustomInput {
    style?: StyleProp<any>;
    placeholder: string;
    multiline?: boolean;
    maxLength: number;
    value: string;
    onChangeText: (text: string) => void,
    keyboardType?: 'numeric' | "phone-pad";
    textContentType?: 'name' | "telephoneNumber";
    autoCapitalize?: 'none';
    autoCorrect?: boolean;
    autoCompleteType?: "tel"
}

export const CustomInput = ({ style, placeholder, multiline, maxLength, value, onChangeText, keyboardType, textContentType, autoCapitalize, autoCorrect, autoCompleteType }: CustomInput) => {
    return <TextInput
        style={[style, text_styles.input, { fontFamily: 'Roboto_400Regular' }]}
        placeholder={placeholder}
        multiline={multiline}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        autoCompleteType={autoCompleteType}
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
        padding: 12,
        paddingTop: 12,
        letterSpacing: .2,
        fontSize: 12
    }
})

