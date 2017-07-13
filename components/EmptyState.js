import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
    emptyState: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    emptyStateText: {
        fontFamily: 'Avenir Next',
        fontSize: 19,
        textAlign: 'center',
        padding: 30
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

export default class EmptyState extends React.Component {
    render() {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No Finds Yet! Take a photo or upload from your camera roll using the buttons at the bottom.</Text>
            </View>
        );
    }
}