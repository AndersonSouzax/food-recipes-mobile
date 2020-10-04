import React, { useState, useEffect } from 'react';

import {
	StyleSheet,
	View,
	Image,
	Text, 
	StatusBar,
	Pressable,
	ScrollView
} from 'react-native';

import { button, buttonTxt } from './styles';

import { 
	Appbar, TextInput, Menu, 
	Dialog, Portal, Paragraph, Button, Card, Title } from 'react-native-paper';

import {Picker} from '@react-native-community/picker';

import API from './services/api';

export default function SingleRecipe({ navigation, route }){

	const [menuVisible, setMenuVisible] = useState(false);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [editingRecipe, setEditingRecipe] = useState({ description : '' });
	const [loading, setLoading] = useState({ loading : false, error : '', act : '' });
	const [categories, setCategories] = useState([]);
	const [catMenuVisible, setCatMenuVisible] = useState(false);
	const [editing, setEditing] = useState(false);
	const [recipe, setRecipe] = useState(route.params.recipe);
	const [user, setUser] = useState(route.params.user);

	const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const openCatMenu = () => setCatMenuVisible(true);

  const closeCatMenu = () => setCatMenuVisible(false);

  const showDialog = () => {
  	closeMenu();
  	setDialogVisible(true);
  }

  const hideDialog = () => setDialogVisible(false);

	const cancelEdit = () => setEditing(false);

	const back = () => { navigation.goBack(); };

	const makeEditable = () => {
		closeMenu();
		setEditingRecipe(Object.assign({}, recipe));
		setEditing(true);
	};

	const titleHandleEditing = text => 
	  setEditingRecipe({ ...editingRecipe, title : text });

  const descriptionHandleEditing = text => 
    setEditingRecipe({ ...editingRecipe, description : text });

	useEffect(() => {

		if(!editing) { return };

		let mounted = true;

		const getCategories = async () => {

			try{

				const response = await API.request('/category', 'get', user.token, null);

				if(mounted){

					if(response.data){
					  setCategories(response.data);	
					}else{
						throw new Error('No Categories Received');
					}
				}
			}catch(e){
				setLoading({ ...loading, loading : false, 
					error : `Exception getting categories: ${e.message}.
					 Reload the page.`});
			}
		};

		getCategories();

		//Avoid make changes on unmounted component...
		return () => mounted = false;
		
	}, [editing]);

	const chooseCategory = (categoryId) => {

		if(!categories || categories.length === 0){ return; }

		setEditingRecipe({ ...editingRecipe,
			category : categories.find(x => x.id === categoryId)
		});
	};

	const handleDeleting = async () => {

		if(loading.loading){ return; }

		hideDialog();

		setLoading({ loading : true, act : 'Deleting', error : '' });

		try{

			const path = `/recipe/${recipe.id}`;
			
			//No response...
			const response = await API.request(path, 'delete', user.token, null);

			setLoading({ ...loading, loading : false });

			navigation.goBack();

		}catch(e){

			setLoading({ ...loading, loading : false, 
				error : 'Exception while deleting recipe' });
		}
	};

	const handleUpdateOrCreate = async () => {

		const operation = editingRecipe.id ? 'updating' : 'creating';

		setLoading({ loading : true, act : operation, error : '' });

		try{

			const path = editingRecipe.id ? `/recipe/${editingRecipe.id}` : '/recipe';

			const informations = Object.assign({}, editingRecipe);
			informations.user = user.id;
			informations.category = editingRecipe.category.id;

			const response = await API.request(path,
			 editingRecipe.id ? 'put' : 'post', user.token, informations);
			
			const message = '';

			if(response.data){
				setRecipe(response.data);
			}else{
				message = `${operation} operation succeeded, 
				  but the saved recipe wasn't sent as a response`;
			}

			setLoading({ loading : false, error : message });

			setEditing(false);

		}catch(e){
			console.log(e.message);
			setLoading({ ...loading, loading : false, 
				error : `Exception while ${operation} recipe: ${e.message}` });
		}

	};

	let thereIsCategories = categories && categories.length > 0;

	return (
		<>

			<Appbar.Header style={styles.appBar}>

	    	<Appbar.BackAction testID="backButton" onPress={() => { back(); }} />

	    	{

	    		user.id === recipe.user.id ?

			    	<Menu
						  onDismiss={closeMenu}
						  visible={menuVisible}
						  style={styles.menu}
						  anchor={
			    			<Appbar.Action testID="options" icon="dots-vertical"
			    				onPress={openMenu} style={styles.moreActions}
			    				disabled={editing}/>
						   }>
						  <Menu.Item testID="editReciple" icon="pen"
						  	title="Edit Recipe" onPress={makeEditable} />
						  <Menu.Item testID="deleteReciple" icon="fruit-cherries-off"
						  	title="Delete Recipe" onPress={showDialog} />
						</Menu>

	    		: <></>
	    	}


	    </Appbar.Header>
			
			{
				loading.error ? 
					<Text testID="errorText"> {loading.error} </Text> 
				: <></>
			}

	    {
	    	editing ? 

	    		<View style={styles.mainEditView}>

			    	<Pressable onPress={() => cancelEdit() }
							testID="cancelEditButton" style={styles.cancel}>
							
							<Text style={styles.cancelTxt}>Cancel</Text>

						</Pressable>

	    			<TextInput testID="title" type="outlined"
	    				value={editingRecipe.title} label="Recipe Title" 
	    				onChangeText={titleHandleEditing} style={styles.textArea}/>
			    	
			    	<Text style={{ alignSelf: 'center', color: '#EA1D2C' }}>Category: </Text>

			    	<Picker
			    		testID="categoryList"
			    		enabled={thereIsCategories}
						  style={styles.picker}
						  selectedValue={ 
						  	thereIsCategories ? 
						  	  editingRecipe.category ? 
						  	    editingRecipe.category.id : categories[0].id
						  	: 0
						  }
						  onValueChange={(itemValue, itemIndex) =>
						    chooseCategory(itemValue)
						  }>
						  {
						  	thereIsCategories ? 

					  	 	  categories.map((cat) => (
                    <Picker.Item
					  					label={cat.name} value={cat.id}
					  					key={() => '_' + Math.random()
											.toString(36)
											.substr(2, 9)
					  				}/>
					  			 )) 
					  	 	 :

						  	 <Picker.Item label="No Category" value={0}/>
						  }
						</Picker>

	    			<TextInput testID="description" type="outlined"
	    				value={editingRecipe.description} label="Recipe Description"
	    				multiline={true} onChangeText={descriptionHandleEditing}
	    				style={styles.textArea}/>

			    	<Pressable onPress={() => handleUpdateOrCreate()} disabled={
			    		!editingRecipe.title || 
			    		!editingRecipe.user || 
			    		!editingRecipe.category ||
			    		!editingRecipe.description ||
			    		loading.loading
			    		}
							testID="saveButton" style={styles.button}>
							
							<Text style={styles.buttonTxt}>Save</Text>

						</Pressable>

	    		</View>
	    		: 
	    		<View style={styles.mainView}>

	    			<Text selectable={true} style={styles.recTitle}>
	    				{ recipe.title }
	    			</Text>

	    			<Text style={styles.categoryName}>
	    				{ recipe.category ? recipe.category.name : 'No category' }
	    			</Text>

   			  	<Card style={styles.card}>
 				    	<Card.Cover source={ recipe.category && recipe.category.image ? 
 				    		{ uri: recipe.category.image } : require('./images/default_recipe.png') } />
 				  	</Card>

	    			<Text selectable={true} testID="descView" 
	    				style={styles.recDescription}>
	    				{ recipe.description }
	    			</Text>

	    		</View>
	    }
			
			<Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Delete Recipe</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
            	Are you sure you want to delete the recipe?
            	You will not be able to see it after this
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button testID="confirmDelete" onPress={handleDeleting}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      { 
      	loading.loading ? 
      		<Text testID="loadElement"> {loading.act} Recipe...</Text> :
      		<></> 
      	}
		</>
	);
}

