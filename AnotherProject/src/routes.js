import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from './login';
// import SignUp from './pages/signUp';
// import Main from './pages/main';

const Routes = createStackNavigator({
  Login: Login,
  // SignUp,
  // Main,
});

export default createAppContainer(Routes);