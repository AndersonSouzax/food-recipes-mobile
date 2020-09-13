import React, { useState, useEffect } from 'react';

import {
	StyleSheet,
	View,
	Image,
	Text, 
	StatusBar,
	Pressable,
} from 'react-native';

import { 
	Appbar, TextInput, Menu, 
	Dialog, Portal, Paragraph, Button } from 'react-native-paper';

import API from './services/api';

export default function SingleRecipe({ navigation, route }){

	const [editing, setEditing] = useState(false);
	const [menuVisible, setMenuVisible] = useState(false);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [editingRecipe, setEditingRecipe] = useState({ description : '' });
	const [loading, setLoading] = useState({ loading : false, error : '', act : '' });

	const { recipe, user } =  route.params;

	const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const showDialog = () => {
  	closeMenu();
  	setDialogVisible(true); 
  }

  const hideDialog = () => setDialogVisible(false);

	const back = () => { navigation.goBack(); };

	const makeEditable = () => { 
		closeMenu();
		setEditing(true);
	};

	const handleEditing = (event) => {

    // const name = event.target.testID;
    // 
    // setState({
    //   ...state,
    //   [name]: event.target.value,
    // });

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

	return (
		<>

			<Appbar.Header style={styles.appBar}>

	    	<Appbar.BackAction testID="backButton" onPress={() => { back(); }} />


	    	<Menu
				  onDismiss={closeMenu}
				  visible={menuVisible}
				  style={styles.menu}
				  disabled={editing}
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
	    	editing ? 

	    		<TextInput testID="description" type="flat"
	    			value={editingRecipe.description} label="Recipe Description"
	    			multiline={true} />

	    		: <Text>{ recipe.description }</Text>
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
  }
});