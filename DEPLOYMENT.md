# Cloudflare Pages Deployment

This project is configured for deployment on Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- A GitHub account
- Node.js 18+ and npm

## Manual Deployment

### Using Cloudflare Pages UI

1. Connect your GitHub repository to Cloudflare Pages:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to Pages
   - Select "Connect to Git"
   - Authorize GitHub and select this repository

2. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (default)
   - Environment variables: (add any needed)

3. Click "Save and Deploy"

### Using Wrangler CLI

```bash
# Install Wrangler globally (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist
```

## Automatic Deployment with GitHub Actions

The repository includes a GitHub Actions workflow for automatic deployment.

### Setup

1. Generate a Cloudflare API token:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Account Settings → API Tokens
   - Create Token → Use "Edit Cloudflare Workers" template
   - Grant permissions for Pages

2. Add secrets to your GitHub repository:
   - Go to Repository Settings → Secrets and variables → Actions
   - Add `CLOUDFLARE_API_TOKEN` with your API token
   - Add `CLOUDFLARE_ACCOUNT_ID` with your Account ID (found in Cloudflare Dashboard)

3. The workflow will automatically deploy on push to `main` branch

## Environment Variables

If your app needs environment variables, add them in Cloudflare Pages settings:
- Go to your project settings in Cloudflare Dashboard
- Navigate to Environment variables
- Add variables for Production and/or Preview environments

## Routing

The `_redirects` file in the public directory ensures all routes are handled by React Router. This is essential for single-page applications.

## Testing Locally

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## Troubleshooting

- **404 errors on refresh**: Make sure the `_redirects` file is deployed with the build
- **Build failures**: Check Node.js version (should be 18+)
- **Routing issues**: Verify React Router configuration in `src/App.tsx`
