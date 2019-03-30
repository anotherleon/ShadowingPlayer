import React from "react";
import { StyleSheet, ScrollView, View, Text, Image,TouchableOpacity } from "react-native";
import Icon from "../assets/Icon";
// import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

class AudioList extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam("dirName", "音频文件"),
            headerStyle: {
                backgroundColor: "#0099CC",
            },
            headerTintColor: "#fff",
            headerLeftContainerStyle: { marginLeft: 16 },
        };
    };
    render() {
        const { navigation } = this.props;
        const fileList = navigation.getParam("fileList", []);
        return (
            <ScrollView style={{ paddingTop: 8 }}>
                {fileList.map((item, index) => (
                    <TouchableOpacity 
                    onPress={() =>
                        this.props.navigation.push("PlayerBasic", { // PlayerBasic PlayerFullScreen
                            filePath: item.filePath
                        })
                    }
                    style={styles.listItemWrapper} key={index}>
                        <Image source={{ uri: Icon.audio }} style={{ width: 44, height: 44, marginRight: 8 }} />
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listItemWrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#EDEDF0",
    },
});

export default AudioList;
