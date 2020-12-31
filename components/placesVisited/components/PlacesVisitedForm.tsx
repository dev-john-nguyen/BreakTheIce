import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, StyleProp } from 'react-native';
import { PlaceProp } from '../../../services/profile/tsTypes';
import { colors } from '../../../utils/styles';
import { CustomButton } from '../../../utils/components';


interface PlacesVisitedForm {
    newPlaceVisited: PlaceProp;
    setNewPlaceVisited: (newPlace: PlaceProp) => void;
    handleSaveNewPlaceVisited: () => void;
    handleClose: () => void;
    styles: StyleProp<any>;
}

export default (props: PlacesVisitedForm) => {
    return (
        <>
            <Text style={props.styles.new_place_header_text}>New Place</Text>
            <TextInput placeholder='name'
                placeholderTextColor={colors.white}
                value={props.newPlaceVisited.name}
                onChangeText={text => {
                    props.newPlaceVisited.name = text
                    props.setNewPlaceVisited({ ...props.newPlaceVisited })
                }}
                style={[props.styles.text_input, { fontSize: 14 }]}
            />
            <TextInput
                multiline={true}
                numberOfLines={2}
                maxLength={100}
                placeholder='comment'
                placeholderTextColor={colors.white}
                value={props.newPlaceVisited.comment}
                onChangeText={text => {
                    props.newPlaceVisited.comment = text
                    props.setNewPlaceVisited({ ...props.newPlaceVisited })
                }}
                style={[props.styles.text_input, { fontSize: 12 }]}
            />
            <View style={props.styles.button_section}>
                <CustomButton type={'primary'} text="Create" onPress={props.handleSaveNewPlaceVisited} />
                <CustomButton type={'white_outline'} text="Cancel" onPress={props.handleClose} />
            </View>
        </>
    )

}