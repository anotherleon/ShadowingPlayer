import React from 'react';
import { Platform, StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observer } from 'mobx-react';

import Icon from '../assets/Icon';
import AudioCtroller from './components/AudioCtroller';
import AudioPlayer from './components/AudioPlayer';
import PlayerStore from '../stores/PlayerStore';

import fileWalker from '../utils/fileWalker';
import AsyncStorage from '../utils/AsyncStorage';

const RNFS = require('react-native-fs');
@observer
class Home extends React.Component {
    static navigationOptions = {
        title: '本地音频',
        headerStyle: {
            backgroundColor: '#0099CC',
        },
        headerTintColor: '#fff',
        headerBackTitle: null,
    };
    state = {
        directory: {},
        scanPath: '',
        loading: true,
        filePath: '',
    };

    componentWillMount() {
        // RNFS.ExternalStorageDirectoryPath RNFS.MainBundlePath '/storage/emulated/0/00leon' RNFS.DocumentDirectoryPath '/Users/wangliang/Library'
        fileWalker(Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.ExternalStorageDirectoryPath, '/', this.showScanPath).then(res => {
            this.setState({
                directory: { ...res },
                loading: false,
            });
            AsyncStorage.setItem('directory', res);
        });

        AsyncStorage.getItem('directory').then(res => {
            console.log('directory ==== \n', res);
            this.setState({
                directory: res,
            });
        });

        AsyncStorage.getItem('fileName').then(res => {
            PlayerStore.state.fileName = res;
        });

        AsyncStorage.getItem('filePath').then(res => {
            PlayerStore.state.filePath = res;
        });

        AsyncStorage.getItem('fileList').then(res => {
            PlayerStore.state.fileList = res;
        });

        AsyncStorage.getItem('seekTime').then(res => {
            PlayerStore.state.seekTime = res;
        });
    }

    componentWillUnmount() {
        PlayerStore.state.paused = true;
        AsyncStorage.setItem('fileName', PlayerStore.state.fileName);
        AsyncStorage.setItem('filePath', PlayerStore.state.filePath);
        AsyncStorage.setItem('seekTime', PlayerStore.state.currentTime);
    }

    showScanPath = path => {
        this.setState({
            scanPath: path,
        });
    };

    render() {
        // console.log(this.props)
        const directory = Object.keys(this.state.directory);
        const { isShowController } = PlayerStore;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    {this.state.loading && !directory.length && (
                        <View style={{ padding: 16, backgroundColor: '#fff' }}>
                            <Text>文件扫描中...</Text>
                            <Text>{this.state.scanPath}</Text>
                        </View>
                    )}
                    {directory.map((item, index) => (
                        <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.push('AudioListPage', {
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
                    <View style={{ height: isShowController ? 64 : 16, backgroundColor: 'transparent' }} />
                </ScrollView>
                <AudioPlayer />
                {isShowController && (
                    <AudioCtroller
                        onPress={() => {
                            this.props.navigation.push('Player', {
                                fileName: PlayerStore.state.fileName,
                                filePath: PlayerStore.state.filePath,
                                fileList: PlayerStore.state.fileList,
                            });
                        }}
                    />
                )}
            </SafeAreaView>
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

export default Home;
