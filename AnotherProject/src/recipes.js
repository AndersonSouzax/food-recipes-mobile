import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';

import { 
	StyleSheet, 
	FlatList, 
	View,
	Image,
	Text, 
	StatusBar,
	Pressable,
} from 'react-native';

import { 
	title, 
	container, 
	button, 
	buttonTxt,
} from './styles';

import { Appbar, Menu } from 'react-native-paper';

import API from './services/api';
import { AuthContext } from './authcontext';

export default function Recipes({ route, navigation }){

	const { user } = route.params;

	const [recipes, setRecipes] = useState(null);
	const [loading, setLoading] = useState({ loading: false, error: '', obj : '' });
	const [reload, setReload] = useState({ type : 'ALL' });
	const [stored, setStored] = useState(user);
	const [menuVisible, setMenuVisible] = useState(false);

	const context = useContext(AuthContext);

// 	useEffect(() => {
// 
// 		const getStorage = async () => {
// 
// 			try {
// 
// 	    	const value = await AsyncStorage.getItem('FoodRecipeToken');
// 
// 		    if(value !== null) {
// 
// 		    	const token = JSON.parse(value);
// 
// 		      setStored(token);
// 
// 		    }else{
// 
// 		    	setLoading({ loading : false, obj : '', 
// 		    		error: 'Missing user token, reload the page!' });
// 
// 		    }
// 
// 		  } catch(e) {
// 
// 		    setLoading({ loading : false, obj : '', 
// 		    	error: `Exception getting the token: ${e.message}. Reload the page` });
// 
// 		  }
// 		};
// 
// 		getStorage();
// 
// 	}, []);

	// Function related to the same hook: recipes
	useEffect(() => {

		let mounted = true;

		const fetchAll = async () => { 

			if(loading.loading){ return; }

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

	const handleAll = () => { setReload({ type : 'ALL' }); }

	const handleLogout = async () => {

		try{

			await AsyncStorage.removeItem('FoodRecipeToken');

			context.signOut();

		}catch(e){
			setLoading({ loading: false, obj: '', 
				error: 'An error occurred while removing user token and logging out'});
		}
	}

	const navigateToSingle = (item) => {
  	navigation.navigate('SingleRecipe', {
  		recipe : item,
  		user : stored,
  	});
  }

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

	const recipeRender = ({ item }) => (
  	<View accessibilityLabel="A Recipe" onPress={ () => { navigateToSingle(item); } }>
    	<Text>{item.title}</Text>
  	</View>
	);

	return (
		<>

		<StatusBar hidden />

    <Appbar.Header style={styles.appBar}>

    	<Appbar.Content title="Food Recipes" style={styles.title}/>

    	<Menu
			  onDismiss={closeMenu}
			  visible={menuVisible}
			  anchor={
			     <Appbar.Action
			     	testID="user-menu"
			      disabled={loading.loading}
			      color="white"
			      icon="face"
			      onPress={openMenu}
			     />
			   }>
			  <Menu.Item testID="logout-prs" icon="undo" 
			  	title="Logout" onPress={handleLogout} />
			</Menu>

    </Appbar.Header>

			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

				{ 
					recipes && ( 
						recipes.length > 0 ?
							<FlatList testID="recipes-list" data={recipes} 
								renderItem={recipeRender} 
								keyExtractor={ () => '_' + Math.random()
								.toString(36)
								.substr(2, 9) 
							} />
						: 
							<Text> No recipes received for the token...</Text>
					)
				}

				{ loading.loading ? <Text testID="load-txt"> Loading {loading.obj}...</Text> : <></> }
				{ loading.error ? <Text testID="error"> { loading.error } </Text> : <></> }
			</View>

			<Appbar style={styles.bottom}>

				<Appbar.Action testID="all-recipes" icon="mail" 
					onPress={handleAll} disabled={loading.loading} />
		    <Appbar.Action testID="my-recipes" icon="mail" 
		    	onPress={handleMy} disabled={loading.loading} />

		  </Appbar>
	  </>
	);
};

const styles = StyleSheet.create({
  bottom: {
  	backgroundColor: '#EA1D2C',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  appBar: {
  	backgroundColor: '#EA1D2C',
  },
  title : {
  	fontFamily: 'cursive',
		fontWeight: 'bold',	
  }
});

