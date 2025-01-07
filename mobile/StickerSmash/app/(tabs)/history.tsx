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
                console.log(data);
            }
        }
        catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Could not fetch history');
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
    }
});
