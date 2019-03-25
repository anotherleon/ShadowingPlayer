import React from "react";
import { StyleSheet, View, Text } from "react-native";

var RNFS = require("react-native-fs");

const scanDirectory = (path = RNFS.MainBundlePath) => {
    // const r = await RNFS.readDir(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //     .then(result => {
    //         return Promise.all(result.map(item => RNFS.stat(item.path)));
    //     })
    //     .then(res => {
    //         // console.log("GOT res==========", res);

    //         return res.map(item => {
    //             const i = item.path.lastIndexOf("/");
    //             return {
    //                 name: item.path.slice(i + 1),
    //                 isDirectory: item.isDirectory(),
    //                 children: item.isDirectory() ? scanDirectory(item.path) : [],
    //             };
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err.message, err.code);
    //     });

    return new Promise(resolve => {
        RNFS.readDir(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then(result => Promise.all(result.map(item => RNFS.stat(item.path))))
            .then(res => {
                resolve(
                    res.map(item => {
                        const i = item.path.lastIndexOf("/");
                        const c = scanDirectory(item.path);
                        console.log(c);
                        const children = item.isDirectory() ? c : [];
                        return {
                            name: item.path.slice(i + 1),
                            isDirectory: item.isDirectory(),
                            children,
                        };
                    }),
                );
            });
    });
};

const asyncReadFile = async callback => {
    const res = await scanDirectory();
    console.log(res);
    callback(res);
};

// const directory = scanDirectory();

export default class FolderList extends React.Component {
    state = {
        folder: [],
    };
    componentWillMount() {
        // console.log("xxxxxxxxxxxx", scanDirectory);
        // this.setState(async () => {
        //     const res = await scanDirectory();
        //     console.log("xxxxxxxxxxxx", res);
        //     return {
        //         folder: res,
        //     };
        // });
        asyncReadFile(res => {
            this.setState({
                folder: res,
            });
        });
        // this.setState({
        //     folder: asyncReadFile()
        // })

        // Correct
        // this.setState((prevState, props) => ({
        //     counter: prevState.counter + props.increment,
        // }));
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.folder.map((item, index) => (
                    <Text key={index}>{item.name + "\t是否是目录：" + item.isDirectory}</Text>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300,
        width: 300,
    },
});
