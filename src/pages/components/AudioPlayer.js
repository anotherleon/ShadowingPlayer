import React from 'react';
// import { AsyncStorage } from 'react-native'react-native link @react-native-community/async-storage;
import Video from 'react-native-video';
import AsyncStorage from '@react-native-community/async-storage';
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

class AudioPlayer extends React.Component {
    static __instance = null;
    static play() {
        AudioPlayer.__instance.__play();
    }
    // static next() {
    //     AudioPlayer.__instance.__next(1);
    // }
    // static prev() {
    //     AudioPlayer.__instance.__next(-1);
    // }

    static seek(second) {
        AudioPlayer.__instance.__seek(second);
    }

    static setRepeat(repeat) {
        AudioPlayer.__instance.__setRepeat(repeat);
    }

    static setFilePath(path, currentIndex) {
        AudioPlayer.__instance.__setFilePath(path, currentIndex);
    }

    static get currentTime() {
        return AudioPlayer.__instance.state.currentTime;
    }
    static get duration() {
        return AudioPlayer.__instance.state.duration;
    }
    static setProps({ filePath, fileList, onProgress, onLoad }) {
        AudioPlayer.__instance.setState({
            fileList,
        });
        AudioPlayer.__instance.onProgress = onProgress;
        AudioPlayer.__instance.onLoad = onLoad;
    }

    constructor(props) {
        super(props);
        // if (!AudioPlayer.__instance) {
        //     AudioPlayer.__instance = this;
        // }
        AudioPlayer.__instance = this;
    }

    state = {
        filePath: '/',
        fileList: [],
        paused: true,
        duration: 0.0,
        currentTime: 0.0,
        rate: 1,
        volume: 1,
        muted: false,
        repeat: false,
        mode: 'repeat', // repeat repeatOnce random
        modeDesc: '列表循环',
        currentIndex: 0,
        isShowQueue: false,
    };

    componentWillMount() {
        const { filePath, fileList = [] } = this.props;
        this.setState({
            filePath,
            fileList,
            currentIndex: fileList.findIndex(item => item.filePath === filePath),
        });
    }

    // shouldComponentUpdate(nextProps) {
    //     // console.log('nextProps',nextProps.toString())
    //     return Object.keys(nextProps).length;
    // }

    __play = () => {
        if (this.state.paused && Math.floor(this.state.currentTime) === this.state.duration) {
            this.player.seek(0);
        }
        this.setState({
            paused: !this.state.paused,
        });
    };

    __seek = second => {
        this.player.seek(second);
    };

    __setRepeat = repeat => {
        this.setState({
            repeat: repeat,
        });
    };

    __setFilePath = (filePath, currentIndex) => {
        this.setState({
            filePath,
            currentIndex,
        });
        AsyncStorage.setItem('filePath', filePath);
    };

    __next = next => {
        const { fileList, mode } = this.state;
        let i = fileList.findIndex(item => item.filePath === this.state.filePath);
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
            const filePath = fileList[i + next].filePath;
            this.setState({ filePath, currentIndex: i + next });
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
        }
    };

    handleMode = () => {
        const { mode, fileList } = this.state;
        if (mode === 'repeat') {
            this.setState({
                mode: 'random',
                modeDesc: '随机播放',
                repeat: fileList.length === 1 ? true : false,
            });
        } else if (mode === 'random') {
            this.setState({
                mode: 'repeatOnce',
                modeDesc: '单曲循环',
                repeat: true, // 只有在单曲循环时才重复播放
            });
        } else if (mode === 'repeatOnce') {
            this.setState({
                mode: 'repeat',
                modeDesc: '列表循环',
                repeat: false,
            });
        }
    };

    handleLoad = data => {
        console.log('xxxxx handleLoad', AudioPlayer.__instance.onLoad);
        !!AudioPlayer.__instance.onLoad && AudioPlayer.__instance.onLoad(data);
        !!this.props.onLoad && this.props.onLoad(data);
        this.setState({ duration: Math.floor(data.duration) });
    };

    // handleProgress = data => {
    //     this.setState({ currentTime: data.currentTime });
    // };

    // handleProgressPress = e => {
    //     const pageX = e.nativeEvent.pageX;
    //     const seekTime = Math.floor(((pageX - 64) / (SCREEN_WIDTH - 64 * 2)) * this.state.duration);
    //     !!seekTime && this.player.seek(seekTime);
    // };

    handleEnd = () => {
        if (this.state.mode === 'repeatOnce') {
            return;
        }
        this.__next(1);
    };

    // handleQueue = () => {
    //     this.setState({ isShowQueue: true });
    // };

    handleAudioBecomingNoisy = () => {
        this.setState({ paused: true });
    };

    handleProgress = data => {
        !!AudioPlayer.__instance.onProgress && AudioPlayer.__instance.onProgress(data);
        this.setState({ currentTime: data.currentTime });
    };

    render() {
        // const {  onLoad, onProgress, onEnd } = this.props;
        // const { onLoad, onProgress } = this.props;
        // console.log(this.props);
        return (
            <Video
                ref={ref => (this.player = ref)}
                audioOnly={true}
                source={require('../../assets/city_of_star.m4a')}
                // source={{ uri: 'file://' + this.state.filePath}}  
                paused={this.state.paused}
                // volume={this.state.volume}
                // muted={this.state.muted}
                repeat={this.state.repeat}
                // rate={this.state.rate}
                playInBackground={true}
                // onLoadStart={this.loadStart}
                onLoad={this.handleLoad}
                onProgress={this.handleProgress}
                onEnd={this.handleEnd}
                onAudioBecomingNoisy={this.handleAudioBecomingNoisy}
                onError={(e)=>{
                    console.log(e)
                }}
            />
        );
    }
}

export default AudioPlayer;
