import React from 'react';
import { Dimensions, StyleSheet, View, ImageBackground, Text, TouchableOpacity, Button } from 'react-native';
import TouchableImage from './components/TouchableImage';
import Video from 'react-native-video';
import Icon from '../assets/Icon';
import AudioList from './components/AudioList';

const SCREEN_WIDTH = Dimensions.get('window').width;
class Player extends React.Component {
    static navigationOptions = {
        title: 'Audio Plyer',
        headerStyle: {
            backgroundColor: '#0099CC',
        },
        headerTintColor: '#fff',
        headerBackTitle: null,
    };
    state = {
        filePath: '',
        fileList: [],
        paused: false,
        duration: 0.0,
        currentTime: 0.0,
        rate: 1,
        volume: 1,
        muted: false,
        repeat: false,
        mode: 'repeat', // repeat random
    };
    componentWillMount() {
        const { navigation } = this.props;
        const filePath = navigation.getParam('filePath');
        const fileList = navigation.getParam('fileList') || [];
        this.setState({
            filePath,
            fileList,
        });
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
        if (this.state.paused && Math.floor(this.state.currentTime) === this.state.duration) {
            this.player.seek(0);
        }
        this.setState({
            paused: !this.state.paused,
        });
    };
    handleSeek = second => {
        this.player.seek(this.state.currentTime + second);
    };

    handleNext = next => {
        let i = this.state.fileList.findIndex(item => item.filePath === this.state.filePath);
        console.log(i);
        if (i < 0) {
            return;
        }
        const len = this.state.fileList.length;
        const mode = this.state.mode;
        if (mode === 'repeat' || mode === 'repeatOnce') {
            if (i + next < 0 || i + next >= len) {
                return;
            }
            this.setState({
                filePath: this.state.fileList[i + next].filePath,
            });
        } else if (mode === 'random') {
            const r = Math.floor(Math.random() * len);
            this.setState({
                filePath: next === 1 ? this.state.fileList[r] : this.state.fileList[i + next],
            });
        }
    };

    handleMode = () => {
        const mode = this.state.mode;
        if (mode === 'repeat') {
            this.setState({
                mode: 'random',
                repeat: false,
            });
        } else if (mode === 'random') {
            this.setState({
                mode: 'repeatOnce',
                repeat: true,
            });
        } else if (mode === 'repeatOnce') {
            this.setState({
                mode: 'repeat',
                repeat: false,
            });
        }
    };

    handleProgressPress = e => {
        const pageX = e.nativeEvent.pageX;
        const seekTime = Math.floor(((pageX - 4) / (SCREEN_WIDTH - 8)) * this.state.duration);
        !!seekTime && this.player.seek(seekTime);
    };

    handleEnd = () => {
        this.setState({
            paused: true,
        });
    };
    render() {
        const flexCompleted = this.getCurrentTimePercentage() * 100;
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

        return (
            <View style={styles.container}>
                {/* <TouchableImage src={Icon.front} size={375} /> */}
                <ImageBackground source={require('../assets/backgroud.png')} style={{ flex: 1 }}>
                    {/* <AudioList fileList={this.state.fileList} /> */}
                    <Video
                        ref={ref => (this.player = ref)}
                        audioOnly={true}
                        // source={require('../assets/city_of_star.m4a')}
                        source={{ uri: 'file://' + this.state.filePath }}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        repeat={this.state.repeat}
                        rate={this.state.rate}
                        playInBackground={true}
                        // onLoadStart={this.loadStart} // Callback when video starts to load
                        onLoad={this.handleLoad} // Callback when video loads
                        onProgress={this.handleProgress} // Callback every ~250ms with currentTime
                        onEnd={this.handleEnd} // Callback when playback finishes
                        // onError={this.videoError} // Callback when video cannot be loaded
                        style={styles.audio}
                    />

                    <View style={styles.controlWrapper}>
                        <Button
                            title={this.state.mode}
                            onPress={() => {
                                this.handleMode();
                            }}
                        />

                        <View style={styles.controls}>
                            <TouchableImage
                                src={Icon.prev}
                                size={36}
                                onPress={() => {
                                    this.handleNext(-1);
                                }}
                            />
                            <View style={{ marginHorizontal: 16 }}>
                                <TouchableImage src={this.state.paused ? Icon.play : Icon.pause} size={48} onPress={this.handlePlay} />
                            </View>
                            <TouchableImage
                                src={Icon.next}
                                size={36}
                                onPress={() => {
                                    this.handleNext(1);
                                }}
                            />
                        </View>
                        <View style={styles.seekWrapper}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.handleSeek(-10);
                                }}
                            >
                                <View style={styles.seek}>
                                    <Text style={styles.seekText}>-10S</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginLeft: 48 }}
                                onPress={() => {
                                    this.handleSeek(10);
                                }}
                            >
                                <View style={styles.seek}>
                                    <Text style={styles.seekText}>+10S</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity activeOpacity={1} style={styles.progress} onPress={this.handleProgressPress}>
                            <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
                            <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    audio: {
        // height: 150,
        // width: 300,
        backgroundColor: '#fff',
    },
    controlWrapper: {
        borderRadius: 4,
        position: 'absolute',
        bottom: 44,
        left: 4,
        right: 4,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    seekWrapper: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    seek: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#5E5E66',
    },
    seekText: {
        fontSize: 16,
        color: '#8D8E99',
        fontWeight: '700',
    },
    progress: {
        marginTop: 12,
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
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
});

export default Player;
