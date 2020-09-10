import 'react-native';
import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';

import SingleRecipe from '../../src/single-recipe';

const mockRoute = { 
	params: { 
		recipe : { id: 1, title : 'Fish', user : { id: 1 },
      description : 'you got that yummi yummi...',
      category : { id : 1, name : "Japonese Food", 
          image : 'https://upload.wikimedia.org/wikipedia/commons/5/57/Oseti.jpg' 
      } 
    }
  }
};

test('Renders correctly', () => {
  const component = render(<SingleRecipe route={mockRoute}/>).toJSON();
  expect(component).toMatchSnapshot();
});

test('Go back to the recipes list', () => {

	const navigationMock = { goBack: jest.fn() };

	const { getByTestId } = render(
		<SingleRecipe navigation={navigationMock} route={mockRoute} />
	);

	const backButton = getByTestId('backButton');

	fireEvent.press(backButton);

	expect(navigationMock.goBack.mock.calls.length).toBe(1);

});


