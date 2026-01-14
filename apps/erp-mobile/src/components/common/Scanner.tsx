// apps/erp-mobile/src/components/common/Scanner.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Modal,
    TouchableOpacity,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ScannerProps {
    visible: boolean;
    onClose: () => void;
    onScan: (data: string) => void;
    scanType?: 'qr' | 'barcode';
    title?: string;
}

export const Scanner: React.FC<ScannerProps> = ({
    visible,
    onClose,
    onScan,
    scanType = 'qr',
    title = 'Escanear código',
}) => {
    const [flashOn, setFlashOn] = useState(false);
    const [scanning, setScanning] = useState(true);

    const handleSuccess = (e: any) => {
        if (!scanning) return;

        setScanning(false);
        onScan(e.data);

        // Reactivar escaneo después de 2 segundos
        setTimeout(() => {
            setScanning(true);
        }, 2000);
    };

    const toggleFlash = () => {
        setFlashOn(!flashOn);
    };

    if (!visible) return null;

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Icon name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity onPress={toggleFlash} style={styles.flashButton}>
                        <Icon
                            name={flashOn ? 'flashlight' : 'flashlight-off'}
                            size={24}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </View>

                <QRCodeScanner
                    onRead={handleSuccess}
                    flashMode={
                        flashOn
                            ? RNCamera.Constants.FlashMode.torch
                            : RNCamera.Constants.FlashMode.off
                    }
                    cameraStyle={styles.camera}
                    showMarker={true}
                    markerStyle={styles.marker}
                    reactivate={scanning}
                    reactivateTimeout={2000}
                    topContent={
                        <Text style={styles.instructions}>
                            Apunta la cámara al código {scanType === 'qr' ? 'QR' : 'de barras'}
                        </Text>
                    }
                    bottomContent={
                        <View style={styles.bottomContainer}>
                            <Text style={styles.hint}>
                                El escaneo se activará automáticamente
                            </Text>
                        </View>
                    }
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    closeButton: {
        padding: 8,
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    flashButton: {
        padding: 8,
    },
    camera: {
        flex: 1,
    },
    marker: {
        borderColor: '#3B82F6',
        borderRadius: 10,
        borderWidth: 2,
    },
    instructions: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        marginTop: 20,
    },
    bottomContainer: {
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    hint: {
        color: '#9CA3AF',
        textAlign: 'center',
        fontSize: 14,
    },
});
