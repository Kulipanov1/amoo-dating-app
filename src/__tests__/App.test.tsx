import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('App', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    expect(getByText('amoo')).toBeTruthy();
  });
}); 