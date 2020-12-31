import React, { useState } from 'react';
import { View, Text, TextInput, Picker, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CustomButton } from '../../utils/components';
import { listOfStates, listOfCountriesObj } from '../../utils/variables';
import { TimelineLocationProps } from '../../services/profile/tsTypes';
import { colors } from '../../utils/styles';
import { connect } from 'react-redux';

export default () => {
    const [startAt, setStartAt] = useState(new Date())
    const [endAt, setEndAt] = useState(new Date())
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState("US");
    const [curView, setCurView] = useState(0);
    const [comment, setComment] = useState('')

    const handleStartAt = (event: any, date: any) => {
        setStartAt(date);
    }
    const handleEndAt = (event: any, date: any) => {
        setEndAt(date);
    }

    const handleCountry = (value: any) => {
        if (value !== "US") {
            setState('')
        }
        setCountry(value)
    }

    const handleState = (value: any) => {
        setState(value)
    }

    const handleCity = (text: string) => {
        setCity(text)
    }

    const handleComment = (text: string) => {
        setComment(text)
    }

    const handleSave = () => {
        const newLocation: Omit<TimelineLocationProps, 'docId'> = {
            startAt,
            endAt,
            city,
            state,
            country,
            comment,
            createdAt: new Date(),
            updatedAt: new Date(),
            placesVisited: []
        }

        console.log(newLocation)
    }

    const renderForm = () => {
        switch (curView) {
            case 0:
                return (
                    <>
                        <Text style={styles.form_text}>Start Date</Text>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={startAt}
                            mode={'date'}
                            is24Hour={true}
                            display="default"
                            onChange={handleStartAt}
                            style={styles.form_date_picker}
                        />
                    </>
                )
            case 1:
                return (
                    <>
                        <Text style={styles.form_text}>End Date</Text>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={endAt}
                            mode={'date'}
                            is24Hour={true}
                            display="default"
                            onChange={handleEndAt}
                            style={styles.form_date_picker}
                        />
                    </>
                )
            case 2:
                return (
                    <>
                        <Text style={styles.form_text}>State/Country</Text>
                        <Picker
                            selectedValue={country}
                            onValueChange={handleCountry}
                            style={styles.form_picker}
                            itemStyle={styles.form_picker_item}
                        >
                            {Object.keys(listOfCountriesObj).map((alpha2) => (
                                <Picker.Item label={listOfCountriesObj[alpha2]} value={alpha2} />
                            ))}
                        </Picker>
                        {country == 'US' && <Picker
                            selectedValue={state}
                            onValueChange={handleState}
                            style={styles.form_picker}
                            itemStyle={styles.form_picker_item}
                        >
                            {listOfStates.map((state) => (
                                <Picker.Item label={state} value={state} />
                            ))}
                        </Picker>}
                    </>
                )
            case 3:
                return (
                    <>
                        <Text style={styles.form_text}>City</Text>
                        <TextInput onChangeText={handleCity} value={city} style={styles.form_text_input} />
                    </>
                )
            default:
                return (
                    <>
                        <Text style={styles.form_text}>Comment</Text>
                        <TextInput onChangeText={handleComment} value={comment} style={styles.form_text_input} />
                    </>
                )
        }
    }

    const handleNext = () => {
        setCurView(curView + 1)
    }

    const handlePrevious = () => {
        setCurView(curView - 1)
    }


    return (
        <View style={styles.container}>
            <View style={styles.form_section}>
                {renderForm()}
            </View>
            <View style={styles.button_section}>
                {
                    curView < 4 ?
                        <CustomButton type='primary' text="Next" onPress={handleNext} /> :
                        <CustomButton type='primary' text="Save" onPress={handleSave} />
                }
                {curView > 0 && <CustomButton type='secondary' text="Previous" onPress={handlePrevious} />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    form_section: {
        alignSelf: 'stretch'
    },
    form_text: {
        marginBottom: 10,
        fontSize: 20,
        fontWeight: '600',
        color: colors.primary,
        alignSelf: 'center'
    },
    form_date_picker: {
        alignSelf: 'center',
        minWidth: 130,
        margin: 20
    },
    form_text_input: {
        textAlign: 'center',
        alignSelf: 'stretch',
        margin: 20,
        padding: 10,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 10,
        color: colors.primary,
        fontWeight: '500',
        fontSize: 14
    },
    form_picker: {
    },
    form_picker_item: {
        fontSize: 14,
        color: colors.primary
    },
    button_section: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignSelf: 'stretch',
        margin: 20
    }
})