# Harsh Hajela - Portfolio Website

A modern, responsive portfolio website built with Angular 17, Tailwind CSS, and optimized for AWS S3 static hosting. Features dark/light mode, smooth scrolling navigation, interactive animations, and comprehensive SEO optimization.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/harsh-hajela/portfolio.git
cd portfolio

# Install dependencies
npm ci

# Start development server
npm start

# Build for production
npm run build
```

## ✨ Features

### 🎨 Design & UX
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Dark/Light Mode**: System preference detection with manual toggle, persistent across sessions
- **Smooth Animations**: CSS-based animations with `prefers-reduced-motion` support
- **Interactive Elements**: Hover effects, loading states, and micro-interactions
- **Glass Morphism**: Modern glass card effects with backdrop blur
- **Custom Design System**: Consistent spacing, typography, and color tokens

### 🧭 Navigation & Accessibility
- **Smooth Scrolling**: In-page navigation with offset calculations
- **Active Section Tracking**: Intersection Observer-based active link highlighting
- **Keyboard Navigation**: Full keyboard accessibility with focus management
- **Screen Reader Support**: ARIA labels, landmarks, and semantic HTML
- **Skip Links**: Quick navigation for assistive technologies
- **High Contrast**: WCAG AA compliant color combinations

### 📱 Performance & SEO
- **Lighthouse Score**: 95+ Performance, 90+ Accessibility/SEO, 100 Best Practices
- **Core Web Vitals**: Optimized LCP, FID, and CLS metrics
- **Meta Tags**: Complete Open Graph, Twitter Cards, and structured data
- **Progressive Enhancement**: Works without JavaScript for basic content
- **Image Optimization**: WebP support with fallbacks, lazy loading
- **Bundle Analysis**: Tree-shaking and code splitting

### 🛠️ Technical Features
- **Angular 17**: Standalone components, strict mode, modern APIs
- **TypeScript**: Strong typing with interfaces and type safety
- **Reactive Forms**: Form validation with custom validators
- **RxJS**: Reactive programming patterns for state management
- **Intersection Observer**: Scroll-based animations and navigation tracking
- **CSS Custom Properties**: Theme system with CSS variables

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/           # Standalone components
│   │   ├── header/          # Navigation and theme toggle
│   │   ├── hero/            # Landing section with CTAs
│   │   ├── about/           # Bio and certifications
│   │   ├── skills/          # Technical skills with progress bars
│   │   ├── experience/      # Professional timeline
│   │   ├── projects/        # Portfolio projects with modals
│   │   ├── blog/            # Article listings
│   │   ├── contact/         # Contact form and info
│   │   └── footer/          # Footer with links
│   ├── services/            # Shared services
│   │   ├── scroll.service.ts      # Smooth scrolling and navigation
│   │   ├── theme.service.ts       # Dark/light mode management
│   │   └── animation.service.ts   # Intersection Observer animations
│   ├── interfaces/          # TypeScript interfaces
│   └── app.component.*      # Root component
├── assets/
│   ├── data/                # JSON data files
│   │   └── portfolio-data.json    # Content configuration
│   └── images/              # Optimized images and icons
├── styles.scss              # Global styles and utilities
└── index.html              # HTML shell with SEO meta tags
```

## 🎯 Content Management

### Editing Content
All content is centralized in `/src/assets/data/portfolio-data.json`:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "bio": "Your bio...",
    "contact": { /* contact info */ },
    "social": [ /* social links */ ]
  },
  "skills": [ /* skill categories */ ],
  "experience": [ /* work history */ ],
  "projects": [ /* portfolio projects */ ],
  "blog": [ /* article listings */ ],
  "certifications": [ /* credentials */ ]
}
```

### Adding New Projects
1. Add project data to `portfolio-data.json`
2. Add project images to `/src/assets/images/`
3. Update image paths in the data file

### Customizing Theme
Modify colors, fonts, and spacing in:
- `tailwind.config.js` - Design tokens
- `/src/styles.scss` - Global styles
- CSS custom properties in components

## 🛠️ Development

### Available Scripts

```bash
# Development
npm start                 # Start dev server on http://localhost:4200
npm run watch             # Build with file watching

# Building
npm run build             # Production build → dist/portfolio
npm run build:dev         # Development build
npm run preview           # Serve production build locally

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format with Prettier
npm run format:check      # Check formatting

# Testing
npm test                  # Run unit tests with Karma
npm run test:ci           # Run tests in CI mode

# Analysis
npm run analyze           # Bundle size analysis
```

### Development Guidelines

#### Code Style
- **ESLint**: Configured with Angular, TypeScript, and accessibility rules
- **Prettier**: Consistent code formatting with custom overrides
- **TypeScript**: Strict mode enabled, prefer interfaces over types
- **Components**: Standalone components with OnPush change detection

#### Accessibility Checklist
- [ ] Semantic HTML structure
- [ ] ARIA labels and roles
- [ ] Keyboard navigation support
- [ ] Color contrast compliance
- [ ] Screen reader testing
- [ ] Focus management

#### Performance Best Practices
- [ ] Lazy loading for images
- [ ] OnPush change detection
- [ ] TrackBy functions for ngFor
- [ ] Preconnect for external resources
- [ ] Bundle size monitoring

## 🚀 Deployment

### AWS S3 Static Website Hosting

#### Prerequisites
- AWS CLI configured with appropriate permissions
- S3 bucket creation and management access
- (Optional) CloudFront distribution access

#### Step 1: Build the Application
```bash
# Install dependencies and build
npm ci
npm run build

