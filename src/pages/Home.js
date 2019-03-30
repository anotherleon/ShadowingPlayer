import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Player from "./Player";
import PlayerFullScreen from "./PlayerFullScreen";
import PlayerBasic from "./PlayerBasic";
import FolderList from "./FolderList";
class Home extends Component {
    static navigationOptions = {
        title: "本地视频",
        headerStyle: {
            backgroundColor: "#0099CC",
        },
        headerTintColor: "#fff",
        // headerTitleStyle: {
        //     fontWeight: "bold",
        // },
    };

    render() {
        console.log(this.props);
        return (
            <View style={styles.container}>
                <FolderList/>
                {/* <PlayerFullScreen /> */}
                {/* <PlayerBasic /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Home;
