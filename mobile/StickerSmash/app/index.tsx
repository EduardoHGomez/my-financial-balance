import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabase';

export default function Index() {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [paymentMethod, setPaymentMethod] = useState<string>('1');

  const paymentMethods = {
    '1': 'Food Voucher',
    '2': 'Grocery Voucher',
    '3': 'BBVA',
    '4': 'Banamex',
    '5': 'Nu'
  };

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from('spending')
        .insert([
          {
            description,
            amount: Number(amount),
            payment_method: parseInt(paymentMethod),
          },
        ])
        .single();

      if (error) throw error;

      Alert.alert('Success', 'Transaction added successfully!');
      setDescription('');
      setAmount('0');
      setPaymentMethod('1');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to add transaction');
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Input
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.pickerContainer}>
        <Picker.Item label="Nu" value="5" />
      </View>
      <Button
        title="Submit"
        onPress={handleSubmit}
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
        disabled={!description || !amount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
  },
  pickerContainer: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  picker: {
    height: 50,
  }
});
