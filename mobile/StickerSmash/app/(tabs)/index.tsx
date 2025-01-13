import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Text, TouchableOpacity } from 'react-native';
import { Input, Button, Switch } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../../lib/supabase';
import { ScrollView } from 'react-native-gesture-handler';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function Index() {
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState<string>('');
	const [paymentMethod, setPaymentMethod] = useState('1');

	const [open, setOpen] = useState(false);
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



	const loadUserBalance = async () => {

		try {
			const { data, error } = await supabase
				.rpc('get_payment_summaries');

			if (error) throw error;

			if (data) {
				//console.log('Data received:', data);
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

	const submitSpending = async () => {
		const calculatedAmount = isIncome ? amount : -Math.abs(Number(amount));	
		const newDescription = description.trim();

		// Insert only description, amount, payment_type
		console.log({ description, amount, paymentMethod });

		try {
			const { data, error } = await supabase
				.from('spending')
				.insert([
				{
					newDescription,
					amount: Number(calculatedAmount),
					payment_id: parseInt(paymentMethod),
				},
				])
				.single();

			if (error) {
				throw error;
			}

			Alert.alert('Success', 'Transaction added successfully!');
		} catch (error) {
			console.error('Error:', error);
			Alert.alert('Error', 'Failed to add transaction');
		}

		// Set data back to default
		setDescription('');
		setAmount('');
		setPaymentMethod('1');


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
			placeholder="$ 00.00"
			keyboardType="numeric"
			value={amount} 
			onChangeText={(value) => {
				setAmount(value);
			}}
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


		{/* Radio buttons for income and expense */}
		<View style={styles.radioGroupContainer}>
			{/* Used this TouchableOpacity for the dimming and fading of the button after pressing */}
			{/* Although the documentation says it recommends Pressable */}

			<TouchableOpacity
				style={[
					styles.radioButton,
					styles.radioButtonIncome,
					isIncome && styles.radioButtonIncomeSelected,
					!isIncome && { borderRightColor: 'transparent' },
				]}
				onPress={() => setIsIncome(true)}
			>
				<Text style={[
					styles.radioButtonText,
					styles.radioButtonSelectedText,
					{ color: 'green' },
				]}>
					{" 🤑 Income "}
				</Text>
			</TouchableOpacity>
			
			<TouchableOpacity
				style={[
					styles.radioButton,
					styles.radioButtonExpense,
					!isIncome && styles.radioButtonExpenseSelected,
					isIncome && { borderLeftColor: 'transparent' },
				]}
				onPress={() => setIsIncome(false)}
			>
				<Text style={[
					styles.radioButtonText,
					styles.radioButtonSelectedText,
					{ color: 'red' },
				]}>
				{" 💸 Expense"}
				</Text>
			</TouchableOpacity>
		</View>
		


		<Button
			title="Submit"
			onPress={submitSpending}
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
	},

	radioGroupContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginVertical: 10,
		marginHorizontal: 10,
	},
	radioButton: {
		padding: 12,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#c8d7d9',
	},
	radioButtonIncome: {
		borderTopLeftRadius: 6,
		borderBottomLeftRadius: 6,
	},
	radioButtonExpense: {
		borderTopRightRadius: 6,
		borderBottomRightRadius: 6,
	},
	radioButtonIncomeSelected: {
		backgroundColor: '#f2ffe5',
		borderColor: '#255b01',
		borderWidth: 1,
	},
	radioButtonExpenseSelected: {
		borderColor: '#a50f0f',
		backgroundColor: '#fff1f1',
		zIndex: 1,
	},
	radioButtonText: {
		fontSize: 14,
		letterSpacing: 0.5,
	},
	radioButtonSelectedText: {
		fontWeight: 'bold',
	},



});
