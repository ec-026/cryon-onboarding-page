import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import SettingsScreen from './screens/SettingsScreen';
import ArtistDashboard from './screens/ArtistDashboard';
import FanDashboard from './screens/FanDashboard';


type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    FanDashboard: undefined;
    ArtistDashboard: undefined;
    Settings: undefined;
};  

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
                <Stack.Screen name="FanDashboard" component={FanDashboard} options={{ title: 'Fan Dashboard' }} />
                <Stack.Screen name="ArtistDashboard" component={ArtistDashboard} options={{ title: 'Artist Dashboard' }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
