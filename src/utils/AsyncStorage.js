import asyncstorage from '@react-native-community/async-storage';

const AsyncStorage = {
    setItem: async function(key, value) {
        if (typeof value !== undefined) {
            // try {
            //     await asyncstorage.setItem(key, JSON.stringify(value));
            // } catch (e) {}
            asyncstorage
                .setItem(key, JSON.stringify(value))
                .then()
                .catch(() => {});
        }
    },
    getItem: async function(key) {
        // try {
        //     return JSON.parse(await asyncstorage.getItem(key));
        // } catch (e) {}
        return asyncstorage
            .getItem(key)
            .then(value => JSON.parse(value))
            .catch(() => {});
    },
};
export default AsyncStorage;
