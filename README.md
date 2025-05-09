# News Room Web App

A modern news aggregation platform with tiered access focusing on geopolitics, economy, and technology with a futuristic, elegant aesthetic.

## Features

- Personalized news feed based on user interests
- Global news coverage with emphasis on geopolitics, economy, and technology
- Multi-tier subscription model
- Organization-level features for team collaboration
- User history tracking and content recommendations

## Tech Stack

- **Frontend**: React with Next.js, Tailwind CSS
- **State Management**: React Context API
- **Authentication**: JWT with refresh tokens
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/news-room.git
cd news-room
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   ├── article/
│   │   └── [id]/
│   └── auth/
│       ├── login/
│       └── signup/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── article/
│   └── organization/
├── lib/
│   ├── api/
│   ├── auth/
│   └── utils/
├── hooks/
├── context/
└── types/
```

## Subscription Tiers

### Free Tier
- Limited articles per day (5-10)
- Basic personalization
- Ad-supported experience
- Standard news updates

### Individual Paid Tier
- Unlimited articles
- Advanced personalization
- Ad-free experience
- Premium content access
- Early access to features
- Offline reading
- Newsletter subscriptions
- Price: $9.99/month or $99/year

### Organization Tier
- All individual features
- Team sharing capabilities
- Collaborative workspaces
- Custom dashboards
- API access
- Usage analytics
- Dedicated support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

