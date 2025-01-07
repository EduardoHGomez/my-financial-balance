import { View, Text, StyleSheet, Platform } from 'react-native';

export default function HistoryItem(item: any) {
    return (
        <View style={styles.neumorphic}> 
            <Text>Hello world</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    neumorphic: {
        borderRadius: 50,
        backgroundColor: '#fafafa',
        shadowColor: '#f5f5f5',
        shadowOffset: {
            width: -31,
            height: -31,
        },
        shadowOpacity: 1,
        shadowRadius: 24,
        elevation: 8,
        padding: 20,
        margin: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#ffffff',
                shadowOffset: {
                    width: 31,
                    height: 31,
                },
                shadowOpacity: 1,
                shadowRadius: 24,
            },
            android: {
            }
        })
    }
});