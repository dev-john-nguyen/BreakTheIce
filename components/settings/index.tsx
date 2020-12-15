import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';

const Settings = () => {
    return (
        <View>

        </View>
    )
}

const mapStateToProps = (state: RootProps) => ({

})

export default connect(mapStateToProps, {})(Settings);