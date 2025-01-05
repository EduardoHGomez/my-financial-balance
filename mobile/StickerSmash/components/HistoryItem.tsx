import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Text } from 'react-native';
import { Input, Button, Switch } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';

export default function HistoryItem({item}: any) {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{item.description}</Text>
            <Text>{item.amount}</Text>
            <Text>{item.payment_date}</Text>
        </View>
    );
}