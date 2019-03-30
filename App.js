import React from "react";
import Home from "./src/pages/Home";
import FolderList from "./src/pages/FolderList";
import AudioList from "./src/pages/AudioList";
import PlayerFullScreen from "./src/pages/PlayerFullScreen";
import PlayerBasic from "./src/pages/PlayerBasic";
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator(
    {
        Home: Home,
        FolderList,
        AudioList,
        PlayerFullScreen,
        PlayerBasic,
    },
    {
        initialRouteName: "FolderList",
    },
);

export default createAppContainer(AppNavigator);
// export default App;
