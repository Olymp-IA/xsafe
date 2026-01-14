// apps/erp-mobile/src/modules/auth/AuthScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../themes/colors';

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Implement actual auth logic here
        Alert.alert('Login', 'Implementing auth logic...');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>xSafe ERP</Text>
            <Text style={styles.subtitle}>Mobile Access</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Email ID</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="admin@xsafe.com"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        padding: 30,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        fontFamily: 'System', // Replace with 'Unbounded'
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: 50,
    },
    form: {
        width: '100%',
    },
    label: {
        color: colors.secondary,
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: colors.panel,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.primary,
        padding: 15,
        borderRadius: 4,
        marginBottom: 20,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: colors.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
