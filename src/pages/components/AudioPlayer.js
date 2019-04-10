import React from 'react';
import Video from 'react-native-video';
// import AsyncStorage from '@react-native-community/async-storage';
import PlayerStore from '../../stores/PlayerStore';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';
@observer
class AudioPlayer extends React.Component {
    static __instance = null;

    static seek(second) {
        AudioPlayer.__instance.__seek(second);
    }

    constructor(props) {
        super(props);
        if (!AudioPlayer.__instance) {
            AudioPlayer.__instance = this;
        }
        // AudioPlayer.__instance = this;
        reaction(
            () => PlayerStore.state.seekTime,
            seekTime => {
                this.__seek(seekTime);
            },
        );
    }

    // componentWillMount() {
    //     const { filePath, fileList = [] } = this.props;
    //     this.setState({
    //         filePath,
    //         fileList,
    //         currentIndex: fileList.findIndex(item => item.filePath === filePath),
    //     });
    // }

    // shouldComponentUpdate(nextProps) {
    //     // console.log('nextProps',nextProps.toString())
    //     return Object.keys(nextProps).length;
    // }

    __seek = second => {
        this.player.seek(second);
    };

    handleLoad = data => {
        PlayerStore.handleLoad(data);
    };

    handleProgress = data => {
        PlayerStore.handleProgress(data);
    };

    handleEnd = () => {
        PlayerStore.handleEnd();
    };

    // handleAudioBecomingNoisy = () => {
    //     this.setState({ paused: true });
    // };

    render() {
        // const {  onLoad, onProgress, onEnd } = this.props;
        // const { onLoad, onProgress } = this.props;
        // console.log(this.props);
        const { filePath, paused, repeat } = PlayerStore.state;
        return (
            <Video
                ref={ref => (this.player = ref)}
                audioOnly={true}
                // source={require('../../assets/city_of_star.m4a')}
                source={filePath ? { uri: 'file://' + filePath } : require('../../assets/city_of_star.m4a')}
                paused={paused}
                // volume={this.state.volume}
                // muted={this.state.muted}
                repeat={repeat}
                // rate={this.state.rate}
                playInBackground={true}
                // onLoadStart={this.loadStart}
                onLoad={this.handleLoad}
                onProgress={this.handleProgress}
                onEnd={this.handleEnd}
                // onAudioBecomingNoisy={this.handleAudioBecomingNoisy}
                onError={e => {
                    console.log(e);
                }}
            />
        );
    }
}

export default AudioPlayer;
