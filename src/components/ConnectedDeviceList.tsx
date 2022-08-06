import React, {FC, useCallback} from 'react';
import {
    FlatList,
    ListRenderItemInfo,
    Modal,
    SafeAreaView,
    Text,
    StyleSheet, View, TouchableOpacity,
} from 'react-native';
import {BluetoothPeripheral} from '../models/BluetoothPeripheral';
import CTAButton from './CTAButton';

type ConnectedDeviceListModalProps = {
    devices: BluetoothPeripheral[],
    callback : (id:string) => void
};
const ConnectedDeviceList: FC<ConnectedDeviceListModalProps> = props => {
    const {devices} = props;

    const DeviceItemListview  = ( item: ListRenderItemInfo<BluetoothPeripheral>) => {
        return (
            <TouchableOpacity
                onPress={() => props.callback(item.item.id)}
            >
                <View style={{
                    backgroundColor : '#5a5030',
                    paddingHorizontal : 10,
                    paddingVertical : 10,
                    marginBottom : 10
                }}>
                    <Text style={{
                        fontSize : 18,
                        fontWeight : "600",
                        color : "#FFFFFF"
                    }}>{item.item.name}</Text>
                    <Text>{item.item.id}</Text>
                </View>
            </TouchableOpacity>

        )
    }


    return (
        <View
        >
            <FlatList
                contentContainerStyle={{
                    marginHorizontal : 10
                }}
                data={props.devices}
                renderItem={DeviceItemListview}
            />

        </View>

    )
}

const modalStyle = StyleSheet.create({
    text : {
        color : '#FFFFFF'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#337e89',
    },
    modalFlatlistContiner: {
        flex: 1,
        justifyContent: 'center',
    },
    modalCellOutline: {
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
    },
    modalTitle: {
        flex: 1,
        backgroundColor: '#337e89',
    },
    modalTitleText: {
        marginTop: 40,
        fontSize: 30,
        fontWeight: 'bold',
        marginHorizontal: 20,
        textAlign: 'center',
    },
});
export default ConnectedDeviceList;
