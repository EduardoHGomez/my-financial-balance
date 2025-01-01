import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { LineChart } from "react-native-gifted-charts";
import { Dimensions } from 'react-native';
import { supabase } from '../../lib/supabase';
import DropDownPicker from 'react-native-dropdown-picker';

export default function GraphScreen() {
    const [selected, setSelected] = useState('7D');
    const options = ['7D', '1M', '1Y', '5Y'];
    const [history, setHistory] = useState<any>([]);

    const barData = [{value: 15}, {value: 30}, {value: 26}, {value: 400}];

    useEffect(() => {
        // retrieveDataPerPeriod();
    }, []);

    const handleSelect = (value: string) => {
        setSelected(value);

        retrieveDataPerPeriod(selected);
    };

    // TO DO:

    // Based on that button, get the range within that data
    const retrieveDataPerPeriod = async (selected: string) => {
        try {
            const { data, error } = await supabase
                .rpc('filter_spending_by_period', {
                    period: selected,
                });

            if (error) throw error;

            if (data) {
                let groupedHistory: { [key: string]: { description: string, payment_date: string }[] } = {};
                
                data.forEach((item: any) => {
                    if (!groupedHistory[item.name]) {
                        groupedHistory[item.name] = [];
                    }
                    groupedHistory[item.name].push({
                        description: item.description,
                        payment_date: item.payment_date
                    });
                });

                setHistory(groupedHistory);
                console.log('Grouped History:', groupedHistory);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Could not fetch data');
        }
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
            
            <View style={styles.chartContainer}>
                <LineChart 
                areaChart 
                curved 
                initialSpacing={0}
                pointerConfig={{}}
                startFillColor="#ecd59b"
                startOpacity={0.8}
                endFillColor="#fcf8ee"
                endOpacity={0.1}
                data={barData}/>

            </View>



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
    chartContainer: {
        width: Dimensions.get('window').width - 24,
    }
});
