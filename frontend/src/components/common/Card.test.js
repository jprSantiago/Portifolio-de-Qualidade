import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  test('renders card with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('renders card with title', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  test('renders card with title and subtitle', () => {
    render(
      <Card title="Card Title" subtitle="Card Subtitle">
        Content
      </Card>,
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
  });

  test('renders subtitle only when title is provided', () => {
    render(<Card subtitle="Card Subtitle">Content</Card>);
    expect(screen.queryByText('Card Subtitle')).not.toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  test('applies default card styles', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6');
  });

  test('renders multiple children', () => {
    render(
      <Card>
        <p>First child</p>
        <p>Second child</p>
      </Card>,
    );
    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
  });

  test('passes additional props to card element', () => {
    const { container } = render(<Card data-testid="test-card">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveAttribute('data-testid', 'test-card');
  });
});
