import React from 'react';
import { View, Pressable, StyleProp, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { button_styles, underline_header_styles, colors, normalize } from './styles';
import { Feather } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

export const Icon = ({ type, size, color, pressColor, onPress, style, iconStyle }: { type: any, size: number, iconStyle?: StyleProp<any>, color: string, pressColor?: string, onPress?: () => void, style?: StyleProp<any> }) => (
    <Pressable onPress={onPress} style={style} hitSlop={10}>
        {({ pressed }) => <Feather name={type} size={size} color={pressed ? pressColor : color} iconStyle={iconStyle} />}
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

    const { pressed, unpressed, indicator } = button_styles(size, type)

    const handlePressableStyle = (props: { pressed: boolean }) => [props.pressed ? pressed.button : unpressed.button, moreStyles, style]

    return <Pressable
        disabled={disabled ? disabled : indicatorColor ? true : false}
        onPress={onPress}
        style={handlePressableStyle}
    >
        {(props) => (
            <>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.1)']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.shine}>
                    {indicatorColor ? <ActivityIndicator size='small' color={indicatorColor} style={indicator} /> : <BodyText text={text} style={props.pressed ? pressed.text : unpressed.text} />}
                </LinearGradient>
            </>
        )}
    </Pressable>
}

interface UnderLineHeaderProps {
    textStyle: StyleProp<{ color: string, fontSize: number }>
    style?: StyleProp<any>
    children: StyleProp<any>
    height: number;
    colorFrom: string;
    colorTo: string;
}

export const UnderlineHeader = ({ textStyle, style, children, height,
    colorFrom, colorTo }: UnderLineHeaderProps) => (
        <View style={[underline_header_styles.section, style]}>
            <View style={underline_header_styles.container}>
                <HeaderText style={[underline_header_styles.text, textStyle]}>{children}</HeaderText>
                <LinearGradient
                    colors={[colorFrom, colorTo]}
                    style={[underline_header_styles.underline, {
                        height
                    }]}
                    start={{ x: -1, y: 0 }}
                    end={{ x: 2, y: 0 }}
                />
            </View>
        </View>
    )


export const BodyText = ({ style, text, children, numberOfLines }: { style?: StyleProp<any>, text?: string, children?: any, numberOfLines?: number }) => {
    return <Text style={[{ fontFamily: 'Roboto_400Regular' }, styles.body, style]} numberOfLines={numberOfLines}>{text ? text : children}</Text>;

}

export const HeaderText = ({ style, children }: { style?: StyleProp<any>, children: string }) => {
    return <Text style={[{ fontFamily: 'Rubik_500Medium' }, styles.header, style]}>{children}</Text>;
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
    autoCompleteType?: "tel";
    autoFocus?: boolean
    textAlignVertical?: 'top'
}

export const CustomInput = ({ style, placeholder, multiline, maxLength, value, onChangeText, keyboardType, textContentType, autoCapitalize, autoCorrect, autoCompleteType, autoFocus, textAlignVertical }: CustomInput) => {
    return <TextInput
        style={[style, styles.input, { fontFamily: 'Roboto_400Regular' }]}
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
        autoFocus={autoFocus}
        textAlignVertical={textAlignVertical}
    />
}

const styles = StyleSheet.create({
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
        fontSize: normalize(10)
    },
    shine: {
        width: '100%',
        borderRadius: 5,
        flexDirection: 'row',
        alignSelf: 'center',
    }
})

