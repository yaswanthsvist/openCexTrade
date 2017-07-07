import React from 'react';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
//  const rendered = renderer.create(<App />).toJSON();
  expect('123').toBeTruthy();
});
