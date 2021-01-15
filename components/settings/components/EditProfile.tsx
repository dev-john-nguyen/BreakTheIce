import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Picker, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Pressable, ActivityIndicator } from 'react-native';
import { colors } from '../../../utils/styles';
import { Feather } from '@expo/vector-icons';
import { UpdateUserProfileProps, UserDispatchActionsProps, UserRootStateProps } from '../../../services/user/types';
import { UtilsDispatchActionProps } from '../../../services/utils/tsTypes';
import { MeStackNavigationProp } from '../../navigation/utils';
import { isEqual } from 'lodash';

interface EditProfileProps {
    user: UserRootStateProps;
    update_profile: UserDispatchActionsProps['update_profile'];
    set_banner: UtilsDispatchActionProps['set_banner'];
    navigation: MeStackNavigationProp
}

interface ProfileFormProps {
    name: string;
    bioShort: string;
    bioLong: string;
    age: number;
    gender: string;
}

const EditProfile = ({ user, update_profile, set_banner, navigation }: EditProfileProps) => {
    const { name, bioShort, bioLong, age, gender } = user;

    const [profileVals, setProfileVals] = useState<UpdateUserProfileProps>({
        name,
        bioShort,
        bioLong,
        age,
        gender: gender ? gender : 'man'
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        var mount = true;
        navigation.setOptions({
            headerRight: () => {
                if (loading) {
                    return <ActivityIndicator size='small' color={colors.white} style={{ marginRight: 30 }} />
                } else {
                    return (
                        <Pressable onPress={() => handleSave(mount)} style={{ marginRight: 20 }}>
                            {({ pressed }) => <Feather name='save' size={30} color={pressed ? colors.secondary : colors.white} />}
                        </Pressable >
                    )
                }
            }
        })

        return () => {
            mount = false
            navigation.setOptions({ headerRight: undefined })
        }
    }, [loading, profileVals, user])


    const handleSave = (mount: boolean) => {
        mount && setLoading(true)

        const { name, bioShort, bioLong, age, gender } = user;

        var oldVals = { name, bioShort, bioLong, age, gender }

        if (isEqual(oldVals, profileVals)) {
            if (mount) {
                set_banner('No updates found.', 'warning')
                setLoading(false)
            }
            return
        }

        let key: keyof typeof profileVals;

        for (key in profileVals) {
            if (!profileVals[key]) {
                if (mount) {
                    set_banner('Please ensure all fields are filled out.', 'error')
                    setLoading(false)
                }
                return
            }

        }

        update_profile(profileVals)
            .then(() => {
                mount && setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                mount && set_banner('Oops! Something went wrong updating your profile.', 'error')
            })
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={styles.text_input_container}>
                            <Text style={styles.text_input_label}>Name:</Text>
                            <TextInput
                                placeholder='Name'
                                value={profileVals.name}
                                onChangeText={(text) => setProfileVals({ ...profileVals, name: text })}
                                style={styles.text_input} />
                        </View>

                        <View style={styles.text_input_container}>
                            <Text style={styles.text_input_label}>Short Bio:</Text>
                            <Text style={styles.text_input_info}>
                                <Feather name="info" size={10} color={colors.primary} /> Other will initially see this. Make a good first impression. Max character length is 100.
                            </Text>
                            <TextInput
                                placeholder='Short Bio'
                                multiline
                                maxLength={100}
                                value={profileVals.bioShort}
                                onChangeText={(text) => setProfileVals({ ...profileVals, bioShort: text })}
                                style={styles.text_input} />
                        </View>

                        <View style={styles.text_input_container}>
                            <Text style={styles.text_input_label}>Long Bio:</Text>
                            <Text style={styles.text_input_info}>
                                <Feather name="info" size={10} color={colors.primary} /> Will be displayed on your profile. Max character length is 200.
                            </Text>
                            <TextInput
                                placeholder='Long Bio'
                                multiline
                                maxLength={200}
                                value={profileVals.bioLong}
                                onChangeText={(text) => setProfileVals({ ...profileVals, bioLong: text })}
                                style={styles.text_input} />
                        </View>

                        <View style={styles.text_input_container}>
                            <Text style={styles.text_input_label}>Age:</Text>
                            <TextInput
                                keyboardType='numeric'
                                maxLength={3}
                                value={profileVals.age.toString()}
                                onChangeText={(text) => setProfileVals({ ...profileVals, age: parseInt(text) ? parseInt(text) : 0 })}
                                style={styles.text_input} />
                        </View>
                        <View style={styles.text_input_container}>
                            <Text style={styles.text_input_label}>Gender:</Text>
                            <Picker
                                enabled={false}
                                selectedValue={profileVals.gender}
                                onValueChange={(itemValue) => {
                                    setProfileVals({ ...profileVals, gender: itemValue.toString() })
                                }}
                                style={styles.picker}
                                itemStyle={styles.picker_item}
                            >
                                <Picker.Item label='Man' value='man' />
                                <Picker.Item label='Woman' value='woman' />
                                <Picker.Item label="Other" value='other' />
                            </Picker>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
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
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 10
    },
    text_input_label: {
        fontSize: 10,
        color: colors.primary,
        marginBottom: 5,
        marginLeft: 2
    },
    text_input_info: {
        fontSize: 8,
        color: colors.primary,
        marginBottom: 5,
        marginLeft: 4,
        alignItems: 'center'
    },
    picker: {
        width: 100,
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 5,
        height: 100
    },
    picker_item: {
        fontSize: 10,
        height: 100
    }
})

export default EditProfile;