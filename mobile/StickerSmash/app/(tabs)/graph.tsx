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
    const [goal, setGoal] = useState<number>(200);
    const [goals, setGoals] = useState<any>([]);
    const [open, setOpen] = useState(false);

    const [barData, setBarData] = useState([{value: 15}, {value: 30}, {value: 26}, {value: 400}]);

    useEffect(() => {
        retrieveDataPerPeriod();
    }, []);

    const handleSelect = (value: string) => {
        setSelected(value);
        retrieveGoals();

    };

    // TO DO:

    const retrieveGoals = async () => {
        try {
            const { data, error } = await supabase
                .from('goals')
                .select('*')
                .order('payment_date', { ascending: true });

            if (error) throw error;

            if (data) {
                //console.log('Goals:', data);
                setGoals(data);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Could not fetch goals');
        }

    };


    // Based on that button, get the range within that data
    const retrieveDataPerPeriod = async () => {
        try {
            const { data, error } = await supabase
                .rpc('filter_by_payment_and_period', {
                    payment_name: 'BBVA Debit',
                    period: '7D'
                });

            if (error) throw error;

            if (data) {

                console.log('Data:', data);
                let newBarData: ((prevState: { value: number; }[]) => { value: number; }[]) | { value: any; }[] = [];
                data.map((item: any) => {

                    newBarData.push({value: item.remaining_balance});


                });
                setBarData(newBarData);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error:', 'Could not fetch data');
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

        <View>
            {goals && goals.length > 0 ? (
                <DropDownPicker
                    open={open}
                    value={goal}
                    items={goals.map((g: any) => ({
                        label: g.name,
                        value: g.id
                    }))}
                    setOpen={setOpen}
                    setValue={setGoal}
                    setItems={setGoals}
                    zIndex={1000}
                />
            ) : (
                <Text>Loading payment methods...</Text>
            )}	

        </View>

        {/* Horizontal chart */}
        <View>
            {goal ? (
                <Text>{goal}</Text>
            ) : (
                <Text>No goal selected</Text>
            )}
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
