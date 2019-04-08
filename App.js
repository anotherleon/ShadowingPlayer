import Home from "./src/pages/Home";
import AudioListPage from "./src/pages/AudioListPage";
import Player from "./src/pages/Player";
import PlayerBasic from "./src/pages/PlayerBasic";
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator(
    {
        Home,
        AudioListPage,
        Player,
        PlayerBasic,
    },
    {
        initialRouteName: "Home",
    },
);

export default createAppContainer(AppNavigator);
