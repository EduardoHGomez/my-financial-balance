import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LineChart } from "react-native-gifted-charts";

export default function GraphScreen() {
    const [selected, setSelected] = useState('1D');
    const options = ['1D', '1W', '1M', '1Y', '5Y'];

    const barData = [{value: 15}, {value: 30}, {value: 26}, {value: 40}];

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

            <LineChart data={barData}/>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 12,
    },
    radioGroup: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 4,
        borderColor: '#999',
        borderWidth: 1,
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
        color: 'black',
        fontSize: 14,
    },
    radioButtonTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
