// apps/erp-mobile/src/components/dashboard/StatsCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../themes/colors';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    onPress?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    color,
    onPress,
}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Icon name={icon} size={24} color={color} />
            </View>
            <View style={styles.content}>
                <Text style={styles.value}>{value}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.panel,
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginBottom: 16,
        marginRight: '2%', // For grid layout spacing
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    title: {
        fontSize: 12,
        color: colors.textMuted,
    },
});
