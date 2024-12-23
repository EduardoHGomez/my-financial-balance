import { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Input, Button } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../../lib/supabase';

export default function Index() {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('1');
  const [items] = useState([
    { label: 'Food Voucher', value: '1' },
    { label: 'Grocery Voucher', value: '2' },
    { label: 'BBVA', value: '3' },
    { label: 'Banamex', value: '4' },
    { label: 'Nu', value: '5' }
  ]);

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
      <DropDownPicker
        open={open}
        value={paymentMethod}
        items={items}
        setOpen={setOpen}
        setValue={setPaymentMethod}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
      />
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
    backgroundColor: 'white',
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
  dropdownContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  dropdown: {
    borderColor: '#999',
    borderRadius: 8,
    backgroundColor: '#fff',
  }
});
