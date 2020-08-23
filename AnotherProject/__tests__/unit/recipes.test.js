import 'react-native';
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

import Recipes from '../../src/recipes';

jest.mock('../../src/services/api');

test('renders correctly', () => {
  const component = render(<Recipes />).toJSON();
  expect(component).toMatchSnapshot();
});

// Almost the same code for all and my recipes request
describe('Fetching recipes', () => {

	test('Fetches all recipes', async () => {

		const { getByTestId } = render(<Recipes navigation={null} stored={null} />);

		await waitFor(() => getByTestId('recipes-list'));

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

