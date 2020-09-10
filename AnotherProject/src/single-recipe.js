import React, { useState, useEffect } from 'react';

import {
	StyleSheet,
	View,
	Image,
	Text, 
	StatusBar,
	Pressable,
} from 'react-native';

import { Appbar, TextInput, Menu } from 'react-native-paper';

export default function SingleRecipe({ navigation, route }){

	const[editing, setEditing] = useState(false);

	const[editingRecipe, setEditingRecipe] = useState(
		{ description : '' }
	);

	const { recipe, user } =  route.params;

	const [menuVisible, setMenuVisible] = useState(false);

	const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

	const back = () => { navigation.goBack(); };

	const makeEditable = () => { setEditing(true); };

	const handleEditing = (event) => {

    // const name = event.target.testID;
    // 
    // setState({
    //   ...state,
    //   [name]: event.target.value,
    // });

	};

	return (
		<>

			<Appbar.Header style={styles.appBar}>

	    	<Appbar.BackAction testID="backButton" onPress={() => { back(); }} />


	    	<Menu
				  onDismiss={closeMenu}
				  visible={menuVisible}
				  style={styles.menu}
				  anchor={
	    			<Appbar.Action testID="options" icon="dots-vertical"
	    				onPress={openMenu} />
				   }>
				  <Menu.Item testID="editReciple" icon="pen"
				  	title="Edit Recipe" onPress={makeEditable} />

				</Menu>

	    </Appbar.Header>

	    {
	    	editing ? 

	    		<TextInput testID="description" type="flat"
	    			value={editingRecipe.description} label="Recipe Description"
	    			multiline={true} />

	    		: <Text>{ recipe.description }</Text>
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