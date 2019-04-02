import React from 'react';
import { Platform, StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from '../assets/Icon';
// import { TouchableOpacity } from "react-native-gesture-handler";
import fileWalker from '../utils/fileWalker';
var RNFS = require('react-native-fs');

export default class Home extends React.Component {
    static navigationOptions = {
        title: '本地音频',
        headerStyle: {
            backgroundColor: '#0099CC',
        },
        headerTintColor: '#fff',
        headerBackTitle: null,
    };
    state = {
        directory: [],
        scanPath: '',
        loading: true,
    };
    componentWillMount() {
        // RNFS.ExternalStorageDirectoryPath RNFS.MainBundlePath '/storage/emulated/0/00leon' RNFS.DocumentDirectoryPath '/Users/wangliang/Library'
        fileWalker(Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.ExternalStorageDirectoryPath, '/', this.getCurPath).then(res => {
            this.setState({
                directory: { ...res },
                loading: false,
            });
        });
    }

    getCurPath = path => {
        this.setState({
            scanPath: path,
        });
    };

    render() {
        // console.log(this.props)
        const directory = Object.keys(this.state.directory);
        return (
            <ScrollView style={styles.container}>
                {!this.state.loading && <View style={{ height: 8, backgroundColor: '#fff' }} />}
                {this.state.loading && (
                    <View style={{ padding: 16, backgroundColor: '#fff' }}>
                        <Text>文件扫描中...</Text>
                        <Text>{this.state.scanPath}</Text>
                    </View>
                )}
                {directory.map((item, index) => (
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.push('AudioList', {
                                dirName: this.state.directory[item][0].dirName,
                                fileList: this.state.directory[item],
                            })
                        }
                        style={styles.listItemWrapper}
                        key={index}
                    >
                        <Image source={{ uri: Icon.folderAudio }} style={{ width: 64, height: 64, marginRight: 8 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, color: '#1B1C33' }} numberOfLines={1}>
                                {this.state.directory[item][0].dirName}
                            </Text>
                            <Text style={{ fontSize: 10, color: '#8D8E99' }}>{item}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                <View style={{ height: 16, backgroundColor: 'transparent' }} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#EDEDF0',
        backgroundColor: '#fff',
    },
});
