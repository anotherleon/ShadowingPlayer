import Home from "./src/pages/Home";
import AudioList from "./src/pages/AudioList";
import Player from "./src/pages/Player";
import PlayerBasic from "./src/pages/PlayerBasic";
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator(
    {
        Home,
        AudioList,
        Player,
        PlayerBasic,
    },
    {
        initialRouteName: "Home",
    },
);

export default createAppContainer(AppNavigator);
