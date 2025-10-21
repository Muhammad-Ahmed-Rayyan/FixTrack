
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('renders all sections', () => {
    render(
      <BrowserRouter>
        <LandingPage handleNavigate={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getAllByText('FixTrack').length).toBe(2);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Our Team')).toBeInTheDocument();
    expect(screen.getByText('Built With')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });
});
