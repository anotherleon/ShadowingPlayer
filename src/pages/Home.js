import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Player from "./Player";
import PlayerFullScreen from "./PlayerFullScreen";
import PlayerBasic from "./PlayerBasic";
import FolderList from "./FolderList";

export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <FolderList />
                {/* <PlayerFullScreen /> */}
                {/* <PlayerBasic /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 44,
        backgroundColor: "#F5FCFF",
    },
});
