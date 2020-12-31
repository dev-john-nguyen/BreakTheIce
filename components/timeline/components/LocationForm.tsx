import React, { useState } from 'react';
import { View, Text, TextInput, Picker } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CustomButton } from '../../../utils/components';
import { listOfCountries, listOfStates, listOfCountriesObj } from '../../../utils/variables';
import { TimelineLocationProps } from '../../../services/profile/tsTypes';

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

    const handleCountry = (itemValue: any) => {
        setCountry(itemValue)
    }

    const handleState = (itemValue: any) => {
        setState(itemValue)
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
                    <View>
                        <Text>Start Date</Text>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={startAt}
                            mode={'date'}
                            is24Hour={true}
                            display="default"
                            onChange={handleStartAt}
                        />
                    </View>
                )
            case 1:
                return (
                    <View>
                        <Text>End Date</Text>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={endAt}
                            mode={'date'}
                            is24Hour={true}
                            display="default"
                            onChange={handleEndAt}
                        />
                    </View>
                )
            case 2:
                return (
                    <View>
                        <Text>State/Country</Text>
                        <Picker
                            selectedValue={country}
                            onValueChange={handleCountry}
                        >
                            {Object.keys(listOfCountriesObj).map((alpha2) => {
                                <Picker.Item label={listOfCountriesObj[alpha2]} value={alpha2} />
                            })}
                        </Picker>
                        {country == 'US' && <Picker
                            selectedValue={state}
                            onValueChange={handleState}
                        >
                            {listOfStates.map((state) => {
                                <Picker.Item label={state} value={state} />
                            })}
                        </Picker>}
                    </View>
                )
            case 3:
                return (
                    <View>
                        <Text>City</Text>
                        <TextInput onChangeText={handleCity} value={city} />
                    </View>
                )
            default:
                return (
                    <View>
                        <Text>Comment</Text>
                        <TextInput onChangeText={handleComment} value={comment} />
                    </View>
                )
        }
    }

    const handleNext = () => {
        setCurView(curView + 1)
    }


    return (
        <View>
            {renderForm()}
            {
                curView < 4 ?
                    <CustomButton type='primary' text="Next" onPress={handleNext} /> :
                    <CustomButton type='primary' text="Save" onPress={handleSave} />
            }
            {curView > 0 && <CustomButton type='secondary' text="Previous" onPress={handleNext} />}
        </View>
    )
}