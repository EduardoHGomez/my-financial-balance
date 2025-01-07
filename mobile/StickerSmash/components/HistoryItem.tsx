import { View, Text, StyleSheet, Platform } from 'react-native';

interface HistoryItemProps {
    data: {
        amount: number;
        description: string;
        payment_date: string;
        remaining_balance: number;
    }
}

export default function HistoryItem({ data }: HistoryItemProps) {
    const date = new Date(data.payment_date).toLocaleDateString();
    
    return (
        <View style={styles.neumorphic}> 
            <View style={styles.row}>
                <Text style={styles.description}>{data.description}</Text>
                <Text style={[styles.amount, { color: data.amount < 0 ? '#ff4444' : '#00C851' }]}>
                    ${Math.abs(data.amount).toFixed(2)}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.balance}>Balance: ${data.remaining_balance.toFixed(2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    neumorphic: {
        borderRadius: 25,
        backgroundColor: '#fafafa',
        shadowColor: '#f5f5f5',
        shadowOffset: {
            width: -31,
            height: -31,
        },
        shadowOpacity: 1,
        shadowRadius: 24,
        elevation: 8,
        padding: 20,
        margin: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#ffffff',
                shadowOffset: {
                    width: 31,
                    height: 31,
                },
                shadowOpacity: 1,
                shadowRadius: 24,
            },
            android: {
            }
        })
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    description: {
        fontSize: 16,
        fontWeight: '600',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    balance: {
        fontSize: 14,
        color: '#666',
    }
});