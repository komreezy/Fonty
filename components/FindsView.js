import React from 'react';
import { View, StyleSheet, Text, ListView } from 'react-native';

const styles = StyleSheet.create({
    resultsContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection:'row',
        paddingTop: 20
    },
    results: {
        flex: 1
    },
    cell: {
        padding: 20,
        textAlign: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'Avenir Next',
        fontSize: 20,
        borderColor: '#FF8724',
        borderWidth: 1,
        borderRadius: 3,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 4,
        marginBottom: 4
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

export default class FindsView extends React.Component {
    render() {
        return(
            <View style={styles.resultsContainer}>
                <ListView
                    enableEmptySections={true}
                    removeClippedSubviews={false}
                    contentContainerStyle={styles.results}
                    dataSource={this.props.ds}
                    renderRow={(find) => <Text id={find.id} style={styles.cell}>{find.tag}</Text>}
                />
            </View>
        );
    }
}