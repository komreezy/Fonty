import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'blue',
        borderRadius: 3,
        borderColor: '#CCCCCC'
    },
    text: {
        padding: 20,
        textAlign: 'center',
        justifyContent: 'flex-start'
    }
});

/**
 * Each find should contain:
 *
 * tag
 * image
 * date
 *
 * */

export default class Find extends React.Component {
    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.text}</Text>
            </View>
        );
    }
}