import React from "react";
import { StyleSheet, View, Text } from "react-native";

var RNFS = require("react-native-fs");

const scanDirectory = async (path = RNFS.PicturesDirectoryPath) => {
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
    const res = await RNFS.readDir(path).then(result =>
        Promise.all(result.map(item =>RNFS.stat(item.path)))
    );

    return await Promise.all(
        res.map(async item => {
            const i = item.path.lastIndexOf("/");
            return {
                name: item.path.slice(i + 1), // item.name
                isDirectory: item.isDirectory(),
                children: item.isDirectory() ? await scanDirectory(item.path) : [],
            };
        }),
    );
};

// const asyncReadFile = async callback => {
//     const res = await scanDirectory();
//     console.log(res);
//     callback(res);
// };

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
        // asyncReadFile(res => {
        //     this.setState({
        //         folder: res,
        //     });
        // });

        // Correct
        // this.setState((prevState, props) => ({
        //     counter: prevState.counter + props.increment,
        // }));

        scanDirectory('/storage/emulated/0/00leon').then(res => {
            console.log(res);
            this.setState({
                folder: res,
            });
        });
    }

    renderItem = () => {
        const dir = [];
        {
            this.state.folder.map((item, index) => <Text key={index}>{item.name + "\t是否是目录：" + item.isDirectory}</Text>);
        }

        this.state.folder.reduce((acc, cur, index, array) => {
            acc.push(<Text key={index}>{cur.name}</Text>);
        }, []);
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>{RNFS.ExternalStorageDirectoryPath}</Text>
                {/* <Text>{RNFS.ExternalDirectoryPath}</Text>
                <Text>{RNFS.PicturesDirectoryPath}</Text> */}
                {/* {this.renderItem()} */}
                <Item data={this.state.folder} />
            </View>
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
