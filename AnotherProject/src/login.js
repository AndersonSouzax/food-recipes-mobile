import React, { useState } from 'react';

import { 
	StyleSheet, 
	TextInput, 
	ScrollView, 
	View,
	Image, 
	Text, 
	StatusBar,
	Pressable 
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';

import API from './services/api';

import { 
	title, 
	container, 
	button, 
	buttonTxt, 
	linkButton, 
	linkButtonTxt, 
	input
} from './styles';

export default function Login({ message, navigation }){

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(message ? message : '');

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

	const handleSignUpPress = () => { navigation.navigate('SignUp'); };

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

			<StatusBar hidden />

			<Image style={styles.logo} source={require('./images/tomato.png')} 
				resizeMode="contain" />

			<Text style={styles.title}> Food Recipes </Text>

			<TextInput onKeyPress={handleKeyPress} onChangeText={handleUsername} 
				value={username} style={styles.input} placeholder="email" />
			
			<TextInput onKeyPress={handleKeyPress} onChangeText={handlePassword} 
				value={password} style={styles.input} placeholder="password"/>

			{ error.length !== 0 && <Text testID="error"> { error } </Text> }

			<Pressable onPress={handleSignInPress} disabled={!username && !password} 
				testID="loginButton" style={styles.button}>
				
				<Text style={styles.buttonTxt}>Login</Text>

			</Pressable>

			<Pressable onPress={handleSignUpPress} testID="signupButton" 
				style={styles.linkButton}>
				
				<Text style={styles.linkButtonTxt}>Sign Up</Text>

			</Pressable>

		</View>

	);
}

// Style

const styles = StyleSheet.create({
	container: container,
	button: button,
	linkButton: linkButton,
	linkButtonTxt: linkButtonTxt,
	buttonTxt: buttonTxt,
	logo : {
		height: '30%',
  	marginBottom: 20,
	},
	title: title,
	input: input
});


