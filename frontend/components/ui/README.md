# News Room UI Component Library

This directory contains a comprehensive set of reusable UI components for the News Room application.

## Components

### Layout Components
- `Container`: Responsive container with different size options
- `Card`: Card component with header, content, and footer sections

### Typography
- `Typography`: Text component with various styles (h1-h6, body, caption, etc.)

### Form Components
- `Form`: Form component with validation support
- `Input`: Text input with label, helper text, and error states
- `Select`: Dropdown select with options
- `Checkbox`: Checkbox input with label
- `Radio`: Radio button group
- `Textarea`: Multiline text input

### Feedback Components
- `Alert`: Alert component for notifications and messages
- `Badge`: Badge component for status indicators
- `Spinner`: Loading spinner with different sizes and colors

### Interactive Components
- `Button`: Button component with various styles and states
- `ThemeToggle`: Toggle switch for dark/light mode

## Features

- TypeScript support with proper typing
- Responsive design with Tailwind CSS
- Dark/light mode support
- Accessibility features
- Animation with Framer Motion
- Consistent styling across components

## Usage

Import components from the UI library:

```tsx
import { Button, Card, Typography } from '../components/ui';

function MyComponent() {
  return (
    <Card>
      <Typography variant="h2">Hello World</Typography>
      <Button variant="primary">Click Me</Button>
    </Card>
  );
}
```

