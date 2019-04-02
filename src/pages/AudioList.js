import React from 'react';
import { StyleSheet, View } from 'react-native';
import AudioList from './components/AudioList';
// import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

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
    handlePress = (filePath, fileList) => {
        this.props.navigation.push('Player', {
            filePath,
            fileList,
        });
    };
    render() {
        const { navigation } = this.props;
        const fileList = navigation.getParam('fileList', []);
        return (
            <View style={styles.container}>
                <View style={{ height: 8 }} />
                <AudioList fileList={fileList} onPress={this.handlePress} />
                <View style={{ height: 16, backgroundColor: 'transparent' }} />
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
