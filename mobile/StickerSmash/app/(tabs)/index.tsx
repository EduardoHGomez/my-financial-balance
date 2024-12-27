import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../../lib/supabase';
import { ScrollView } from 'react-native-gesture-handler';

export default function Index() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('1');
  const [balance, setBalance] = useState<number>(0);
  const [userName, setUserName] = useState('1000.00');
  const [foodVoucherBalance, setFoodVoucherBalance] = useState<number>(0);
  const [groceryVoucherBalance, setGroceryVoucherBalance] = useState<number>(0);
  const [bbvaBalance, setBbvaBalance] = useState<number>(0);
  const [banamexBalance, setBanamexBalance] = useState<number>(0);
  const [nuBalance, setNuBalance] = useState<number>(0);

  // Here useState any is used because the data is not known for a given array
  const [paymentMethods, setPaymentMethods] = useState<any>([]);

  useEffect(() => {
    getUserData();
	loadPayments();
  }, []);

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
        
        console.log('Payment methods:', newItems);
        setPaymentMethods(newItems);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Could not fetch payment methods');
    }
  };

  const getUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('name, balance')
        .eq('name', 'Eduardo')
        .single();

      if (error) throw error;

      if (data) {
        setBalance(data.balance);
        setUserName(data.name);
        console.log('Username:', data.name);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Could not fetch user data');
    }
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
		<Text style={styles.balanceHeader}>
			Hello, {userName} 
		</Text>
		<Text style={styles.balanceHeader}>
			Balance: {balance} 
		</Text>
		<View style={styles.spacer} />
		<Text style={styles.balanceHeader}>
			Food Voucher: {foodVoucherBalance} 
		</Text>
		<Text style={styles.balanceHeader}>
			Grocery Voucher: {groceryVoucherBalance} 
		</Text>
		<Text style={styles.balanceHeader}>
			BBVA: {bbvaBalance} 
		</Text>
		<Text style={styles.balanceHeader}>
			Banamex: {banamexBalance} 
		</Text>
		<Text style={styles.balanceHeader}>
			Nu: {nuBalance} 
		</Text>
		<View style={styles.spacer} />
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
		<Button
			title="Submit"
			onPress={handleSubmit}
			buttonStyle={styles.button}
			containerStyle={styles.buttonContainer}
			disabled={!description || !amount}
		/>
		<View style={styles.spacer}/>
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
	},
	balanceHeader: {
		fontSize: 20,
		color: 'gray',
	},
	loadingText: {
		fontSize: 16,
		color: 'gray',
		textAlign: 'center',
		marginVertical: 10,
	},
	spacer: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
    marginHorizontal: 10,
  },
});
