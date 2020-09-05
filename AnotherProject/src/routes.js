import 'react-native-gesture-handler';
import React, { 
	useState, useEffect, 
	createContext, useReducer, useMemo 
} from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import Login from './login';
import SignUp from './signup';
import Recipes from './recipes';
import SingleRecipe from './single-recipe';

const Stack = createStackNavigator();

export default function Routes () {

	const [user, dispatch] = useReducer((prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            stored: action.user,
            loading: false,
            error: action.error,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            loading: false,
            stored: action.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            stored: null,
          };
      }
    },
    {
      loading: true,
      error: '',
      stored: null,
    }
  );

	useEffect(() => {

		const seach = async () => {

			try {

	    	const value = await AsyncStorage.getItem('FoodRecipeToken');

		    if(value !== null) {
		    	const token = JSON.parse(value);
		      dispatch({ type: 'RESTORE_TOKEN', user: token, error : '' });
		    }else{
		    	dispatch({ type: 'RESTORE_TOKEN', user: null, error : '' });
		    }
		  } catch(e) {
		  	dispatch({ 
		  		type: 'RESTORE_TOKEN', user: null, error : 'Exception on AsyncStorage'
		  	});
		  }
		}

	seach();

	}, []);

	const authContext = useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

	if(user.loading){
		return ( 
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text>Loading... {user.error}</Text>
			</View>
		);
	}

	return ( 
		<NavigationContainer>
		  <Stack.Navigator screenOptions={{ headerShown: false }}>
		    { user.stored === null ? (
		    	<> 
						<Stack.Screen name="Login" component={Login}
							initialParams={{ message: user.error ? user.error : null }}/>
						<Stack.Screen name="SignUp" component={SignUp} />
					</>
	 				) : (
	 					<>
	 						<Stack.Screen name="Recipes" component={Recipes} />
	 						<Stack.Screen name="SingleRecipe" component={SingleRecipe} />
	 					</>
	 				) } 
		  </Stack.Navigator>
		</NavigationContainer>
	);
 };