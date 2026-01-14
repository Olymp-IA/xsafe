// apps/erp-mobile/src/navigation/AppNavigator.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainTabNavigator } from './MainTabNavigator';
import { AuthNavigator } from './StackNavigators';

export const AppNavigator = () => {
    // In a real app, use auth state from a hook (e.g. useAuth)
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};
