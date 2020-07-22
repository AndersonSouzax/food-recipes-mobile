import 'react-native';
import React from 'react';

import Login from '../src/login';

import { create, act } from 'react-test-renderer';

it('renders correctly', () => {

  const component = create(<Login />).toJSON();

  expect(component).toMatchSnapshot();

});

it('correctly accepts the credentials', () => {

	let component;

	act(() => {
		component = create(<Login />);
	});

	const texts = component.root.findAllByType("TextInput");

	const email = texts[0];
	const password = texts[1];

	// user email
	act(() => {
		email.props.onChangeText('abc');
	});

	expect(email.props.value).toBe('abc');

	// user password
	act(() => { 
		password.props.onChangeText('def'); 
	});

	expect(password.props.value).toBe('def');

});





