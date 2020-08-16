import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export const useAsyncStorage = () => {

	const [user, setUser] = useState(null);

	useEffect(() => {

		const seach = async () => {

			try {

		    const value = await AsyncStorage.getItem('FoodRecipeToken');

		    if(value !== null) {
		    	const token = JSON.parse(value);
		      setUser(token);
		    }else{
		    	setUser('error');
		    }
		  } catch(e) {
		    setUser('error');
		  }
		}

		seach();

	}, []);

	return user;

}