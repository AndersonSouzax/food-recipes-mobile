import 'react-native';
import React from 'react';

import { renderHook, act } from '@testing-library/react-hooks'

import Routes from '../../src/routes';

test('', async () => { 

	const { result, waitForNextUpdate } = renderHook(() => Routes());

	console.log(result.current);
	
	expect(1).not.toBeNull();

});