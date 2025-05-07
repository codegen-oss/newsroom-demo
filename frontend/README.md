# News Room Web App - Frontend

This is the frontend for the News Room Web App, a news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels and a futuristic design aesthetic.

## UI Enhancements

The frontend UI has been enhanced with the following features:

### 1. Improved Visual Design and User Experience

- **Refined Styling and Layout**
  - Consistent color scheme and typography
  - Improved spacing and alignment
  - Enhanced card designs with hover effects
  - Responsive design for all screen sizes

- **Animations and Transitions**
  - Page transitions using Framer Motion
  - Micro-interactions for buttons, cards, and UI elements
  - Loading states with skeleton loaders
  - Staggered animations for lists and grids

- **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts for different screen sizes
  - Touch-friendly UI elements
  - Optimized navigation for mobile devices

### 2. Advanced UI Components

- **Article Filtering and Sorting**
  - Category filters
  - Access tier filters
  - Search functionality
  - Multiple sorting options
  - Active filter indicators

- **User Preference Management**
  - Theme selection (light/dark/system)
  - Content preferences (categories, regions, topics)
  - Notification settings
  - Display preferences

- **Subscription Tier Visualization**
  - Color-coded tier indicators
  - Feature comparison
  - Access level badges
  - Upgrade prompts

### 3. Accessibility Compliance

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly content

## Component Library

The UI is built using a set of reusable components:

- **Button**: Customizable button with variants, sizes, and loading states
- **Card**: Container component with hover effects and animations
- **Badge**: Label component for categories, tiers, etc.
- **Dropdown**: Menu component for filtering and sorting
- **Toggle**: Switch component for user preferences
- **Select**: Dropdown select component for filtering
- **Modal**: Dialog component for user interactions
- **Spinner**: Loading indicator component
- **Skeleton**: Loading placeholder component

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Technologies Used

- **Next.js**: React framework for server-side rendering
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Icons**: Icon library
- **Tailwind Merge**: Utility for merging Tailwind classes

## Folder Structure

```
frontend/
├── app/                # Next.js app directory
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard page
│   ├── profile/        # User profile page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable components
│   ├── ui/             # UI components
│   ├── ArticleCard.tsx # Article card component
│   └── Navbar.tsx      # Navigation component
├── context/            # React context providers
├── lib/                # Utility functions and API
└── public/             # Static assets
```

