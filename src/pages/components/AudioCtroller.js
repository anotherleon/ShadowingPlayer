import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import TouchableImage from './TouchableImage';
import Icon from '../../assets/Icon';
import PlayerStore from '../../stores/PlayerStore';
import AudioPlayer from './AudioPlayer';
import { observer } from 'mobx-react';

@observer
class AudioCtroller extends React.Component {
    handlePress = () => {
        this.props.onPress();
    };

    handlePlay = () => {
        PlayerStore.play();
        if (!PlayerStore.state.currentTime && PlayerStore.state.seekTime) {
            AudioPlayer.seek(PlayerStore.state.seekTime);
        }
    };

    handleNext = () => {
        PlayerStore.next(1);
    };

    handlePrev = () => {
        PlayerStore.next(-1);
    };

    render() {
        const { fileName, paused } = PlayerStore.state;
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.handlePress}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 48,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: '#ccc',
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Image source={{ uri: Icon.audio }} style={{ width: 44, height: 44, marginRight: 8 }} />
                    <Text style={{ flex: 1 }} numberOfLines={1}>
                        {fileName}
                    </Text>
                </View>
                <View style={{ marginHorizontal: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableImage src={Icon.prev} size={32} onPress={this.handlePrev} />
                    <View style={{ marginHorizontal: 4 }}>
                        <TouchableImage src={paused ? Icon.play : Icon.pause} size={44} onPress={this.handlePlay} />
                    </View>
                    <TouchableImage src={Icon.next} size={32} onPress={this.handleNext} />
                </View>
            </TouchableOpacity>
        );
    }
}

export default AudioCtroller;
