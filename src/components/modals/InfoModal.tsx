import React, {FC, useState} from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
type InfoModalProps = {
    message: string,
    callback : () => void
};
const InfoModal: FC<InfoModalProps> = props => {
    const [modalVisible, setModalVisible] = useState(true);

    return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Hello World!</Text>
                        <View
                            style={{
                                width : '100%',
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        <Text style={{
                            color:"black",
                            paddingVertical : 20
                        }}>{props.message ? props.message : "message" }</Text>
                        <Pressable
                           style={{
                               backgroundColor : 'rgba(0, 255, 0, 0.1)',
                               paddingVertical:5,
                               borderRadius : 10,
                               borderColor : "#00FF00",
                               borderWidth : 1,
                               paddingHorizontal : 30
                           }}
                            onPress={() =>{
                                props.callback()
                                setModalVisible(false)
                            }}
                        >
                            <Text style={{
                                color : "#00FF00"
                            }}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    modalView: {
        margin: 20,
        width:"60%",
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 20,
        paddingBottom : 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 1,
        shadowRadius: 19,
        elevation: 10
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "#000"
    }
});

export default InfoModal;
