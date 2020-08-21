import React, { useState, useEffect } from 'react';

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

import { 
	title, 
	container, 
	button, 
	buttonTxt,
} from './styles';


export default function Recipes({ navigation }){

	const [recipes, setRecipes] = useState(null);

	
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Lots and lots of recipes...</Text>
		</View>
		);
};

