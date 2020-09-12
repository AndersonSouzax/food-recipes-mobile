import 'react-native';
import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';

import SingleRecipe from '../../src/single-recipe';

import { Provider as PaperProvider } from 'react-native-paper';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

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

		await(async () => {

			await waitFor(() => getByTestId('description'));

			const compJson = component.toJSON();

			expect(compJson).toMatchSnapshot();

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

			await waitFor(() => getByTestId('confirmDelete'));

			const confirm = getByTestId('confirmDelete');

			fireEvent.press(confirm);

			await act(async () => {

				await waitFor(() => getByTestId('loadElement'), { timeout: 19000 });

				await waitForElementToBeRemoved(() => getByTestId('loadElement'));

				// The test gets too weak if only this call is checked...
				expect(navigationMock.goBack.mock.calls.length).toBe(1);

			});
		});

	});
});	