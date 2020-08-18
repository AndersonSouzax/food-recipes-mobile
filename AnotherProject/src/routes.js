import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import Login from './login';
// import SignUp from './pages/signUp';
// import Main from './pages/main';

function Main(){
	return <> <p>Main</p> </>;
}

const Stack = createStackNavigator();

export default function Routes () {

	const [user, setUser] = useState({ loading : true, stored : null, error : '' });

	useEffect(() => {

		const seach = async () => {

			try {

	    	const value = await AsyncStorage.getItem('FoodRecipeToken');

		    if(value !== null) {
		    	const token = JSON.parse(value);
		      setUser({ ...user, loading : false, stored : token });
		    }else{
		    	setUser({ ...user, loading : false });
		    }
		  } catch(e) {
		    setUser({...user, loading : false, error : 'Exception on AsyncStorage'});
		  }
		}

	seach();

	}, []);

	if(user.loading){
		return ( 
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text>Loading...</Text>
			</View>
		);
	}

	return ( 
		<NavigationContainer>
		  <Stack.Navigator>
		    { user.stored === null ? ( 
					<Stack.Screen name="Login" component={Login} 
						message={ user.error ? user.error : null }/>
	 				) : (
	 					<Stack.Screen name="Main" component={Main}/>
	 				) } 
		  </Stack.Navigator>
		</NavigationContainer>
	);
 };