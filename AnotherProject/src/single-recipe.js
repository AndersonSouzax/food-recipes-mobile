import React, { useState, useEffect } from 'react';

import {
	StyleSheet,
	View,
	Image,
	Text, 
	StatusBar,
	Pressable,
} from 'react-native';

import { button, buttonTxt } from './styles';

import { 
	Appbar, TextInput, Menu, 
	Dialog, Portal, Paragraph, Button } from 'react-native-paper';

import API from './services/api';

export default function SingleRecipe({ navigation, route }){

	const [menuVisible, setMenuVisible] = useState(false);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [editingRecipe, setEditingRecipe] = useState({ description : '' });
	const [loading, setLoading] = useState({ loading : false, error : '', act : '' });
	const [categories, setCategories] = useState([]);
	const [catMenuVisible, setCatMenuVisible] = useState(false);
	const [editing, setEditing] = useState(false);

	const { recipe, user } =  route.params;

	const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const openCatMenu = () => setCatMenuVisible(true);

  const closeCatMenu = () => setCatMenuVisible(false);

  const showDialog = () => {
  	closeMenu();
  	setDialogVisible(true);
  }

  const hideDialog = () => setDialogVisible(false);

	const back = () => { navigation.goBack(); };

	const makeEditable = () => {
		closeMenu();
		setEditing(true);
		setEditingRecipe(Object.assign({}, recipe));
	};

	const handleEditing = (event) => {

    const name = event.target.testID;

    setEditingRecipe({ ...editingRecipe, [name]: event.target.value });

	};

	useEffect(() => {

		if(!editing) { return };

		let mounted = true;

		const getCategories = async () => {

			try{

				const response = await API.request('/category', 'get', user.token, null);

				if(mounted){

					setCategories(response.data);

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

	const chooseCategory = (category) => {
		setEditingRecipe({ ...editingRecipe, category : category });
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

		hideDialog();

		const operation = recipe.id ? 'updating' : 'creating';

		setLoading({ loading : true, act : operation, error : '' });

		try{

			const path = recipe.id ? `/recipe/${recipe.id}` : '/recipe' ;

			const response = await API.request(path,
			 recipe.id ? 'put' : 'post', user.token, editingRecipe);

			if(response.data){
				recipe = response.data;
			}

			setEditingRecipe(null);

		}catch(e){
			setLoading({ ...loading, loading : false, 
				error : `Exception while ${operation} recipe: ${e.message}` });
		}

	};

	return (
		<>

			<Appbar.Header style={styles.appBar}>

	    	<Appbar.BackAction testID="backButton" onPress={() => { back(); }} />


	    	<Menu
				  onDismiss={closeMenu}
				  visible={menuVisible}
				  style={styles.menu}
				  disabled={editingRecipe !== null}
				  anchor={
	    			<Appbar.Action testID="options" icon="dots-vertical"
	    				onPress={openMenu} />
				   }>
				  <Menu.Item testID="editReciple" icon="pen"
				  	title="Edit Recipe" onPress={makeEditable} />
				  <Menu.Item testID="deleteReciple" icon="fruit-cherries-off"
				  	title="Delete Recipe" onPress={showDialog} />
				</Menu>

	    </Appbar.Header>

	    {
	    	editingRecipe !== null ? 

	    		<View style={styles.mainView}>

	    			<TextInput testID="description" type="flat"
	    				value={editingRecipe.description} label="Recipe Description"
	    				multiline={true} onChangeText={handleEditing}/>
			    	
			    	<Menu
						  onDismiss={closeCatMenu}
						  visible={catMenuVisible}
						  style={styles.menu}
						  disabled={!categories || categories.length === 0}
						  anchor={
					  	  <Button icon="pen" mode="outlined" onPress={() => openCatMenu()}
					  	  	testID="catSelectButton">
  								{ editingRecipe.category ? editingRecipe.category.name : 'Choose a Category' }
								</Button>
						   }>

						  {
						  	categories && categories.length > 0 ?
						  		(
						  			categories.map((x, index) => {
						  				return (
						  					<Menu.Item
						  					testID={"cat-" + index}
						  					title={x.title} onPress={() => chooseCategory(x)}
						  					key={() => '_' + Math.random()
													.toString(36)
													.substr(2, 9)
						  					}/>
						  				)
						  			})
						  		)
						  		: <></>
						  }
						</Menu>

			    	<Pressable onPress={handleUpdateOrCreate} disabled={
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
	    		<View>
	    			<Text selectable={true} testID="descView">
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
  appBar: {
  	backgroundColor: '#EA1D2C',
  },
  menu : {
    marginTop: '14%',
  },
  mainView:{

  }
});