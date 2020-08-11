import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export function useAsyncStorage(){

	const [user, setUser] = useState(null);

	useEffect(() => {

		async function seach(){

			try {

		    const value = await AsyncStorage.getItem('FoodRecipeToken');

		    if(value !== null) {
		    	const token = JSON.parse(value);
		      setUser(token);
		    }
		  } catch(e) {
		    setUser(null);
		  }
		}

		seach();

	});

	return user;

}