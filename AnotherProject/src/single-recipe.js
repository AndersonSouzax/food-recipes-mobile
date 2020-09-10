import React, { useState, useEffect } from 'react';

import {
	StyleSheet,
	View,
	Image,
	Text, 
	StatusBar,
	Pressable,
} from 'react-native';

import { Appbar } from 'react-native-paper';

export default function SingleRecipe({ navigation, route }){

	const back = () => { navigation.goBack(); };

	return (
		<>

			<Appbar.Header style={styles.appBar}>

	    	<Appbar.BackAction testID="backButton" onPress={() => { back(); }} />

	    </Appbar.Header>
			<Text>reeeeeeeeeeee</Text>
		</>
	);
}

const styles = StyleSheet.create({
  appBar: {
  	backgroundColor: '#EA1D2C',
  },
});