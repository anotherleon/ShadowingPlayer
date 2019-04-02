import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

class TouchableImage extends React.Component {
    render() {
        return (
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={this.props.onPress}
            >
                <Image
                    source={{
                        uri: this.props.src,
                    }}
                    style={{ width: this.props.size || 22, height: this.props.size || 22 }}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        );
    }
}

export default TouchableImage;
