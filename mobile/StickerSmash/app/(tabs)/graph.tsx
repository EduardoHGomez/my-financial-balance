import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';

export default function GraphScreen() {
    const [selected, setSelected] = useState('1D');
    const options = ['1D', '1W', '1M', '1Y', '5Y'];

    const handleSelect = (value: string) => {
        setSelected(value);
        Alert.alert(`Selected: ${value}`);
    };



    // Based on that button, get the range within that data
    const retrieveData = async () => {
        
    }; 

    return (
        <View style={styles.container}>
            <View style={styles.radioGroup}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.radioButton,
                            selected === option && styles.radioButtonSelected
                        ]}
                        onPress={() => handleSelect(option)}
                    >
                        <Text style={[
                            styles.radioButtonText,
                            selected === option && styles.radioButtonTextSelected
                        ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioGroup: {
        flexDirection: 'row',
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 4,
    },
    radioButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 2,
    },
    radioButtonSelected: {
        backgroundColor: '#2196F3',
    },
    radioButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    radioButtonTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
