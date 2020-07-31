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

import API from './services/api';

export default function Login(){

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSignInPress = async () => {

		if(password.length < 6){ 

			setError('The password needs to have at least 6 chars'); 

		}else{

			const response = await API.login({ username, password });
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

			{ error.length !== 0 && <Text> { error } </Text> }

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
	  backgroundColor: 'darkviolet',
	},
	button: {
		fontSize: 16
	}

});


