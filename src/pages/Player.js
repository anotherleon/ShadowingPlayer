import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    ScrollView,
    Image,
    ImageBackground,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '../utils/AsyncStorage';

import TouchableImage from './components/TouchableImage';
import AudioPlayer from './components/AudioPlayer';
import PlayerStore from '../stores/PlayerStore';
import Icon from '../assets/Icon';
import { second2ms } from '../utils/formatDate';
import { observer } from 'mobx-react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

@observer
class Player extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('fileName', '播放器'),
            headerStyle: {
                backgroundColor: '#0099CC',
            },
            headerTintColor: '#fff',
            headerBackTitle: '',
        };
    };
    state = {
        filePath: '',
        fileList: [1, 2],
        paused: false,
        duration: Infinity,
        currentTime: 0.0,
        rate: 1,
        volume: 1,
        muted: false,
        repeat: false,
        mode: 'repeat', // repeatOnce random
        modeDesc: '列表循环',
        currentIndex: 0,
        isShowQueue: false,
    };
    componentWillMount() {
        const { navigation } = this.props;
        const fileName = navigation.getParam('fileName', '播放器');
        const filePath = navigation.getParam('filePath');
        const fileList = navigation.getParam('fileList') || [];
        let currentIndex = fileList.findIndex(item => item.filePath === filePath);
        // this.setState({
        //     filePath,
        //     fileList,
        //     currentIndex,
        // });

        PlayerStore.state.fileList = fileList;
        PlayerStore.state.filePath = filePath;
        PlayerStore.state.currentIndex = currentIndex;
        this.handlePlay();

        AsyncStorage.setItem('fileName', fileName);
        AsyncStorage.setItem('filePath', filePath);
        AsyncStorage.setItem('fileList', fileList);

        // console.log('new Video======', new Video())
        // if (AudioPlayer.instance) {
        //     AudioPlayer.setProps({
        //         fileList,
        //         onProgress: this.handleProgress,
        //         onLoad: this.handleLoad,
        //     });
        //     AudioPlayer.setFilePath(filePath, currentIndex);
        // }
    }
    handleLoad = data => {
        this.setState({ duration: Math.floor(data.duration) });
    };
    handleProgress = data => {
        this.setState({ currentTime: data.currentTime });
    };

    handlePlay = () => {
        PlayerStore.play();
        if (!PlayerStore.state.currentTime && PlayerStore.state.seekTime) {
            AudioPlayer.seek(PlayerStore.state.seekTime);
        }
    };
    handleSeek = second => {
        AudioPlayer.seek(PlayerStore.state.currentTime + second);
    };

    handleNext = () => {
        PlayerStore.next(1);
        this.setNavTitle(PlayerStore.state.fileName);
    };

    handlePrev = () => {
        PlayerStore.next(-1);
        this.setNavTitle(PlayerStore.state.fileName);
    };

    handleMode = () => {
        PlayerStore.handleMode();
    };

    handleProgressTouch = e => {
        const pageX = e.nativeEvent.pageX;
        const seekTime = Math.floor(((pageX - 64) / (SCREEN_WIDTH - 64 * 2)) * PlayerStore.state.duration);
        PlayerStore.state.seekTime = seekTime;
        // !!seekTime && AudioPlayer.seek(seekTime);
    };

    handleQueue = () => {
        this.setState({ isShowQueue: true });
    };

    handleQueueItem = (item, index) => {
        PlayerStore.handleQueueItem(item.filePath, index);
        this.setNavTitle(item.name);
    };

    setNavTitle = title => {
        this.props.navigation.setParams({ fileName: title });
    };

    render() {
        const { fileList, paused, mode, modeDesc, currentIndex, duration, currentTime } = PlayerStore.state;
        const flexCompleted = getCurrentTimePercentage(currentTime, duration) * 100;
        const flexRemaining = (1 - getCurrentTimePercentage(currentTime, duration)) * 100;
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/backgroud.png')} style={{ flex: 1 }}>
                    <View style={styles.controlWrapper}>
                        {/* 播放控制：前进、后退 */}
                        <View style={styles.seekWrapper}>
                            <TouchableOpacity
                                style={styles.seek}
                                onPress={() => {
                                    this.handleSeek(-10);
                                }}
                            >
                                <Text style={styles.seekText}>-10S</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.seek, { marginLeft: 48 }]}
                                onPress={() => {
                                    this.handleSeek(10);
                                }}
                            >
                                <Text style={styles.seekText}>+10S</Text>
                            </TouchableOpacity>
                        </View>
                        {/* 进度条 */}
                        <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#fff', position: 'absolute', zIndex: 1 }}>{second2ms(currentTime)}</Text>
                            <TouchableOpacity activeOpacity={1} style={styles.progress} onPress={this.handleProgressTouch}>
                                <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
                                <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
                            </TouchableOpacity>
                            <Text style={{ color: '#8D8E99', position: 'absolute', right: 0, zIndex: 1 }}>{second2ms(duration)}</Text>
                        </View>
                        {/* 播放控制按钮 */}
                        <View style={styles.controls}>
                            <TouchableImage src={Icon[mode]} size={28} onPress={this.handleMode} />
                            <View style={{ marginHorizontal: 16, flexDirection: 'row' }}>
                                <TouchableImage src={Icon.prev} size={36} onPress={this.handlePrev} />
                                <View style={{ marginHorizontal: 28 }}>
                                    <TouchableImage src={paused ? Icon.play : Icon.pause} size={48} onPress={this.handlePlay} />
                                </View>
                                <TouchableImage src={Icon.next} size={36} onPress={this.handleNext} />
                            </View>
                            <TouchableImage src={Icon.list} size={32} onPress={this.handleQueue} />
                        </View>
                    </View>
                </ImageBackground>
                {/* 遮罩层 */}
                {this.state.isShowQueue && (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({ isShowQueue: false });
                        }}
                    >
                        <View style={styles.musk} />
                    </TouchableWithoutFeedback>
                )}
                {/* 播放列表 */}
                {this.state.isShowQueue && (
                    <View style={styles.queue}>
                        <TouchableOpacity onPress={this.handleMode} activeOpacity={1} style={styles.listTitle}>
                            <Image source={{ uri: Icon[mode + '_gray'] }} style={{ width: 24, height: 24, marginRight: 8 }} />
                            <Text style={{ fontSize: 14, color: '#5E5E66' }}>{`${modeDesc}(${fileList.length})`}</Text>
                        </TouchableOpacity>
                        {/* 播放列表内容 */}
                        <ScrollView style={{ paddingBottom: 24, backgroundColor: '#fff' }}>
                            {fileList.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.listItem}
                                    onPress={() => {
                                        this.handleQueueItem(item, index);
                                    }}
                                >
                                    {currentIndex === index && (
                                        <Image source={{ uri: Icon.audioSpectrum }} style={{ width: 14, height: 14, marginRight: 8 }} />
                                    )}
                                    <Text style={[styles.listText, { color: currentIndex === index ? '#d81e06' : '#1B1C33' }]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>
        );
    }
}

function getCurrentTimePercentage(currentTime, duration) {
    if (currentTime > 0) {
        return parseFloat(currentTime) / parseFloat(duration);
    }
    return 0;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    controlWrapper: {
        // borderRadius: 4,
        position: 'absolute',
        bottom: 44,
        left: 16,
        right: 16,
    },
    controls: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seekWrapper: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    seek: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#5E5E66',
    },
    seekText: {
        fontSize: 12,
        color: '#8D8E99',
        fontWeight: '700',
    },
    progress: {
        marginHorizontal: 48,
        flex: 1,
        flexDirection: 'row',
        borderRadius: 4,
        borderColor: '#5E5E66',
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 20,
        backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
        height: 20,
        backgroundColor: '#2C2C2C',
    },
    queue: {
        position: 'absolute',
        zIndex: 2,
        maxHeight: SCREEN_HEIGHT * 0.62,
        bottom: 0,
        left: 0,
        right: 0,
        // backgroundColor: '#fff',
    },
    listTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EDEDF0',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: '#fff',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EDEDF0',
        paddingHorizontal: 16,
    },
    listText: {
        lineHeight: 44,
        fontSize: 16,
    },
    musk: {
        position: 'absolute',
        zIndex: 1,
        flex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
});

export default Player;
