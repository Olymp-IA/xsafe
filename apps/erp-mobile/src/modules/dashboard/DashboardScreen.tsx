// apps/erp-mobile/src/modules/dashboard/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Text,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Button, Input, Scanner, StatsCard, ProductionCard } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useProduction } from '../../hooks/useProduction';
import { syncManager } from '../../services/sync/syncManager';
import { database } from '../../services/storage/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../themes/colors';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        pendingOrders: 0,
        inProduction: 0,
        completedToday: 0,
        lowStockItems: 0,
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [productionData, setProductionData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

    const loadDashboardData = async () => {
        try {
            // Mock data for initial render until DB is populated
            setStats({
                pendingOrders: 12,
                inProduction: 5,
                completedToday: 3,
                lowStockItems: 2,
            });

            // Chart mock data
            setProductionData([5, 8, 3, 12, 6, 9, 4]);

            // In a real scenario, uncomment the following:
            /*
            const [pendingResult, inProductionResult, completedResult, lowStockResult] =
              await Promise.all([
                database.executeQuery<any>('SELECT COUNT(*) as count FROM production_orders WHERE status IN ("PENDING", "CONFIRMED")'),
                database.executeQuery<any>('SELECT COUNT(*) as count FROM production_orders WHERE status = "IN_PRODUCTION"'),
                database.executeQuery<any>('SELECT COUNT(*) as count FROM production_orders WHERE status = "COMPLETED" AND date(completed_at) = date("now")'),
                database.executeQuery<any>('SELECT COUNT(*) as count FROM inventory_items WHERE quantity <= min_quantity'),
              ]);
      
            setStats({
              pendingOrders: pendingResult[0]?.count || 0,
              inProduction: inProductionResult[0]?.count || 0,
              completedToday: completedResult[0]?.count || 0,
              lowStockItems: lowStockResult[0]?.count || 0,
            });
            */
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await syncManager.manualSync();
        await loadDashboardData();
        setRefreshing(false);
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const chartConfig = {
        backgroundColor: colors.panel,
        backgroundGradientFrom: colors.panel,
        backgroundGradientTo: colors.panel,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(224, 224, 224, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: colors.accent
        }
    };

    const data = {
        labels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        datasets: [
            {
                data: productionData,
                color: (opacity = 1) => `rgba(224, 224, 224, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hola, {user?.firstName}</Text>
                    <Text style={styles.subtitle}>
                        {new Date().toLocaleDateString('es-MX', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                    <Icon name="bell-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Estadísticas rápidas */}
            <View style={styles.statsContainer}>
                <StatsCard
                    title="Pendientes"
                    value={stats.pendingOrders}
                    icon="clock-outline"
                    color="#F59E0B"
                    onPress={() => navigation.navigate('Production', { filter: 'pending' })}
                />
                <StatsCard
                    title="En producción"
                    value={stats.inProduction}
                    icon="cog-outline"
                    color="#3B82F6"
                    onPress={() => navigation.navigate('Production', { filter: 'in_production' })}
                />
                <StatsCard
                    title="Hoy"
                    value={stats.completedToday}
                    icon="check-circle-outline"
                    color="#10B981"
                    onPress={() => navigation.navigate('Production', { filter: 'completed_today' })}
                />
                <StatsCard
                    title="Stock bajo"
                    value={stats.lowStockItems}
                    icon="alert-outline"
                    color="#EF4444"
                    onPress={() => navigation.navigate('Inventory', { filter: 'low_stock' })}
                />
            </View>

            {/* Acciones rápidas (Grid de 4) */}
            <Card style={styles.card}>
                <Text style={[styles.cardTitle, { color: colors.primary }]}>Acciones rápidas</Text>
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('Nueva Orden')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
                            <Icon name="plus" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionText}>Nueva</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('Escanear QR')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
                            <Icon name="qrcode-scan" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionText}>Escanear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('Inventario')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
                            <Icon name="package-variant" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionText}>Ajustar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('Calidad')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}>
                            <Icon name="clipboard-check" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionText}>Calidad</Text>
                    </TouchableOpacity>
                </View>
            </Card>

            {/* Gráfico de producción semanal */}
            <Card style={styles.card}>
                <Text style={[styles.cardTitle, { color: colors.primary }]}>Producción semanal</Text>
                <LineChart
                    data={data}
                    width={screenWidth - 64} // padding adjustment
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        fontFamily: 'System',
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        paddingBottom: 0,
        justifyContent: 'space-between',
    },
    card: {
        margin: 16,
        marginTop: 0,
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickAction: {
        alignItems: 'center',
        width: '22%',
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 12,
        color: colors.secondary,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});
