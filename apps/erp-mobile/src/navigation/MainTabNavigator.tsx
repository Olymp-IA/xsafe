// apps/erp-mobile/src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardNavigator, ProductionNavigator, InventoryNavigator } from './StackNavigators';
import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#161616',
                    borderTopColor: '#2A2A2A',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: '#888888',
                tabBarIcon: ({ color, size }) => {
                    let iconName = 'box';

                    if (route.name === 'Dashboard') {
                        iconName = 'grid';
                    } else if (route.name === 'Production') {
                        iconName = 'layers';
                    } else if (route.name === 'Inventory') {
                        iconName = 'package';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardNavigator} />
            <Tab.Screen name="Production" component={ProductionNavigator} />
            <Tab.Screen name="Inventory" component={InventoryNavigator} />
        </Tab.Navigator>
    );
};
