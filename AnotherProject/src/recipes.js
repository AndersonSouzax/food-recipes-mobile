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

import { Appbar } from 'react-native-paper';

import API from './services/api';

export default function Recipes({ navigation }){

	const [recipes, setRecipes] = useState(null);
	const [loading, setLoading] = useState({ loading: false, error: '', obj : '' });
	const [reload, setReload] = useState({ type : 'ALL' });
	const [stored, setStored] = useState(null);

	useEffect(() => {

		const getStorage = async () => {

			try {

	    	const value = await AsyncStorage.getItem('FoodRecipeToken');

		    if(value !== null) {

		    	const token = JSON.parse(value);

		      setStored(token);

		    }else{

		    	setLoading({ loading : false, obj : '', 
		    		error: 'Missing user token, reload the page!' });

		    }

		  } catch(e) {

		    setLoading({ loading : false, obj : '', 
		    	error: `Exception getting the token: ${e.message}. Reload the page` });

		  }
		};

		getStorage();

	}, []);

	// Function related to the same hook: recipes
	useEffect(() => {

		let mounted = true;

		const fetchAll = async () => { 

			if(loading.loading || stored === null){ return; }

			try{

				setLoading({ error : '', loading : true, 
					'obj' : reload.type === 'ALL' ? 'All Recipes' : 'Only Your Recipes'});

				let path = reload.type === 'ALL' 
					? '/recipe' 
					: `/recipe?user=${stored.id}`;

				const response = await API.request(path, 'get', stored.token, null);

				if(mounted){

					setLoading({ loading : false, obj : '', error: '' });

					setRecipes(response.data);

				}

			}catch(e){

				setLoading({ loading : false, obj : '', 
					error: `An error has occurred while getting recipes: ${e.message}` });

			}
		}

		fetchAll();

		//Avoid make changes on unmounted component...
		return () => mounted = false;

	}, [reload, stored]);

	const handleMy = () => { setReload({ type : 'MY_RECIPES' }); }

	const recipeRender = ({ item }) => (
  	<View>
    	<Text>{item.title}</Text>
  	</View>
	);

	return (
		<>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

				<Text>Lots and lots of recipes...</Text>

				{ 
					recipes && ( 
						recipes.length > 0 ?
							<FlatList testID="recipes-list" data={recipes} 
								renderItem={recipeRender} keyExtractor={ () => '_' + Math.random().toString(36).substr(2, 9) } /> 
						: 
							<Text> No recipes received for the token...</Text>
					)
				}

				{ loading.loading && <Text testID="loadiv"> Loading {loading.obj}...</Text> }
				{ loading.error && <Text testID="error"> { loading.error } </Text> }
			</View>

			<Appbar style={styles.bottom}>
		    <Appbar.Action testID="my-recipes" icon="mail" onPress={handleMy} />
		  </Appbar>
	  </>
	);
};

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

