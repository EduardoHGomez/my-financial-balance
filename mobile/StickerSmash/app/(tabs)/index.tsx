import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Text } from 'react-native';
import { Input, Button, Switch } from 'react-native-elements';
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
  const [isIncome, setIsIncome] = useState(false);

  // Here useState any is used because the data is not known for a given array
  const [paymentMethods, setPaymentMethods] = useState<any>([]);
  const [paymentBalances, setPaymentBalances] = useState<any>([]);

  useEffect(() => {
    getUserData();
	loadPayments();
	loadUserBalance();
  }, []);


  	// TO DO:
	// Make the user change the color based on the payment method

	const loadUserBalance = async () => {
		// Changed this to an RCP

		try {
			const { data, error } = await supabase
				.rpc('get_payment_summaries');

			if (error) throw error;

			if (data) {
				console.log('Data received:', data);
				setPaymentBalances(data);
			}
		} catch (error) {
			console.error('Error:', error);
			Alert.alert('Error', 'Could not fetch balances');
		}
	};

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

  const getUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('name')
        .eq('name', 'Eduardo')
        .single();

      if (error) throw error;

      if (data) {
        setUserName(data.name);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Could not fetch user data');
    }
  };

	const handleSubmit = async () => {
		const calculatedAmount = isIncome ? amount : -Math.abs(Number(amount));	
		try {
			const { data, error } = await supabase
				.from('spending')
				.insert([
				{
					description,
					amount: Number(calculatedAmount),
					payment_id: parseInt(paymentMethod),
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
		<View style={styles.toggleContainer}>
			<Text style={[styles.toggleText, { color: isIncome ? '#4CAF50' : '#F44336' }]}>
				{isIncome ? 'Income' : 'Expense'}
			</Text>
			<Switch
				value={isIncome}
				onValueChange={setIsIncome}
				color="#4CAF50"
				trackColor={{ false: '#F44336', true: '#4CAF50' }}
				thumbColor="#ffffff"
			/>
		</View>
		<Button
			title="Submit"
			onPress={handleSubmit}
			buttonStyle={styles.button}
			containerStyle={styles.buttonContainer}
			disabled={!description || !amount}
		/>

		<View style={styles.spacer}/>

		{/* Balances for each of the payment method*/}
		{ /* For example, for debit card there should not be negative numbers */ }

		{paymentBalances && paymentBalances.length > 0 ? (
			paymentBalances.map((item: any) => (
				<Text key={`b_${item.payment_name}`}>{item.payment_name}: {item.total_amount}</Text>
			))
		) : (
			<Text>Loading your current balances ... </Text>
		)}


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
	toggleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 10,
		marginVertical: 10,
		paddingHorizontal: 10,
	},
	toggleText: {
		fontSize: 16,
		fontWeight: '500',
	}
});
