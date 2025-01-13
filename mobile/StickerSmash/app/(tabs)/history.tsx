import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Text } from 'react-native';
import { Input, Button, Switch } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../../lib/supabase';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HistoryItem from '@/components/HistoryItem';

export default function Index() {

    const [history, setHistory] = useState<any>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>('1');
    const [paymentMethods, setPaymentMethods] = useState<any>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        loadPayments();
        retrieveHistory();
    }, [paymentMethod]); 

    const loadPayments = async () => {
        try {
        const { data, error } = await supabase
            .from('payment')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        if (data) {
            const newItems = data.map((item: any) => ({
                label: item.name,
                value: item.id,
            }));

            setPaymentMethods(newItems);
        }
        } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Could not fetch payment methods');
        }
    };

    const retrieveHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('spending')
                .select('*')
                .eq('payment_id', paymentMethod)
                .order('payment_date', { ascending: true });

            if (error) throw error;

            if (data) {
                setHistory(data);
            }
        }
        catch (error) {
            Alert.alert('Error', 'Could not fetch history');
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
            <ScrollView 
                style={styles.container} 
                contentContainerStyle={styles.contentContainer}
            >
                {history.map((item: any) => {
                    return <HistoryItem key={item.id} data={item} />
                })}
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 10,
    },
    dropdown: {
        backgroundColor: '#fafafa',
        borderWidth: 0,
        marginHorizontal: 10,
        marginBottom: 10,
    },
    dropdownContainer: {
        marginTop: 10,
    }
});
