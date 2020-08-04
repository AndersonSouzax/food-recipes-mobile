import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './login';
// import SignUp from './pages/signUp';
// import Main from './pages/main';

const Stack = createStackNavigator();

export default function Routes () {
	return ( 
		<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
    );
 };