# Verify build output
ls -la dist/portfolio/
```

#### Step 2: Create S3 Bucket
```bash
# Create bucket (replace with your domain)
aws s3 mb s3://harshhajela.dev

# Enable static website hosting
aws s3 website s3://harshhajela.dev \
  --index-document index.html \
  --error-document index.html
```

#### Step 3: Configure Bucket Policy
Create `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::harshhajela.dev/*"
    }
  ]
}
```

```bash
# Apply bucket policy
aws s3api put-bucket-policy \
  --bucket harshhajela.dev \
  --policy file://bucket-policy.json

# Disable block public access
aws s3api put-public-access-block \
  --bucket harshhajela.dev \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

#### Step 4: Upload Files
```bash
# Sync build files to S3
aws s3 sync dist/portfolio/ s3://harshhajela.dev \
  --delete \
  --cache-control "public,max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.json"

# Upload HTML files with shorter cache
aws s3 sync dist/portfolio/ s3://harshhajela.dev \
  --delete \
  --cache-control "public,max-age=0,must-revalidate" \
  --include "*.html" \
  --include "*.json"
```

#### Step 5: (Optional) CloudFront Setup
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

CloudFront configuration (`cloudfront-config.json`):
```json
{
  "CallerReference": "portfolio-$(date +%s)",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-harshhajela.dev",
        "DomainName": "harshhajela.dev.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-harshhajela.dev",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    },
    "MinTTL": 0,
    "Compress": true
  },
  "DefaultRootObject": "index.html",
  "CustomErrorPages": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "Comment": "Harsh Hajela Portfolio",
  "Enabled": true
}
```

#### Deployment Automation
Create `deploy.sh` for automated deployments:
```bash
#!/bin/bash
set -e

# Build application
npm ci
npm run build

# Sync to S3
aws s3 sync dist/portfolio/ s3://harshhajela.dev \
  --delete \
  --cache-control "public,max-age=31536000" \
  --exclude "*.html" --exclude "*.json"

aws s3 sync dist/portfolio/ s3://harshhajela.dev \
  --cache-control "public,max-age=0,must-revalidate" \
  --include "*.html" --include "*.json"

# Invalidate CloudFront (if using)
aws cloudfront create-invalidation \
  --distribution-id E1234567890 \
  --paths "/*"

echo "Deployment completed successfully!"
echo "Website: https://harshhajela.dev"
```

### Alternative Deployment Options

#### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist/portfolio`
4. Configure redirects in `_redirects` file:
   ```
   /*    /index.html   200
   ```

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`
3. Configure in `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist/portfolio",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

## 🎨 Theming & Customization

### Color System
The portfolio uses a semantic color system defined in `tailwind.config.js`:

```javascript
colors: {
  primary: {    // Blue tones for primary actions
    50: '#f0f9ff',
    500: '#0ea5e9',
    900: '#0c4a6e',
  },
  accent: {     // Green tones for highlights
    50: '#ecfdf5',
    500: '#10b981',
    900: '#064e3b',
  },
  neutral: {    // Grayscale for content
    50: '#fafafa',
    500: '#71717a',
    900: '#18181b',
  }
}
```

### Typography Scale
```javascript
fontFamily: {
  sans: ['Inter var', 'system-ui', /* ... */],
  display: ['Space Grotesk', 'system-ui', 'sans-serif'],
}
```

### Animation System
Custom animations with reduced motion support:

```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🔍 SEO & Analytics

### Meta Tags
Comprehensive meta tags for search engines and social media:

- **Basic SEO**: Title, description, keywords, robots
- **Open Graph**: Facebook sharing optimization
- **Twitter Cards**: Twitter sharing optimization
- **Structured Data**: JSON-LD for search engine understanding
- **Canonical URLs**: Prevent duplicate content issues

### Performance Monitoring
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Bundle analysis
npm run analyze
```

### Analytics Integration
Add Google Analytics to `src/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

#### Deployment Issues
```bash
# Check S3 bucket policy
aws s3api get-bucket-policy --bucket your-bucket-name

# Verify file permissions
aws s3 ls s3://your-bucket-name --recursive
```

#### Performance Issues
- Run `npm run analyze` to identify large bundles
- Check image optimization and lazy loading
- Verify CSS is purged in production builds
- Monitor Core Web Vitals with Lighthouse

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Fallbacks**: Basic layout works without JavaScript

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

- **Email**: harsh.hajela@example.com
- **LinkedIn**: [harsh-hajela](https://linkedin.com/in/harsh-hajela)
- **GitHub Issues**: [Create an issue](https://github.com/harsh-hajela/portfolio/issues)

---

**Built with ❤️ by Harsh Hajela using Angular 17, Tailwind CSS, and modern web standards.**
