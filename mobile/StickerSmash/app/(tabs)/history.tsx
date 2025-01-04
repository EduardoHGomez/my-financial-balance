import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Text } from 'react-native';
import { Input, Button, Switch } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../../lib/supabase';
import { ScrollView } from 'react-native-gesture-handler';

export default function Index() {

    const [history, setHistory] = useState<any>([]);


    useEffect(() => {
        retrieveHistory();
    }, []);

    const retrieveHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('spending')
                .select('*')
                .order('payment_date', { ascending: true });

            if (error) throw error;

            if (data) {
                setHistory(data);
            }
        }
        catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Could not fetch history');
        }
    };



    return (
        <View>

            <Button
                title="Submit"
            />

            {history.map((item: any) => {
                return (
                    <View key={item.id}>
                        <Text>{item.description}</Text>
                        <Text>{item.amount}</Text>
                        <Text>{item.payment_date}</Text>
                    </View>
                );
            })};

        </View>
    );
}

const styles = StyleSheet.create({

});
