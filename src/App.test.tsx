import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 

import App from './App';


global.fetch = jest.fn().mockResolvedValue({
  json: () =>
    Promise.resolve([
      {
        id: '1',
        name: 'campbio/musicatk',
        version: "2.9.1",
       
      },
      {
        id: '2',
        name: 'AlessioNar/Rops',
        version: '0.99.11',
        
      },
    ]),
});

describe('App Component', () => {
  test('fetches and lists the last 10 packages from the API', async () => {
    render(<App />);

    await waitFor(() => {
      const packageElements = screen.getAllByTestId('package');
      expect(packageElements).toHaveLength(2); 
    });
  });

  test('selects and highlights a package when clicked', async () => {
    render(<App />);

    fireEvent.click(screen.getByText('campbio/musicatk'));

    expect(screen.getByText('campbio/musicatk')).toHaveClass('selected');
    
  });


  


  test('displays package details including name, version, license, date, description, imports, and authors', async () => {
    render(<App />);

    fireEvent.click(screen.getByText('campbio/musicatk'));

    expect(screen.getByText('version: 2.9.1')).toBeInTheDocument();
    
  });
});
