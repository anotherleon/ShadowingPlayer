import React from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";

var RNFS = require("react-native-fs");
let result = {};
const scanDirectory = async (path = RNFS.ExternalStorageDirectoryPath, callback) => {
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
    callback && callback(path);
    // if (path.includes("com") || path.includes("Android")) return [];
    const res = await RNFS.readDir(path);
    // .then(result =>
    //     Promise.all(result.map(item =>RNFS.stat(item.path)))
    // );
    res.forEach(item => {
        if (item.isFile()) {
            let type = getType(item.name);
            let path = getPath(item.path);
            console.log(type);
            if (type === "plist") {
                // result.push({
                //     path: getPath(item.path),
                //     name: item.name,
                //     type: type,
                // });
                const obj = {
                    path: path,
                    name: item.name,
                    type: type,
                };
                result[path] = Array.isArray(result[path]) ? result[path].push(obj) : [obj];
            }
        }
        if (item.isDirectory()) {
            scanDirectory(item.path);
        }
    });
    console.log(result);
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

function getType(name) {
    let i = name.lastIndexOf(".");
    return name.substr(i + 1);
}

function getPath(path) {
    let i = path.lastIndexOf("/");
    return path.substr(0, i);
}

export default class FolderList extends React.Component {
    state = {
        folder: [],
        scanPath: "",
    };
    componentWillMount() {
        // RNFS.ExternalStorageDirectoryPath '/storage/emulated/0/00leon' RNFS.DocumentDirectoryPath '/Users/wangliang/Library'
        scanDirectory(RNFS.MainBundlePath, path => {
            this.setState({
                scanPath: path,
            });
        }).then(res => {
            // console.log(res);
            this.setState({
                folder: result.values(),
            });
        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {/* <Text>{RNFS.ExternalStorageDirectoryPath}</Text> */}
                <Text>{this.state.scanPath}</Text>

                {/* <Text>{RNFS.ExternalDirectoryPath}</Text>
                <Text>{RNFS.PicturesDirectoryPath}</Text> */}
                {/* {this.renderItem()} */}
                <Item data={this.state.folder} />
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
        height: 300,
        width: 300,
    },
});