const styles = StyleSheet.create({
	button : { 
		...button,
		position: 'relative',
		top: 30
	},
	cancel : {
		alignSelf : 'flex-end',
		marginBottom: 30,
		marginTop: 10
	},
	cancelTxt: {
		color : 'black',
		fontWeight: 'bold',
	  fontSize: 16,
	  textAlign: 'center',
	},
	recTitle:{
		fontWeight: 'bold',
		fontSize: 24,
		margin: 5,
	},
	categoryName: {
		fontSize: 16,
		marginVertical: 10,
		fontWeight: 'bold',
		color: '#EA1D2C'
	},
	recDescription:{
		fontSize: 16,
		marginTop: 10,
		width: '90%'
	},
	buttonTxt: buttonTxt,
  appBar: {
  	backgroundColor: '#EA1D2C',
  	justifyContent : 'space-between'
  },
  menu : {
    marginTop: '14%',
  },
  mainView:{
  	alignItems: 'center',
  	marginTop: 7
  },
  mainEditView: {
  	justifyContent : 'center',
  	padding: 10,
  },
  moreActions : {
  	color : 'white',
  },
  card : {
  	width : '90%'
  },
  textArea : {
  	backgroundColor: 'white',
  	marginBottom : 5
  },
  picker : {
  	height : 50,
  	width : '50%',
  	alignSelf: 'center',
  	marginVertical: 10,
  }
});