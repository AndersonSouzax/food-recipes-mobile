import 'react-native';
import React from 'react';

import { useAsyncStorage } from '../../src/custom-hooks';

import { create, act } from 'react-test-renderer';

test('Returns stored user', () => {

	function SubComponent() {
  	return (
    	<p className="sub">Sub</p>
  	);
	}

	function MockComponent () {

		const user = useAsyncStorage();

		return (<div> user && <p> Hello </p> </div>);
	};

	let component;

	act(() => { component = create(<MockComponent />); });

	expect(component.root.findAllByType("p")).toBeNull();

});