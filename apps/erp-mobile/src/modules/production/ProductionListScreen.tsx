// apps/erp-mobile/src/modules/production/ProductionListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../themes/colors';
import { database } from '../../services/storage/database';
import { useNavigation } from '@react-navigation/native';

export default function ProductionListScreen() {
    const [orders, setOrders] = useState<any[]>([]);
    const navigation = useNavigation<any>();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        // Mock data for initial view
        const mockOrders = [
            { id: '1', order_number: 'ORD-001', customer_name: 'John Doe', status: 'IN_PROGRESS' },
            { id: '2', order_number: 'ORD-002', customer_name: 'Jane Smith', status: 'PENDING' },
        ];
        setOrders(mockOrders);

        // In real implementation:
        // const dbOrders = await database.executeQuery('SELECT * FROM production_orders');
        // setOrders(dbOrders);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductionDetail', { orderId: item.id })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.orderNumber}>{item.order_number}</Text>
                <Text style={[styles.status, { color: item.status === 'IN_PROGRESS' ? colors.warning : colors.textMuted }]}>
                    {item.status}
                </Text>
            </View>
            <Text style={styles.customerName}>{item.customer_name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: colors.panel,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    customerName: {
        color: colors.textMuted,
    },
});
