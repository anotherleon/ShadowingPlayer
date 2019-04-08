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
import TouchableImage from './components/TouchableImage';
import AudioPlayer from './components/AudioPlayer';
import Icon from '../assets/Icon';
import { second2ms } from '../utils/formatDate';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
        const filePath = navigation.getParam('filePath');
        const fileList = navigation.getParam('fileList') || [];
        let currentIndex = fileList.findIndex(item => item.filePath === filePath);
        this.setState({
            filePath,
            fileList,
            currentIndex,
        });
        // console.log('new Video======', new Video())
        if (AudioPlayer.instance) {
            AudioPlayer.setProps({
                fileList,
                onProgress: this.handleProgress,
                onLoad: this.handleLoad,
            });
            AudioPlayer.setFilePath(filePath, currentIndex);
        }
    }
    handleLoad = data => {
        this.setState({ duration: Math.floor(data.duration) });
    };
    handleProgress = data => {
        this.setState({ currentTime: data.currentTime });
    };
    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        } else {
            return 0;
        }
    }
    handlePlay = () => {
        this.setState({
            paused: !this.state.paused,
        });
        AudioPlayer.play();
    };
    handleSeek = second => {
        AudioPlayer.seek(this.state.currentTime + second);
    };

    __next = next => {
        const { fileList, mode } = this.state;
        let i = this.state.currentIndex; // fileList.findIndex(item => item.filePath === this.state.filePath);
        if (i < 0) {
            return;
        }
        const len = fileList.length;
        if (mode === 'repeat' || mode === 'repeatOnce') {
            if (i + next < 0 || i + next > len) {
                this.setState({ paused: true });
                return;
            }
            if (i + next === len) {
                i = -1;
            }
            const currentIndex = i + next;
            const filePath = fileList[currentIndex].filePath;
            this.setState({ filePath, currentIndex });
            AudioPlayer.setFilePath(filePath, currentIndex);
            const fileName = fileList[currentIndex].name;
            this.props.navigation.setParams({ fileName });
        } else if (mode === 'random') {
            if (i + next < 0 && next === -1) {
                this.setState({ paused: true });
                return;
            }
            if (i + next === len) {
                i = -1;
            }
            let r = Math.floor(Math.random() * len);
            // 如果随机数还是当前的，就循环获取，直到不同
            while (r === i && len !== 1) {
                r = Math.floor(Math.random() * len);
            }
            const currentIndex = next === 1 ? r : i + next;
            const filePath = fileList[currentIndex].filePath;
            this.setState({ filePath, currentIndex });
            AudioPlayer.setFilePath(filePath, currentIndex);

            const fileName = fileList[currentIndex].name;
            this.props.navigation.setParams({ fileName });
        }
    };

    handleNext = () => {
        // AudioPlayer.next();
        this.__next(1);
    };

    handlePrev = () => {
        // AudioPlayer.prev();
        this.__next(-1);
    };

    handleMode = () => {
        const { mode, fileList } = this.state;
        if (mode === 'repeat') {
            this.setState({
                mode: 'random',
                modeDesc: '随机播放',
                repeat: fileList.length === 1 ? true : false,
            });
            AudioPlayer.setRepeat(false);
        } else if (mode === 'random') {
            this.setState({
                mode: 'repeatOnce',
                modeDesc: '单曲循环',
                repeat: true, // 只有在单曲循环时才重复播放
            });
            AudioPlayer.setRepeat(true);
        } else if (mode === 'repeatOnce') {
            this.setState({
                mode: 'repeat',
                modeDesc: '列表循环',
                repeat: false,
            });
            AudioPlayer.setRepeat(false);
        }
    };

    handleProgressPress = e => {
        const pageX = e.nativeEvent.pageX;
        const seekTime = Math.floor(((pageX - 64) / (SCREEN_WIDTH - 64 * 2)) * this.state.duration);
        !!seekTime && AudioPlayer.seek(seekTime);
    };

    handleEnd = () => {
        if (this.state.mode === 'repeatOnce') {
            return;
        }
        this.handleNext(1);
        // this.setState({
        //     paused: true,
        // });
    };

    handleQueue = () => {
        this.setState({ isShowQueue: true });
    };

    handleAudioBecomingNoisy = () => {
        this.setState({ paused: true });
    };

    render() {
        const flexCompleted = this.getCurrentTimePercentage() * 100;
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
        return (
            <View style={styles.container}>
                {!AudioPlayer.instance && (
                    <AudioPlayer fileList={this.state.fileList} filePath={this.state.filePath} onLoad={this.handleLoad} />
                )}
                <ImageBackground source={require('../assets/backgroud.png')} style={{ flex: 1 }}>
                    <View style={styles.controlWrapper}>
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
                            <Text style={{ color: '#fff', position: 'absolute', zIndex: 1 }}>{second2ms(this.state.currentTime)}</Text>
                            <TouchableOpacity activeOpacity={1} style={styles.progress} onPress={this.handleProgressPress}>
                                <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
                                <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
                            </TouchableOpacity>
                            <Text style={{ color: '#8D8E99', position: 'absolute', right: 0, zIndex: 1 }}>
                                {second2ms(this.state.duration)}
                            </Text>
                        </View>
                        <View style={styles.controls}>
                            <TouchableImage src={Icon[this.state.mode]} size={28} onPress={this.handleMode} />
                            <View style={{ marginHorizontal: 16, flexDirection: 'row' }}>
                                <TouchableImage src={Icon.prev} size={36} onPress={this.handlePrev} />
                                <View style={{ marginHorizontal: 28 }}>
                                    <TouchableImage src={this.state.paused ? Icon.play : Icon.pause} size={48} onPress={this.handlePlay} />
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
                {this.state.isShowQueue && (
                    <View style={styles.queue}>
                        <TouchableOpacity
                            onPress={this.handleMode}
                            activeOpacity={1}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 16,
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderBottomColor: '#EDEDF0',
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                backgroundColor: '#fff',
                            }}
                        >
                            <Image source={{ uri: Icon[this.state.mode + '_gray'] }} style={{ width: 24, height: 24, marginRight: 8 }} />
                            <Text style={{ fontSize: 14, color: '#5E5E66' }}>{`${this.state.modeDesc}(${
                                this.state.fileList.length
                            })`}</Text>
                        </TouchableOpacity>
                        <ScrollView style={{ paddingBottom: 24, backgroundColor: '#fff' }}>
                            {this.state.fileList.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        borderBottomColor: '#EDEDF0',
                                        paddingHorizontal: 16,
                                    }}
                                    onPress={() => {
                                        this.setState({
                                            filePath: item.filePath,
                                            currentIndex: index,
                                        });
                                        console.log(this.state.currentIndex, index);
                                        AudioPlayer.setFilePath(item.filePath);
                                        this.props.navigation.setParams({ fileName: item.name });
                                    }}
                                >
                                    {this.state.currentIndex === index && !this.state.paused && (
                                        <Image source={{ uri: Icon.audioSpectrum }} style={{ width: 14, height: 14, marginRight: 8 }} />
                                    )}
                                    <Text
                                        style={{
                                            lineHeight: 44,
                                            fontSize: 16,
                                            color: this.state.currentIndex === index && !this.state.paused ? '#d81e06' : '#1B1C33',
                                        }}
                                    >
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
