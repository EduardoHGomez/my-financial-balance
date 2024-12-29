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

    // Change the graph and extend up to all the sides and change colors
    // Use the list to retrieve the data based on 7D, 1W, 1M, 1Y, 5Y
    // Retrieve the data, use payment type and then story per the last n days (print the results)

    // Use the picker for filtering

    // Console log based on the picker and show only that data
    // Mix all the graphs together



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


		{paymentMethods && paymentMethods.length > 0 ? (
			<DropDownPicker
			open={open}
			value={paymentMethod}
			items={paymentMethods}
			setOpen={setOpen}
			setValue={setPaymentMethod}
			style={styles.dropdown}
			containerStyle={styles.dropdownContainer}
			zIndex={1000}
			/>
		) : (
			<Text style={styles.loadingText}>Loading payment methods...</Text>
		)}	

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
