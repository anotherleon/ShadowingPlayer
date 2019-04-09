import { observable, computed, action } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';

class PlayerStore {
    @observable state = {
        filePath: '/',
        fileList: [],
        fileName: '',
        paused: true,
        duration: Infinity,
        currentTime: 0.0,
        rate: 1,
        volume: 1,
        muted: false,
        repeat: false,
        mode: 'repeat', // repeat repeatOnce random
        modeDesc: '列表循环',
        currentIndex: 0,
        // isShowQueue: false,
    };

    play = () => {
        if (this.state.paused && Math.floor(this.state.currentTime) === this.state.duration) {
            this.player.seek(0);
        }
        this.state.paused = !this.state.paused;
    };

    // __seek = second => {
    //     this.player.seek(second);
    // };

    // __setRepeat = repeat => {
    //     this.setState({
    //         repeat: repeat,
    //     });
    // };

    // __setFilePath = (filePath, currentIndex) => {
    //     this.setState({
    //         filePath,
    //         currentIndex,
    //     });
    //     AsyncStorage.setItem('filePath', filePath);
    // };

    @action
    next = next => {
        const { fileList, mode } = this.state;
        let i = fileList.findIndex(item => item.filePath === this.state.filePath);
        if (i < 0) {
            return;
        }
        const len = fileList.length;
        if (mode === 'repeat' || mode === 'repeatOnce') {
            if (i + next < 0 || i + next > len) {
                this.state.paused = true;
                return;
            }
            if (i + next === len) {
                i = -1;
            }
            this.state.filePath = fileList[i + next].filePath;
            this.state.fileName = fileList[i + next].name;
            this.state.currentIndex = i + next;
        } else if (mode === 'random') {
            if (i + next < 0 && next === -1) {
                this.state.paused = true;
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
            const fileName = fileList[currentIndex].name;
            this.state.filePath = filePath;
            this.state.fileName = fileName;
            this.state.currentIndex = currentIndex;
        }
    };

    handleMode = () => {
        const { mode, fileList } = this.state;
        if (mode === 'repeat') {
            this.state.mode = 'random';
            this.state.modeDesc = '随机播放';
            this.state.repeat = fileList.length === 1 ? true : false;
        } else if (mode === 'random') {
            this.state.mode = 'repeatOnce';
            this.state.modeDesc = '单曲循环';
            this.state.repeat = true;
        } else if (mode === 'repeatOnce') {
            this.state.mode = 'repeat';
            this.state.modeDesc = '列表循环';
            this.state.repeat = false;
        }
    };

    handleLoad = data => {
        this.state.duration = Math.floor(data.duration);
    };

    handleProgress = data => {
        this.state.currentTime = data.currentTime;
    };

    // // handleProgressPress = e => {
    // //     const pageX = e.nativeEvent.pageX;
    // //     const seekTime = Math.floor(((pageX - 64) / (SCREEN_WIDTH - 64 * 2)) * this.state.duration);
    // //     !!seekTime && this.player.seek(seekTime);
    // // };

    handleEnd = () => {
        if (this.state.mode === 'repeatOnce') {
            return;
        }
        this.next(1);
    };

    // // handleQueue = () => {
    // //     this.setState({ isShowQueue: true });
    // // };

    // handleAudioBecomingNoisy = () => {
    //     this.setState({ paused: true });
    // };

    // // handleProgress = data => {
    // //     !!AudioPlayer.__instance.onProgress && AudioPlayer.__instance.onProgress(data);
    // //     this.setState({ currentTime: data.currentTime });
    // // };

    handleQueueItem(filePath, currentIndex) {
        this.state.paused = false;
        this.state.filePath = filePath;
        this.state.currentIndex = currentIndex;
    }
}

export default new PlayerStore();
