// apps/erp-mobile/src/navigation/StackNavigators.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../modules/dashboard/DashboardScreen';
import ProductionListScreen from '../modules/production/ProductionListScreen';
import ProductionDetailScreen from '../modules/production/ProductionDetailScreen';
import InventoryScreen from '../modules/inventory/InventoryScreen';
import AuthScreen from '../modules/auth/AuthScreen';

// Stack Param Lists
export type AuthStackParamList = {
    Login: undefined;
};

export type DashboardStackParamList = {
    DashboardHome: undefined;
};

export type ProductionStackParamList = {
    ProductionList: undefined;
    ProductionDetail: { orderId: string };
};

export type InventoryStackParamList = {
    InventoryHome: undefined;
    ItemDetail: { itemId: string };
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const DashboardStack = createStackNavigator<DashboardStackParamList>();
const ProductionStack = createStackNavigator<ProductionStackParamList>();
const InventoryStack = createStackNavigator<InventoryStackParamList>();

export const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={AuthScreen} />
    </AuthStack.Navigator>
);

export const DashboardNavigator = () => (
    <DashboardStack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#0E0E0E' },
            headerTintColor: '#E0E0E0',
            headerTitleStyle: { fontFamily: 'System', fontWeight: 'bold' },
        }}
    >
        <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} options={{ title: 'xSafe ERP' }} />
    </DashboardStack.Navigator>
);

export const ProductionNavigator = () => (
    <ProductionStack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#0E0E0E' },
            headerTintColor: '#E0E0E0',
        }}
    >
        <ProductionStack.Screen name="ProductionList" component={ProductionListScreen} options={{ title: 'Production Orders' }} />
        <ProductionStack.Screen name="ProductionDetail" component={ProductionDetailScreen} options={{ title: 'Order Details' }} />
    </ProductionStack.Navigator>
);

export const InventoryNavigator = () => (
    <InventoryStack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#0E0E0E' },
            headerTintColor: '#E0E0E0',
        }}
    >
        <InventoryStack.Screen name="InventoryHome" component={InventoryScreen} options={{ title: 'Inventory' }} />
    </InventoryStack.Navigator>
);
