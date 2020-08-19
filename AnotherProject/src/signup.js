import React, { useState } from 'react';

import { 
	StyleSheet, 
	TextInput, 
	ScrollView, 
	View,
	Image,
	ImageBackground, 
	Text, 
	StatusBar,
	Pressable 
} from 'react-native';

import { 
	title, 
	container, 
	button, 
	buttonTxt, 
	linkButton, 
	linkButtonTxt, 
	input
} from './styles';

export default function SignUp({ navigation }){

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [repeat, setRepeat] = useState('');
	const [error, setError] = useState('');

	const handleKeyPress = () => {};

	const handleUsername = () => {};

	const handlePassword = () => {};

	const handlePasswordAGain = () => {};

	const handleSignUpPress = () => {};

	return (

		<View style={styles.container}>

			<StatusBar hidden />

			<ImageBackground source={require('./images/vegetables.jpg')} style={styles.backImage}>

				<Text style={styles.title}> Food Recipes </Text>

				<Text style={styles.subTitle}> 
					Sign up and start discovering a world of delicious foods to cook and eat with family
				</Text>

				<TextInput onKeyPress={handleKeyPress} onChangeText={handleUsername} 
					value={username} style={styles.input} placeholder="email" />
				
				<TextInput onKeyPress={handleKeyPress} onChangeText={handlePassword} 
					value={password} style={styles.input} placeholder="password"/>

				<TextInput onKeyPress={handleKeyPress} onChangeText={handlePasswordAGain} 
					value={repeat} style={styles.input} placeholder="repeat password"/>

				{ error.length !== 0 && <Text testID="error"> { error } </Text> }

				<Pressable onPress={handleSignUpPress} disabled={!username && !password && !repeat} 
					testID="signUpButton" style={styles.button}>
					
					<Text style={styles.buttonTxt}>Sign Up</Text>

				</Pressable>

	    </ImageBackground>

		</View>
	);
};

const styles = StyleSheet.create({
	container: container,
	title: title,
	input: input,
	button: button,
	buttonTxt: buttonTxt,
	subTitle: {
		fontFamily: 'cursive',
		fontSize: 22,
		marginBottom: 25,
		textAlign: 'center',
		color : 'blue'
	},
	backImage : {
		flex: 1,
		alignItems: 'center',
    resizeMode: "cover",
    justifyContent: "center",
	}
});