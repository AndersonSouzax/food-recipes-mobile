import 'react-native';
import React from 'react';

import { useAsyncStorage } from '../../src/custom-hooks';

//import { create, act } from 'react-test-renderer';

import { renderHook, act } from '@testing-library/react-hooks'

test('Returns stored user', async () => {

	const { result, waitForNextUpdate } = renderHook(() => useAsyncStorage());

	await waitForNextUpdate();

	expect(result.current.user).not.toBeNull();
	
});