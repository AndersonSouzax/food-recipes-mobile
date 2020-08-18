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

			<Image source={require('./images/tomato.png')} resizeMode="contain" />

			<TextInput onKeyPress={handleKeyPress} onChangeText={handleUsername} 
				value={username} />
			
			<TextInput onKeyPress={handleKeyPress} onChangeText={handlePassword} 
				value={password} />

			{ error.length !== 0 && <Text testID="error"> { error } </Text> }

			<Pressable onPress={handleSignInPress} disabled={!username && !password} 
				testID="loginButton" style={styles.button}>
				
				<Text style={styles.buttonTxt}>Login</Text>

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
	  backgroundColor: '#FFFFFF',
	},
	button : {
		padding: '20px',
	  borderRadius: 5,
	  alignSelf: 'stretch',
	  margin: '15px',
	  marginHorizontal: '20px',
		backgroundColor: '#EA1D2C',
	},
	buttonTxt :{
		color: '#FFF',
	  fontWeight: 'bold',
	  fontSize: 16,
	  textAlign: 'center',
	},
	logo : {
		height: '30%',
  	marginBottom: '40px'
	}, 
	input : {
		paddingHorizontal: '20px',
	  paddingVertical: '15px',
	  borderRadius: 5,
	  backgroundColor: '#FFFFFF',
	  alignSelf: 'stretch',
	  marginBottom: '15px',
	  marginHorizontal: '20px',
	  fontSize: 16,
	}
});


