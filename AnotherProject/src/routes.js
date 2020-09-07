import 'react-native-gesture-handler';
import React, { 
	useState, 
	useEffect, 
	createContext, 
	useReducer, 
	useMemo 
} from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import Login from './login';
import SignUp from './signup';
import Recipes from './recipes';
import SingleRecipe from './single-recipe';

import { AuthContext } from './authcontext';

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

	const authenticationContext = useMemo(() => ({
      signIn: async data => {

        dispatch({ type: 'SIGN_IN', user: data });

      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {

        dispatch({ type: 'SIGN_IN', user: data });

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
			<AuthContext.Provider value={authenticationContext}>
			  <Stack.Navigator screenOptions={{ headerShown: false }}>
			    { user.stored === null ? (
			    	<> 
							<Stack.Screen name="Login" component={Login}
								initialParams={{ message: user.error ? user.error : null }}/>
							<Stack.Screen name="SignUp" component={SignUp} />
						</>
		 				) : (
		 					<>
		 						<Stack.Screen name="Recipes" component={Recipes} 
		 							initialParams={{ user : user.stored }}/>
		 						<Stack.Screen name="SingleRecipe" component={SingleRecipe} />
		 					</>
		 				) } 
			  </Stack.Navigator>
			</AuthContext.Provider>
		</NavigationContainer>
	);
 };