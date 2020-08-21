import 'react-native';
import React from 'react';

import Recipes from '../../src/recipes';

jest.mock('../../src/services/api');

import { create, act } from 'react-test-renderer';

import { renderHook, act } from '@testing-library/react-hooks'

test('renders correctly', () => {
  const component = create(<Recipes />).toJSON();
  expect(component).toMatchSnapshot();
});

test('Intially, fetches all the recipes', async () => {

	const { result, waitForNextUpdate } = renderHook(() => Recipes());

	await waitForNextUpdate();

	expect(result.current.recipes).not.toBeNull();
	
});

