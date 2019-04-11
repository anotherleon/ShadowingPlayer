import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from '../../assets/Icon';

class AudioList extends React.Component {
    render() {
        const { fileList, onPress = () => {} } = this.props;
        return (
            <ScrollView style={styles.container}>
                {fileList.map((item, index) => (
                    <TouchableOpacity
                        onPress={() => {
                            onPress(item.name, item.filePath, fileList);
                        }}
                        style={[
                            styles.listItemWrapper,
                            { borderBottomWidth: index === fileList.length - 1 ? 0 : StyleSheet.hairlineWidth },
                        ]}
                        key={index}
                    >
                        <Image source={{ uri: Icon.audio }} style={{ width: 44, height: 44, marginRight: 8 }} />
                        <View>
                            <Text style={{ fontSize: 14, color: '#1B1C33' }} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text style={{ fontSize: 10, color: '#8D8E99' }}>{(item.size / 1024 / 1024).toFixed(1) + 'M'}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    listItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#EDEDF0',
        backgroundColor: '#fff',
    },
});

export default AudioList;
