import 'react-native';
import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';

import Recipes from '../../src/recipes';

jest.mock('../../src/services/api');

jest.setTimeout(20000);

test('renders correctly', () => {
  const component = render(<Recipes />).toJSON();
  expect(component).toMatchSnapshot();
});

// Almost the same code for all and my recipes request
describe('Fetching recipes', () => {

	test('Display all the recipes after loading', async () => {

		const { getByTestId } = render(<Recipes navigation={null} />);

		await waitFor(() => getByTestId('recipes-list'), { timeout: 19000 });

	});

	test('Load only user\'s created recipes', async () => {

		//await act(async () => {

			const component = render(<Recipes navigation={null} />);
			
			const { getByTestId } = component;

			await waitFor(() => getByTestId('recipes-list'));

			fireEvent.press(getByTestId('my-recipes'));

			await waitFor(() => getByTestId('loadiv'), { timeout: 19000 });

			await waitForElementToBeRemoved(() => getByTestId('loadiv'));

			const after = component.toJSON();

			expect(after).toMatchSnapshot();

		//});

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

