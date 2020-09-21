import 'react-native';
import React from 'react';
import { render, waitFor, act, fireEvent, 
	waitForElementToBeRemoved } from '@testing-library/react-native';

import SingleRecipe from '../../src/single-recipe';

import { Provider as PaperProvider } from 'react-native-paper';

const mockRoute = { 
	params: { 
		recipe : { id: 1, title : 'Fish', user : { id: 1 },
      description : 'you got that yummi yummi...',
      category : { id : 1, name : "Japonese Food", 
          image : 'https://upload.wikimedia.org/wikipedia/commons/5/57/Oseti.jpg' 
      } 
    },
    user : { id : 1 }
  }
};

jest.setTimeout(20000);

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.mock('../../src/services/api');

test('Renders correctly', () => {
  const component = render(
  	<PaperProvider>
  		<SingleRecipe route={mockRoute}/>
  	</PaperProvider>
  );
  const componentJS = component.toJSON();
  expect(componentJS).toMatchSnapshot();
});

test('Go back to the recipes list', () => {

	const navigationMock = { goBack: jest.fn() };

	const { getByTestId } = render(
		<PaperProvider>
			<SingleRecipe navigation={navigationMock} route={mockRoute} />
		</PaperProvider>
	);

	const backButton = getByTestId('backButton');

	fireEvent.press(backButton);

	expect(navigationMock.goBack.mock.calls.length).toBe(1);

});

test('Make user\'s recipe editable', async () => {

	const component = render(
		<PaperProvider>
			<SingleRecipe route={mockRoute} />
		</PaperProvider>
	);

	const { getByTestId } = component;

	const options = getByTestId('options');

	fireEvent.press(options);

	await act(async () => {	

		await waitFor(() => getByTestId('editReciple'));
		
		const editButton = getByTestId('editReciple');

		fireEvent.press(editButton);

		await act(async () => {

			/*
				* The categories must be loaded only when edit mode is selected
				*/
			await waitFor(() => getByTestId('categoryList'));
			
			const desc = getByTestId('description');

			/*
				* Test the informations changing...
				*/

			const event = { target : { testID : 'description', value : 'loveyou' } };

			fireEvent.changeText(desc, event);
			
			await waitFor(() => getByTestId('description').props.value === 'loveyou');

		});

	});

});

test('Deleting recipe correctly', async () => {

	const navigationMock = { goBack: jest.fn() };

	const component = render(
		<PaperProvider>
			<SingleRecipe route={mockRoute} navigation={navigationMock}/>
		</PaperProvider>
	);

	const { getByTestId } = component;

	const options = getByTestId('options');

	fireEvent.press(options);

	await act(async () => {	

		await waitFor(() => getByTestId('deleteReciple'));
		
		const deleteButton = getByTestId('deleteReciple');

		fireEvent.press(deleteButton);

		await act(async () => {

			//await waitFor(() => getByTestId('confirmDelete'));

			const confirm = getByTestId('confirmDelete');

			await fireEvent.press(confirm);

			//await act(async () => {

 				//await waitFor(() => getByTestId('loadElement'));

 				// await waitForElementToBeRemoved(() => getByTestId('loadElement'));

				// The test gets too weak if only this call is checked...
				expect(navigationMock.goBack.mock.calls.length).toBe(1);

			//});
		});
	});
});

test('Updating recipe correctly', async () => {

	const component = render(
		<PaperProvider>
			<SingleRecipe route={mockRoute} />
		</PaperProvider>
	);

	const { getByTestId } = component;

	const options = getByTestId('options');

	const saveButton = getByTestId('saveButton');

	fireEvent.press(options);

	await waitFor(() => getByTestId('editReciple'));
	
	const editButton = getByTestId('editReciple');

	fireEvent.press(editButton);

	await waitFor(() => getByTestId('description'));

	const desc = getByTestId('description');

	const event = { target : { testID : 'description', value : 'loveyou' } };

	fireEvent.changeText(desc, event);
	
	await waitFor(() => getByTestId('description').props.value === 'loveyou');
	
	await fireEvent.press(saveButton);

	/* The value of view description must be the same that was inserted during editing */
	await waitFor(() => getByTestId('descView').props.value === 'loveyou');

});



