import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Picker, ScrollView } from 'react-native';
// import { Picker } from '@react-native-picker/picker'
import { connect } from 'react-redux';
import { RootProps } from '../../../services';
import { update_profile } from '../../../services/user/actions';
import { UserDispatchActionsProps } from '../../../services/user/tsTypes';
import { colors, buttonsStyles } from '../../../utils/styles';
import EditGallery from '../../gallery/components/Edit';

interface EditProfileProps {
    user: RootProps['user'];
    update_profile: UserDispatchActionsProps['update_profile'];
}

interface ProfileFormProps {
    name: string;
    bioShort: string;
    bioLong: string;
    age: number;
    gender: string;
}

const EditProfile = (props: EditProfileProps) => {
    const { name, bioShort, bioLong, age, gender } = props.user;

    const [profileVals, setProfileVals] = useState<ProfileFormProps>({
        name,
        bioShort,
        bioLong,
        age,
        gender
    })

    const handleFormSubmit = () => {
        console.log(profileVals)
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.text_input_container}>
                    <Text style={styles.text_input_label}>Name:</Text>
                    <TextInput placeholder='Name' value={profileVals.name} onChangeText={(text) => setProfileVals({ ...profileVals, name: text })} style={styles.text_input} />
                </View>

                <View style={styles.text_input_container}>
                    <Text style={styles.text_input_label}>Short Bio: </Text>
                    <TextInput placeholder='Short Bio' multiline value={profileVals.bioShort} onChangeText={(text) => setProfileVals({ ...profileVals, bioShort: text })} style={styles.text_input} />
                </View>

                <View style={styles.text_input_container}>
                    <Text style={styles.text_input_label}>Long Bio: </Text>
                    <TextInput placeholder='Long Bio' multiline value={profileVals.bioLong} onChangeText={(text) => setProfileVals({ ...profileVals, bioLong: text })} style={styles.text_input} />
                </View>

                <View style={styles.age_gender_section}>
                    <View>
                        <Text style={styles.text_input_label}>Age: </Text>
                        <TextInput placeholder='Age' keyboardType='numeric' maxLength={3} value={profileVals.age.toString()} onChangeText={(text) => setProfileVals({ ...profileVals, age: parseInt(text) })} style={styles.text_input} />
                    </View>
                    <View>
                        <Text style={styles.text_input_label}>Gender</Text>
                        <Picker
                            enabled={false}
                            selectedValue={profileVals.gender.toLowerCase()}
                            onValueChange={(itemValue) => {
                                setProfileVals({ ...profileVals, gender: itemValue.toString() })
                            }}
                            style={styles.picker}
                            itemStyle={styles.picker_item}
                        >
                            <Picker.Item label='Men' value='men' />
                            <Picker.Item label='Women' value='women' />
                            <Picker.Item label="Other" value='other' />
                        </Picker>
                    </View>
                </View>
                <Pressable onPress={handleFormSubmit} style={buttonsStyles.button_primary}>
                    <Text style={buttonsStyles.button_primary_text}>Update</Text>
                </Pressable>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 20
    },
    scrollView: {
        paddingBottom: 40,
        alignItems: 'stretch'
    },
    text_input_container: {
        margin: 10
    },
    text_input: {
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10
    },
    text_input_label: {
        fontSize: 12,
        color: colors.primary
    },
    picker: {
        width: 100,
        backgroundColor: colors.primary
    },
    picker_item: {
        fontSize: 12
    },
    age_gender_section: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect(mapStateToProps, { update_profile })(EditProfile);