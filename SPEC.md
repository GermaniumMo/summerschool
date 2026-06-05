# Neural Nexus - AI Education Website

## Project Overview
- **Project Name**: Neural Nexus
- **Type**: Multi-page educational website with backend API
- **Core Functionality**: An immersive, visually striking platform that educates visitors about artificial intelligence through modern web design and interactive features
- **Target Users**: General audience curious about AI, students, tech enthusiasts

## Project Structure

```
summerschool/
├── public/
│   ├── index.html          # Home page
│   ├── about.html         # About AI page
│   ├── types.html         # Types of AI page
│   ├── timeline.html       # AI Timeline page
│   ├── contact.html       # Contact page
│   ├── css/
│   │   ├── main.css       # Core styles & layout
│   │   ├── components.css  # Component styles
│   │   └── utilities.css  # Utility classes
│   ├── js/
│   │   ├── main.js        # Core functionality
│   │   └── animations.js  # Animations & effects
│   └── images/
│       └── favicon.svg    # Neural network favicon
├── server/
│   └── server.js          # Express.js backend
├── package.json           # Dependencies
└── SPEC.md               # This specification
```

## Technology Stack

### Frontend
- **HTML5** - Semantic markup with accessibility
- **CSS3** - Custom properties, grid, flexbox, animations
- **JavaScript (ES6+)** - Modular, object-oriented

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

## UI/UX Specification

### Design System

#### Color Palette
- **Background**: `#0a0a0f` (deep space black)
- **Background Elevated**: `#12121a` (elevated surfaces)
- **Primary**: `#00f5d4` (electric cyan)
- **Secondary**: `#9b5de5` (vivid purple)
- **Accent**: `#f15bb5` (hot pink)
- **Text**: `#e8e8e8` (soft white)
- **Text Muted**: `#9ca3af` (muted gray)
- **Border**: `rgba(255, 255, 255, 0.08)` (subtle borders)

#### Typography
- **Headings**: "Syne" - Bold, futuristic sans-serif
- **Body**: "IBM Plex Mono" - Technical monospace

#### Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px

### Pages

#### Home Page (`index.html`)
- Hero section with animated gradient background
- Features preview grid
- About section preview
- Timeline preview
- Newsletter signup CTA

#### About Page (`about.html`)
- Page header with title
- Main content area with educational text
- Sidebar with quick facts
- Related links

#### Types Page (`types.html`)
- Page header
- AI type cards (Machine Learning, Deep Learning, NLP, Computer Vision)
- Detailed explanations with sidebar

#### Timeline Page (`timeline.html`)
- Page header
- Full timeline with 10 milestones
- CTA section

#### Contact Page (`contact.html`)
- Page header
- Contact form with validation
- Contact information
- Newsletter signup

### Components

#### Navigation
- Fixed header with blur effect
- Logo with gradient
- Menu links with hover underline
- Mobile hamburger menu
- Active state indicator

#### Cards
- Feature cards with hover effects
- Type cards with gradient icons
- Timeline items with dot markers

#### Forms
- Input fields with focus states
- Real-time validation
- Loading states
- Success/error messages

### Animations

#### Page Load
- Fade-in animations
- Staggered reveals
- Gradient text animation

#### Scroll
- Intersection Observer based animations
- Counter animations
- Parallax effects (optional)

#### Interactions
- Tilt effect on cards
- Magnetic buttons
- Ripple effects
- Particle background

## Backend API

### Endpoints

#### `GET /api/health`
Health check endpoint.

#### `POST /api/subscribe`
Newsletter subscription.
- Body: `{ email: string }`
- Rate limited: 10 requests/15 min

#### `POST /api/contact`
Contact form submission.
- Body: `{ name, email, subject, message }`
- Rate limited: 10 requests/15 min

### Data Storage
In-memory storage (replace with database in production).

## Features

### Accessibility
- Skip links
- ARIA labels
- Keyboard navigation
- Focus visible states
- Reduced motion support

### Performance
- Static file serving
- ETags and caching
- Code splitting (CSS/JS)
- Optimized animations

### Security
- Helmet security headers
- CORS configuration
- Rate limiting
- Input validation

### SEO
- Semantic HTML
- Meta tags
- Open Graph tags
- Sitemap ready

## Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## Acceptance Criteria

- [x] All pages load without errors
- [x] Navigation works across all pages
- [x] Forms validate and submit correctly
- [x] API endpoints respond correctly
- [x] Animations play smoothly
- [x] Mobile menu functions properly
- [x] Responsive on all breakpoints
- [x] Accessibility standards met
- [x] Colors match design system

## Running the Project

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

### Access the Site
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/subscribe | Newsletter signup |
| POST | /api/contact | Contact form |
