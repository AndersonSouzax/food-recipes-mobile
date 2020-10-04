import 'react-native';
import React from 'react';
import { render, waitFor, act, fireEvent, 
	waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';

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

describe('Make user\'s recipe editable correctly', () => {

	let component = null;

	beforeEach(() => {

		component = render(
			<PaperProvider>
				<SingleRecipe route={mockRoute} />
			</PaperProvider>
		);

	});

	test('Only the recipe\'s creator are allowed to make changes', async () => {

		const otherUserMock = {
			params: { 
				recipe : { id: 1, title : 'Fish', user : { id: 1 },
		      description : 'you got that yummi yummi...',
		      category : { id : 1, name : "Japonese Food", 
		          image : 'https://upload.wikimedia.org/wikipedia/commons/5/57/Oseti.jpg' 
		      } 
		    },
		    user : { id : 2 }
		  }
		}

		const otherComponent = render(
			<PaperProvider>
				<SingleRecipe route={otherUserMock} />
			</PaperProvider>
		);

    const { update, queryByTestId } = otherComponent;

		const RecipeOptions = queryByTestId('options');

		expect(RecipeOptions).toBeNull();

	});

	test('Text inputs work correctly', async() => {
		
		const { getByTestId } = component;

		const options = getByTestId('options');

		fireEvent.press(options);

		await act(async () => {	

			await waitFor(() => getByTestId('editReciple'));
			
			const editButton = getByTestId('editReciple');

			fireEvent.press(editButton);

			await act(async () => {

				expect(options.props.accessibilityState.disabled).toBe(true);

				const desc = getByTestId('description');

				fireEvent.changeText(desc, 'loveyou');
				
				await waitFor(() => getByTestId('description').props.value === 'loveyou');

			});

		});

	});

	test('The categories are loaded correctly', async () => {

		const { getByTestId } = component;

		const options = getByTestId('options');

		fireEvent.press(options);

		await act(async () => {	

			await waitFor(() => getByTestId('editReciple'));
			
			const editButton = getByTestId('editReciple');

			fireEvent.press(editButton);

			await act(async () => {
				
				const desc = getByTestId('description');

				const categoriesList = getByTestId('categoryList');
				
				// Wait until the categories are loaded
				await waitFor(() => categoriesList.props.enabled);

				const selectedCat = categoriesList.props.selectedIndex;

				/* Fires the categories loading */
				fireEvent(categoriesList, 'onValueChange', 2 );

				await act(async () => {
					expect(
						getByTestId('categoryList').props.selectedIndex
					).not.toBe(selectedCat);
				});
				
			});

		});

	});

  test('Cancels the editing correctly', async() => {
		
    const { getByTestId, queryByTestId } = component;

    const options = getByTestId('options');

    fireEvent.press(options);

    await act(async () => {	

      await waitFor(() => getByTestId('editReciple'));
			
      const editButton = getByTestId('editReciple');

      fireEvent.press(editButton);

      await act(async () => {
				
        const cancelButton = getByTestId('cancelEditButton');

        fireEvent.press(cancelButton);
				
        /* Ensuring that all elements for editing are hidden after cancellation */
        await waitForElementToBeRemoved(() => getByTestId('cancelEditButton'));

        const description = queryByTestId('description');
        const title = queryByTestId('title');
        const categories = queryByTestId('categoryList');
        const saveButton = queryByTestId('saveButton');
				
        const elementsAreVisible = description 
          || title 
          || categories 
          || saveButton;

        expect(elementsAreVisible).toBeFalsy();

      });

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

/*
* This test is too weak because there's no assertion on API step...
* 
*/
test('Updating recipe correctly', async () => {

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

		//await act(async () => {

			await waitFor(() => getByTestId('description'));

			const saveButton = getByTestId('saveButton');

			const desc = getByTestId('description');

			fireEvent.changeText(desc, 'loveyou');
			
			//await act(async () => {

				await waitFor(() => getByTestId('description').props.value === 'loveyou');
				
				await fireEvent.press(saveButton);

				//await act(async () => {

					/* The value of view description must be the same that was inserted during editing */
					const description = getByTestId('descView');

					//await waitFor(() => description.props.children === 'loveyoukkk');

					expect(description.props.children).toBe('loveyou');


				//});

			//});

		//});

	});

});



