import 'react-native';
import React from 'react';

import Login from '../src/login';

import { create, act } from 'react-test-renderer';

jest.mock('../src/services/api');

test('renders correctly', () => {
  const component = create(<Login />).toJSON();
  expect(component).toMatchSnapshot();
});

describe('correctly accepts the credentials', () => {

	let component;

	act(() => { component = create(<Login />); });

	const texts = component.root.findAllByType("TextInput");
	const email = texts[0];
	const password = texts[1];

	test('correctly assign the credentials', () => {
		// user email
		act(() => { email.props.onChangeText('abc'); });
		// user password
		act(() => { password.props.onChangeText('def'); });

		expect(email.props.value).toBe('abc');
		expect(password.props.value).toBe('def');

	});

	test('cleans any error presented', async () => {

		expect.assertions(2);

		const loginButton = component.root.findByProps({ testID : 'loginButton' });

		/*User inputing... */
		// user email
		act(() => { email.props.onChangeText('a'); });
		// user password
		act(() => { password.props.onChangeText('d'); });
		// Submits the form...
		act(() => { loginButton.props.onPress(); });

		// Short password error message is displayed
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		act(() => { email.props.onKeyPress(); });

		// Error message is hidden
		tree = component.toJSON();
		expect(tree).toMatchSnapshot();

	});

});

test('enables the login button only if password and user email are not null', () => {

	let component;

	act(() => { component = create(<Login />); });

	const inputs = component.root.findAllByType("TextInput");
	const loginButton = component.root.findByProps({ testID : 'loginButton' });

	const email = inputs[0];
	const password = inputs[1];
	
	expect(loginButton.props.disabled).toBe(true);

	// user email
	act(() => { email.props.onChangeText('a'); });
	// user password
	act(() => { password.props.onChangeText('d'); });

	expect(loginButton.props.disabled).toBe(false);

});

describe('tries to log in the user', () => {

	let component;

	act(() => { component = create(<Login />); });

	const inputs = component.root.findAllByType("TextInput");
	const loginButton = component.root.findByProps({ testID : 'loginButton' });

	const email = inputs[0];
	const password = inputs[1];

	test('short password error message is displayed', async () => {

		/* Enters with user informations..  */
		act(() => { email.props.onChangeText('a'); });
		act(() => { password.props.onChangeText('d'); });

		expect.assertions(1);

		// Submits the form...
		await act(async () => { await loginButton.props.onPress(); });

		let tree = component.toJSON();

		expect(tree).toMatchSnapshot();

	});



	test('Invalid username or password error is displayed', async () => {

		act(() => { password.props.onKeyPress(); })

		// Invalid password input
		act(() => { password.props.onChangeText('andinnnn'); });

		expect.assertions(1);

		await act(async () => { await loginButton.props.onPress(); });

		const errorText = component.root.findAllByProps({ testID : 'error' });

	  expect(errorText).not.toHaveLength(0);

	});

});




