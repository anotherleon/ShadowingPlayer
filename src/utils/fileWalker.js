var RNFS = require('react-native-fs');

const fileWalker = async (path = RNFS.ExternalStorageDirectoryPath, dirName, callback) => {
    // RNFS.readDir(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //     .then(result => {
    //         return Promise.all(result.map(item => RNFS.stat(item.path)));
    //     })
    //     .then(res => {
    //         return res.map(item => {
    //             const i = item.path.lastIndexOf("/");
    //             return {
    //                 name: item.path.slice(i + 1),
    //                 isDirectory: item.isDirectory(),
    //                 children: item.isDirectory() ? scanDirectory(item.path) : [],
    //             };
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err.message, err.code);
    //     });

    // RNFS.readDir(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //     .then(result => Promise.all(result.map(item => RNFS.stat(item.path))))
    //     .then(res => {
    //         resolve(
    //             res.map(item => {
    //                 const i = item.path.lastIndexOf("/");
    //                 const c = scanDirectory(item.path);
    //                 console.log(c);
    //                 const children = item.isDirectory() ? c : [];
    //                 return {
    //                     name: item.path.slice(i + 1),
    //                     isDirectory: item.isDirectory(),
    //                     children,
    //                 };
    //             }),
    //         );
    //     });
    // RNFS.scanFile(RNFS.PicturesDirectoryPath ).then(console.log)
    // console.log(RNFS.DocumentDirectoryPath )
    // if (path.includes("com") || path.includes("Android")) return [];
    let result = {};
    const res = await RNFS.readDir(path);
    // .then(result =>
    //     Promise.all(result.map(item =>RNFS.stat(item.path)))
    // );
    // res.forEach(async item => {
    //     if (item.isFile()) {
    //         let type = getType(item.name);
    //         // let path = getPath(item.path);
    //         console.log(type);
    //         if (type === "plist") {
    //             // result.push({
    //             //     path: getPath(item.path),
    //             //     name: item.name,
    //             //     type: type,
    //             // });
    //             const obj = {
    //                 path: path,
    //                 name: item.name,
    //                 type: type,
    //             };
    //             // result[path] = Array.isArray(result[path]) ? result[path].push(obj) : [obj];
    //             result.push(obj);
    //         }
    //         console.log("result===========", result);
    //     }
    //     if (item.isDirectory()) {
    //         await scanDirectory(item.path);
    //     }
    // });
    // console.log(res.length);

    for (let item of res) {
        if (dirName === '/' && skipScan(item.name)) {
            continue;
        }
        let type = getType(item.name);
        // console.log(item);
        // if (item.isFile() && type === "plist") {
        if (item.isFile() && isAudio(type)) {
            const obj = {
                ...item,
                dirPath: path,
                dirName,
                filePath: item.path,
                type: type,
            };
            if (result[path]) {
                result[path].push(obj);
            } else {
                result[path] = [obj];
            }
        }
        if (item.isDirectory()) {
            const r = await fileWalker(item.path, item.name, callback);
            result = { ...result, ...r };
        }
        callback && callback(item.path);
    }

    return result;
    // console.log(result);
    // return await Promise.all(
    //     res.map(async item => {
    //         const i = item.path.lastIndexOf("/");
    //         console.log(item);
    //         return {
    //             name: item.name, // item.path.slice(i + 1),  item.name,
    //             children: item.isDirectory() ? await scanDirectory(item.path) : [],
    //         };
    //     }),
    // );
};

function isAudio(type) {
    return ['mp3', 'wma', 'wav', 'm4a', 'plist'].includes(type);
}

function getType(name) {
    let i = name.lastIndexOf('.');
    return name.substr(i + 1);
}

// function getPath(path) {
//     let i = path.lastIndexOf('/');
//     return path.substr(0, i);
// }

function skipScan(name) {
    const dirNameArr = ['Android', 'System', 'log', 'tencent', 'alipay', 'netease', 'codoonsports', 'Youdao'].map(item =>
        item.toLowerCase(),
    );
    if (dirNameArr.includes(name.toLowerCase())) {
        return true;
    }
    if (name.startsWith('com') || name.startsWith('.')) {
        return true;
    }
}

export default fileWalker;
