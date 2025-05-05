# Vercel Frontend Deployment

This directory contains configuration files for deploying the News Room frontend to Vercel.

## Setup Instructions

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI: `npm i -g vercel`
3. Link your project: `vercel link`
4. Set up environment variables in the Vercel dashboard or using the CLI:
   ```
   vercel env add NEXT_PUBLIC_API_URL
   vercel env add NEXT_PUBLIC_ANALYTICS_ID
   ```
5. Deploy your project: `vercel --prod`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | URL of the backend API | https://newsroom-api.modal.run |
| NEXT_PUBLIC_ANALYTICS_ID | Analytics service ID | UA-XXXXXXXXX-X |

## Deployment Regions

The application is configured to deploy to the US East (iad1) region by default. You can modify the `regions` array in `vercel.json` to deploy to additional regions.

## Custom Domains

To set up a custom domain:

1. Go to the Vercel dashboard
2. Navigate to your project
3. Click on "Domains"
4. Add your domain and follow the verification steps

## Monitoring

Vercel provides built-in analytics and monitoring. Access these features from the Vercel dashboard for your project.

