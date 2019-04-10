# GoodGoodStudyPlayer
一个学习语言专用的播放器



## 开发记录

### 配置环境
1. 安装必要的工具：Node、Watchman 和 React Native 命令行工具以及 JDK 和 Android Studio。
```js
brew install node
brew install watchman
// 设置 npm 镜像
npm config set registry https://registry.npm.taobao.org --global
npm config set disturl https://npm.taobao.org/dist --global
```
2. 安装JDK(必须的)
https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html

3. 安装  Android Studio
* 理论可以不安装，装这个主要为了安装 Android SDK

4. 安装 Android SDK
* 可以单独安装，但是一个个下载安装比较麻烦
> https://developer.android.com/studio/releases/sdk-tools

5. 配置环境变量
把一下代码加入 ~/.bash_profile，或者 ~/.zshrc
```js
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home
export PATH=$PATH:$JAVA_HOME/bin
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
```
> 参考  https://reactnative.cn/docs/getting-started/


### 打包
1. 生成一个签名密钥
```js
keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
``
2. 设置 gradle 变量
3. 测试应用的发行版本
* 手机打开usb调试模式
```js
adb devices
react-native run-android --variant=release
```

### 安装 react-navigation react-native-gesture-handler
安装的时候可以尝试使用 yarn install 安装，可以避免一些包依懒问题
修改 MainActivity.java 文件
```java
package com.swmansion.gesturehandler.react.example;

import com.facebook.react.ReactActivity;
+ import com.facebook.react.ReactActivityDelegate;
+ import com.facebook.react.ReactRootView;
+ import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Example";
  }

+  @Override
+  protected ReactActivityDelegate createReactActivityDelegate() {
+    return new ReactActivityDelegate(this, getMainComponentName()) {
+      @Override
+      protected ReactRootView createRootView() {
+       return new RNGestureHandlerEnabledRootView(MainActivity.this);
+      }
+    };
+  }
}
```
> https://reactnative.cn/docs/signed-apk-android/

## Can Not Play mp3 file on android (Version 4.4.0)
* 4.4.1 已修复
https://github.com/react-native-community/react-native-video/pull/1529