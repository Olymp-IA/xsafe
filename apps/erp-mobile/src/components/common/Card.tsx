// apps/erp-mobile/src/components/common/Card.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../../themes/colors';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
    if (onPress) {
        return (
            <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.panel,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
});
