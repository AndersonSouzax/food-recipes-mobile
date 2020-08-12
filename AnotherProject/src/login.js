import React, { useState } from 'react';

import { 
	StyleSheet, 
	TextInput, 
	ScrollView, 
	View, 
	Text, 
	StatusBar,
	Pressable 
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';

import API from './services/api';
import { useAsyncStorage } from './custom-hooks';

export default function Login({ navigation }){

	const user = useAsyncStorage();
	
	if(user){ 
		
		const resetAction = CommonActions.reset({
      index: 0,
      routes: [
        { name: 'Main' },
      ],
    });

		navigation.dispatch(resetAction);
	}

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSignInPress = async () => {

		if(password.length < 6){ 

			setError('The password needs to have at least 6 chars'); 

		}else{

			try{

				const response = await API.login({ username, password });

				await AsyncStorage.setItem('FoodRecipeToken', response.data.token);

		    const resetAction = CommonActions.reset({
		      index: 0,
		      routes: [
		        { name: 'Main' },
		      ],
		    });

    		navigation.dispatch(resetAction);

			}catch(e){
				setError('Login error, check your credentials and try again..');
			}	
		}
	};

	const handleUsername = (username) => {
		setUsername(username);
	};

	const handlePassword = (password) => {
		setPassword(password);
	};

	const handleKeyPress = () => {

		if(error.length !== 0){
			setError('');
		}

	};

	return (

		<View style={styles.container}>

			<TextInput onKeyPress={handleKeyPress} onChangeText={handleUsername} 
				value={username} />
			
			<TextInput onKeyPress={handleKeyPress} onChangeText={handlePassword} 
				value={password} />

			{ error.length !== 0 && <Text testID="error"> { error } </Text> }

			<Pressable onPress={handleSignInPress} disabled={!username && !password} 
				testID="loginButton">
				
				<Text style={styles.button}>Login</Text>

			</Pressable>

		</View>

	);
}

// Style

const styles = StyleSheet.create({

	container : {
		flex: 1,
	  alignItems: 'center',
	  justifyContent: 'center',
	  backgroundColor: 'white',
	},
	button: {
		fontSize: 16
	}

});


