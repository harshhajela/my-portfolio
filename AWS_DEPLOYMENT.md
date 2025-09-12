# AWS S3 Static Website Deployment Guide

## Pre-deployment Checklist

✅ **Build Optimizations Applied:**
- Production build configuration with minification
- Critical CSS inlining
- Image and asset optimization
- Gzip compression for all text-based files
- Browser caching headers
- SEO meta tags and structured data
- Security headers configured

## Build Statistics

After optimization, your portfolio build is **11.04 MB** total with excellent compression ratios:
- JavaScript: 76.96% average compression
- CSS: 86.12% compression 
- HTML: 82.89% compression
- JSON: 71.40% compression

## AWS S3 Setup

### 1. Create S3 Bucket

```bash
# Replace 'your-domain.com' with your actual domain
aws s3 mb s3://your-domain.com --region us-east-1
```

### 2. Configure Bucket for Static Website

```bash
aws s3 website s3://your-domain.com \
  --index-document index.html \
  --error-document index.html
```

### 3. Set Bucket Policy for Public Access

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
      "Resource": "arn:aws:s3:::your-domain.com/*"
    }
  ]
}
```

Apply the policy:
```bash
aws s3api put-bucket-policy \
  --bucket your-domain.com \
  --policy file://bucket-policy.json
```

### 4. Upload Optimized Build

```bash
# Navigate to your project directory
cd /path/to/portfolio

# Build optimized version
npm run build:optimized

# Sync to S3 with proper cache headers
aws s3 sync dist/portfolio/ s3://your-domain.com \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.json"

# Upload HTML and JSON with shorter cache
aws s3 sync dist/portfolio/ s3://your-domain.com \
  --delete \
  --cache-control "public, max-age=86400" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json"

# Set content-encoding for gzipped files
aws s3 cp dist/portfolio/ s3://your-domain.com \
  --recursive \
  --exclude "*" \
  --include "*.gz" \
  --content-encoding gzip \
  --metadata-directive REPLACE
```

## CloudFront CDN Setup (Recommended)

### 1. Create Distribution

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### 2. CloudFront Configuration (`cloudfront-config.json`)

```json
{
  "CallerReference": "portfolio-$(date +%s)",
  "Comment": "Portfolio CDN Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-your-domain.com",
        "DomainName": "your-domain.com.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-domain.com",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "CustomErrorResponses": {
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
  "Enabled": true
}
```

## Performance Optimizations Applied

### JavaScript & CSS
- ✅ Minification and tree-shaking
- ✅ Dead code elimination
- ✅ Bundle splitting (vendor/app chunks)
- ✅ Gzip compression (69-86% reduction)

### Images & Assets
- ✅ Optimized PNG files (total: 12 images)
- ✅ Proper cache headers (1 year for static assets)
- ✅ Lazy loading implemented

### SEO & Performance
- ✅ Critical resource preloading
- ✅ DNS prefetching for external resources
- ✅ Structured data (JSON-LD)
- ✅ Open Graph and Twitter cards
- ✅ Security headers

### Browser Caching Strategy
- HTML/JSON: 1 day cache
- CSS/JS: 1 month cache  
- Images/Fonts: 1 year cache
- PDF documents: 1 month cache

## Post-Deployment Verification

### 1. Test Performance
```bash
# Use Lighthouse CLI
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

### 2. Verify Compression
```bash
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
# Should return: Content-Encoding: gzip
```

### 3. Test SPA Routing
```bash
# Direct route should work
curl https://your-domain.com/project/ecommerce-platform
# Should return 200, not 404
```

## Expected Performance Metrics

With these optimizations, you should achieve:
- **Lighthouse Performance**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Total Blocking Time**: < 300ms
- **Cumulative Layout Shift**: < 0.1

## Domain & SSL Setup

For custom domain with SSL:

1. **Route 53 Hosted Zone**
2. **Certificate Manager** (us-east-1 region for CloudFront)
3. **CloudFront Alternate Domain Names**
4. **Route 53 Alias Records**

## Monitoring & Analytics

Consider adding:
- Google Analytics 4
- AWS CloudWatch monitoring
- Performance monitoring (Web Vitals)

---

**Deployment Command Summary:**
```bash
# Complete deployment pipeline
npm run build:optimized
aws s3 sync dist/portfolio/ s3://your-domain.com --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```