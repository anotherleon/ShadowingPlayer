import React from 'react';
import { StyleSheet, View } from 'react-native';
import AudioList from './components/AudioList';
import AudioCtroller from './components/AudioCtroller';

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
        const isShowCtroller = navigation.getParam('isShowCtroller');
        return (
            <View style={styles.container}>
                <View style={{ height: 8 }} />
                <AudioList fileList={fileList} onPress={this.handlePress} />
                <View style={{ height: 16, backgroundColor: 'transparent' }} />
                {/* {isShowCtroller && <AudioCtroller />} */}
                <AudioCtroller />
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