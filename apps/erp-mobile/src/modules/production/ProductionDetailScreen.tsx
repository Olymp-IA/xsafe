// apps/erp-mobile/src/modules/production/ProductionDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';

export default function ProductionDetailScreen({ route }: any) {
    const { orderId } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order #{orderId}</Text>
            <Text style={styles.text}>Details coming soon...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: colors.primary,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        color: colors.textMuted,
    },
});
