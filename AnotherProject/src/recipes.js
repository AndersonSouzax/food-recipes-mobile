import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import { 
	StyleSheet, 
	FlatList, 
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

import API from './services/api';

export default function Recipes({ navigation, userData }){

	const [recipes, setRecipes] = useState(null);
	const [loading, setLoading] = useState({ loading: false, error: '', obj : '' });
	const [reload, setReload] = useState({ type : 'ALL' });
	const [stored, setStored] = useState(userData);

	// Function related to the same hook: recipes
	useEffect(() => {

		const fetchAll = async () => { 

			if(loading.loading){ return; }

			try{

// 				setLoading({ error : '', loading : true, 
// 					'obj' : reload.type === 'ALL' ? 'All Recipes' : 'Only Your Recipes'});
// 
// 				let path = reload.type === 'ALL' 
// 					? '/recipe' 
// 					: `/recipe?user=${stored.id}`;
// 
// 				const response = await API.request({  });

				setRecipes([{ id: 1, title : 'Love'}]);

			}catch(e){

			}
		}

		fetchAll();

	}, [reload]);

	const recipeRender = ({ item }) => (
  	<View>
    	<Text>{item.title}</Text>
  	</View>
	);

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

			<Text>Lots and lots of recipes...</Text>

			{ 
				recipes && ( 
					recipes.length > 0 ?
						<FlatList testID="recipes-list" data={recipes} 
							renderItem={recipeRender} keyExtractor={(item, index) => 'recipe-${item.id}'} /> 
					: 
						<Text> No recipes received for the token...</Text>
				)
			}

			{ loading.loading && <Text> Loading {loading.obj}...</Text> }
			{ loading.error && <Text testID="error"> { loading.error } </Text> }
		</View>
	);
};

