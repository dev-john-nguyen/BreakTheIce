import React from 'react';
import { View, Text, FlatList, TouchableHighlight, Pressable } from 'react-native';
import { ListContainerStyle, colors } from '../../utils/styles';
import { SvgXml } from 'react-native-svg';
import { ProfileImg } from '../../utils/components';
const Messages = () => {
    const testData = [{
        username: 'nguyening20',
        age: 26,
        date: '12/31/2020',
        msgId: '34af23dsf',
        recentMsg: "The short film to You Rock My World, the Top 10 hit single from Michael Jackson's Invincible, features guest appearances from Chris Tucker, Michael Madsen and Marlon Brando, in one of his final film appearances."
    }]
    return (
        <FlatList
            data={testData}
            renderItem={({ item, index, separators }) => (
                <TouchableHighlight
                    key={item.msgId ? item.msgId : index.toString()}
                    onPress={() => console.log('pressed')}
                    underlayColor={colors.secondary}
                    style={ListContainerStyle.container}
                >
                    <View style={ListContainerStyle.content}>
                        <View style={ListContainerStyle.topLeft}>
                            <Text style={ListContainerStyle.topLeft_text}>{item.date ? item.date : 0}</Text>
                        </View>
                        <View style={ListContainerStyle.profile_section}>
                            <ProfileImg friend={true} />
                            <View style={ListContainerStyle.profile_section_text}>
                                <Text style={ListContainerStyle.username}>{item.username ? item.username : 'RandomUser'}</Text>
                                <Text style={ListContainerStyle.age}>{item.age ? item.age : 0} years old</Text>
                            </View>
                        </View>
                        <View style={ListContainerStyle.content_section}>
                            <Text style={ListContainerStyle.content_section_text}>{item.recentMsg ? item.recentMsg : 'no recent message...'}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )}
            keyExtractor={(item, index) => item.msgId ? item.msgId : index.toString()}
        />
    )
}

export default Messages;