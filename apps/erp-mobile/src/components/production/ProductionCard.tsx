// apps/erp-mobile/src/components/production/ProductionCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { colors } from '../../themes/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProductionCardProps {
    order: any;
    onPress: () => void;
}

export const ProductionCard: React.FC<ProductionCardProps> = ({ order, onPress }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'IN_PROGRESS': return colors.warning;
            case 'COMPLETED': return colors.success;
            case 'PENDING': return colors.secondary;
            default: return colors.textMuted;
        }
    };

    return (
        <Card onPress={onPress} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.orderNumber}>{order.order_number}</Text>
                <View style={[styles.statusBadge, { borderColor: getStatusColor(order.status) }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                        {order.status}
                    </Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.row}>
                    <Icon name="account" size={16} color={colors.textMuted} />
                    <Text style={styles.detailText}>{order.customer_name}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="motorbike" size={16} color={colors.textMuted} />
                    <Text style={styles.detailText}>{order.motorcycle_model}</Text>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    statusBadge: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    details: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        color: colors.secondary,
        fontSize: 14,
    },
});
