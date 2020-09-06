import 'react-native';
import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';

import { AuthContext } from '../../src/authcontext';
import Recipes from '../../src/recipes';

import { Provider as PaperProvider } from 'react-native-paper';

jest.mock('../../src/services/api');

jest.setTimeout(20000);

const mockRoute = { 
	params: { user : { token: '9340349njfnidfbuierf', name : 'And', id : 2 } }
};

test('renders correctly', () => {
  const component = render(<Recipes route={mockRoute}/>).toJSON();
  expect(component).toMatchSnapshot();
});

// Almost the same code for all and my recipes request
describe('Fetching recipes', () => {

	test('Display all the recipes after loading', async () => {

		const { getByTestId } = render(
			<Recipes navigation={null} route={mockRoute} />
		);

		await waitFor(() => getByTestId('recipes-list'), { timeout: 19000 });

	});

	test('Load only user\'s created recipes', async () => {

			const component = render(<Recipes navigation={null} route={mockRoute} />);
			
			await act(async () => {

				const { getByTestId } = component;

				await waitFor(() => getByTestId('recipes-list'));

				const button = getByTestId('my-recipes');

				fireEvent.press(button);

				await (async () => {

					// The button must be disabled during loading...
					expect(button.props.disabled).toBe(true);

					await waitFor(() => getByTestId('load-txt'));

					await waitForElementToBeRemoved(() => getByTestId('load-txt'));

					const after = component.toJSON();

					expect(after).toMatchSnapshot();

				});

			});

	});

	test('Load all the recipes', async () => {

			const component = render(<Recipes navigation={null} route={mockRoute} />);
			
			await act(async () => {

				const { getByTestId } = component;

				await waitFor(() => getByTestId('recipes-list'));

				const button = getByTestId('all-recipes');

				fireEvent.press(button);

				await (async () => {

					// The button must be disabled during loading...
					expect(button.props.disabled).toBe(true);

					await waitFor(() => getByTestId('load-txt'));

					await waitForElementToBeRemoved(() => getByTestId('load-txt'));

					const after = component.toJSON();

					expect(after).toMatchSnapshot();

				});
			
			});

	});

// 	test('Notify error on data fetching', async () => { 
// 
// 		const { result, waitForNextUpdate } = renderHook(() => Recipes());
// 
// 		await waitForNextUpdate();
// 
// 		expect(result.current.loading.error).not.toHaveLength(0);
// 
// 	});
	

});

test('User log out', async () => {

	const navigationMock = { dispatch: jest.fn() };

	const mockContext = { signOut: jest.fn() }

	const component = render(
		
			<AuthContext.Provider value={mockContext}>
				<Recipes navigation={navigationMock} route={mockRoute} />
			</AuthContext.Provider>
		
	);

	await act(async () => {

		const { getByTestId } = component;

		await waitFor(() => getByTestId('recipes-list'));

		fireEvent.press(getByTestId('user-menu'));

		await (async () => {

			const button = getByTestId('logout-prs');

			await fireEvent.press(button);

			expect(mockContext.signOut.mock.calls.length).toBe(1);

		});

	});

});

test('Navigate to Single Recipe for Creation/Editing', async () => {

	const navigationMock = { navigate: jest.fn() };

	const component = render(
		<Recipes navigation={navigationMock} route={mockRoute} />
	);

	await act(async () => {

		const { getByTestId, getAllByAccessibilityLabel } = component;

		await waitFor(() => getByTestId('recipes-list'));

		const recipesList = component.getAllByAccessibilityLabel('A Recipe');

		const recipe = recipesList[0];

		await fireEvent.press(recipe);

		expect(navigationMock.navigate.mock.calls.length).toBe(1);

		expect(navigationMock.navigate.mock.calls[0][1]).not.toBeNull();

	});
});

