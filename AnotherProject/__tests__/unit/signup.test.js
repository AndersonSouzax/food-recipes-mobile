import 'react-native';
import React from 'react';

import SignUp from '../../src/signup';

jest.mock('../../src/services/api');

import { create, act } from 'react-test-renderer';

test('renders correctly', () => {
  const component = create(<SignUp />).toJSON();
  expect(component).toMatchSnapshot();
});




