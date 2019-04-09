import React from 'react';
import { View, Text, Image } from 'react-native';
import TouchableImage from './TouchableImage';
import Icon from '../../assets/Icon';
import AudioPlayer from './AudioPlayer';
import PlayerStore from '../../stores/PlayerStore';
import { observer } from 'mobx-react';
import { TouchableOpacity } from 'react-native-gesture-handler';

@observer
class AudioCtroller extends React.Component {
    state = {
        paused: true,
    };
    // handlePress = (fileName, filePath, fileList) => {
    //     this.props.navigation.push('Player', {
    //         fileName,
    //         filePath,
    //         fileList,
    //     });
    // };
    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                // onPress={this.handlePress}
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
                        哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈
                    </Text>
                </View>
                <View style={{ marginHorizontal: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableImage
                        src={Icon.prev}
                        size={32}
                        onPress={() => {
                            AudioPlayer.prev();
                        }}
                    />
                    <View style={{ marginHorizontal: 4 }}>
                        <TouchableImage
                            src={PlayerStore.state.paused ? Icon.play : Icon.pause}
                            size={44}
                            onPress={() => {
                                PlayerStore.play();
                            }}
                        />
                    </View>
                    <TouchableImage
                        src={Icon.next}
                        size={32}
                        onPress={() => {
                            AudioPlayer.next();
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

export default AudioCtroller;
