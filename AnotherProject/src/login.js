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

export default function Login(){

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSignInPress = async () => {

		if(password.length < 6){ 

			setError('The password needs to have at least 6 chars'); 

		}else{


		}

	};

	const handleEmail = (email) => {
		setEmail(email);
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

			<TextInput onKeyPress={handleKeyPress} onChangeText={handleEmail} 
				value={email} />
			
			<TextInput onKeyPress={handleKeyPress} onChangeText={handlePassword} 
				value={password} />

			{ error.length !== 0 && <Text> { error } </Text> }

			<Pressable onPress={handleSignInPress} disabled={!email && !password} 
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


