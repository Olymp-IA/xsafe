// apps/erp-mobile/src/modules/inventory/InventoryScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';

export default function InventoryScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inventory Management</Text>
            <Text style={styles.text}>Scanner integration pending...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
