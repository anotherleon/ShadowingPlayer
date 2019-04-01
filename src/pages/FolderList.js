import React from "react";
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "../assets/Icon";
// import { TouchableOpacity } from "react-native-gesture-handler";

var RNFS = require("react-native-fs");
let result = {};
const scanDirectory = async (path = RNFS.ExternalStorageDirectoryPath, dirName) => {
    // RNFS.readDir(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //     .then(result => {
    //         return Promise.all(result.map(item => RNFS.stat(item.path)));
    //     })
    //     .then(res => {
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

    // RNFS.readDir(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //     .then(result => Promise.all(result.map(item => RNFS.stat(item.path))))
    //     .then(res => {
    //         resolve(
    //             res.map(item => {
    //                 const i = item.path.lastIndexOf("/");
    //                 const c = scanDirectory(item.path);
    //                 console.log(c);
    //                 const children = item.isDirectory() ? c : [];
    //                 return {
    //                     name: item.path.slice(i + 1),
    //                     isDirectory: item.isDirectory(),
    //                     children,
    //                 };
    //             }),
    //         );
    //     });
    // RNFS.scanFile(RNFS.PicturesDirectoryPath ).then(console.log)
    // console.log(RNFS.DocumentDirectoryPath )
    // if (path.includes("com") || path.includes("Android")) return [];
    const res = await RNFS.readDir(path);
    // .then(result =>
    //     Promise.all(result.map(item =>RNFS.stat(item.path)))
    // );
    // res.forEach(async item => {
    //     if (item.isFile()) {
    //         let type = getType(item.name);
    //         // let path = getPath(item.path);
    //         console.log(type);
    //         if (type === "plist") {
    //             // result.push({
    //             //     path: getPath(item.path),
    //             //     name: item.name,
    //             //     type: type,
    //             // });
    //             const obj = {
    //                 path: path,
    //                 name: item.name,
    //                 type: type,
    //             };
    //             // result[path] = Array.isArray(result[path]) ? result[path].push(obj) : [obj];
    //             result.push(obj);
    //         }
    //         console.log("result===========", result);
    //     }
    //     if (item.isDirectory()) {
    //         await scanDirectory(item.path);
    //     }
    // });
    // console.log(res.length);
    for (let item of res) {
        let type = getType(item.name);
        // console.log(item);
        // if (item.isFile() && type === "plist") {
        if (item.isFile() && isAudio(type)) {
            const obj = {
                dirPath: path,
                dirName,
                filePath: item.path,
                name: item.name,
                type: type,
            };
            // result.push(obj);
            if (Array.isArray(result[path])) {
                result[path].push(obj);
            } else {
                result[path] = [obj];
            }
        }
        if (item.isDirectory()) {
            await scanDirectory(item.path, item.name);
        }
    }

    return result;
    // console.log(result);
    // return await Promise.all(
    //     res.map(async item => {
    //         const i = item.path.lastIndexOf("/");
    //         console.log(item);
    //         return {
    //             name: item.name, // item.path.slice(i + 1),  item.name,
    //             children: item.isDirectory() ? await scanDirectory(item.path) : [],
    //         };
    //     }),
    // );
};

function isAudio(type) {
    return ["mp3", "mp4", "wma", "wav", "m4a"].includes(type);
}

function getType(name) {
    let i = name.lastIndexOf(".");
    return name.substr(i + 1);
}

function getPath(path) {
    let i = path.lastIndexOf("/");
    return path.substr(0, i);
}

export default class FolderList extends React.Component {
    static navigationOptions = {
        title: "本地音频",
        headerStyle: {
            backgroundColor: "#0099CC",
        },
        headerTintColor: "#fff",
        headerBackTitle: null,
    };
    state = {
        folder: [],
        scanPath: "",
    };
    componentWillMount() {
        // RNFS.ExternalStorageDirectoryPath RNFS.MainBundlePath '/storage/emulated/0/00leon' RNFS.DocumentDirectoryPath '/Users/wangliang/Library'
        scanDirectory("/storage/emulated/0/00leon", "/").then(res => {
            // console.log('/storage/emulated/0/00leon', res);
            this.setState({
                folder: {...res},
            });
        });
    }

    render() {
        // console.log(this.props)
        const folders = Object.keys(this.state.folder);
        return (
            <ScrollView style={styles.container}>
                {/* <Text>{RNFS.ExternalStorageDirectoryPath}</Text> */}
                {/* <Text>{this.state.scanPath}</Text> */}

                {folders.map((item, index) => (
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.push("AudioList", {
                                dirName: this.state.folder[item][0].dirName,
                                fileList: this.state.folder[item] // this.state.folder.filter(i => i.path === item.path),
                            })
                        }
                        style={styles.listItemWrapper}
                        key={index}
                    >
                        <Image source={{ uri: Icon.folderAudio }} style={{ width: 64, height: 64, marginRight: 8 }} />
                        <View>
                            {/* <Text>{this.state.folder[item]}</Text> */}
                            <Text>{this.state.folder[item][0].dirName}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                {/* <Text>{RNFS.ExternalDirectoryPath}</Text>
                <Text>{RNFS.PicturesDirectoryPath}</Text> */}
                {/* {this.renderItem()} */}
                {/* <Item data={this.state.folder} /> */}
            </ScrollView>
        );
    }
}

const Item = props => {
    return props.data.map((item, index) => (
        <View key={index}>
            <Text>{props.child ? "\t" + item.name : item.name}</Text>
            <Item data={item.children} child />
        </View>
    ));
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
        // height: 300,
        // width: 300,
    },
    listItemWrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#EDEDF0",
    },
});
