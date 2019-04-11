import React from 'react';
import { StyleSheet, View } from 'react-native';
import AudioList from './components/AudioList';
import AudioCtroller from './components/AudioCtroller';
import PlayerStore from '../stores/PlayerStore';
import { observer } from 'mobx-react';
@observer
class AudioListPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('dirName', '音频文件'),
            headerStyle: {
                backgroundColor: '#0099CC',
            },
            headerTintColor: '#fff',
            headerLeftContainerStyle: { marginLeft: 16 },
        };
    };
    handlePress = (fileName, filePath, fileList) => {
        this.props.navigation.push('Player', {
            fileName,
            filePath,
            fileList,
        });
    };
    render() {
        const { navigation } = this.props;
        const fileList = navigation.getParam('fileList', []);
        const { isShowController } = PlayerStore;
        return (
            <View style={styles.container}>
                <AudioList fileList={fileList} onPress={this.handlePress} />
                <View style={{ height: isShowController ? 64 : 16, backgroundColor: 'transparent' }} />
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

export default AudioListPage;
