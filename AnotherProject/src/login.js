import React, { useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

export default function Login(){

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (

		<View style={styles.container}>

			<TextInput onChangeText={text => setEmail(text)} value={email} />
			
			<TextInput onChangeText={text => setPassword(text)} value={password} />

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

});


