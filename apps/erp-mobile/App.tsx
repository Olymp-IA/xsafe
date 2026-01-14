import React, { useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    Text,
    View,
} from 'react-native';
import { syncManager } from './src/services/sync/syncManager';

function App(): JSX.Element {
    useEffect(() => {
        // Initialize sync service on app start
        syncManager.initialize();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0E0E0E' }}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#0E0E0E"
            />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#E0E0E0', fontSize: 24, fontWeight: 'bold' }}>
                    xSafe ERP Mobile
                </Text>
                <Text style={{ color: '#888888', marginTop: 10 }}>
                    Initializing services...
                </Text>
            </View>
        </SafeAreaView>
    );
}

export default App;
