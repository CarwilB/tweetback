# Site Header Component

## Overview

The site header provides consistent navigation and branding across all pages of the tweetback Twitter Archive.

## Features

- **Consistent Branding**: Logo with avatar and site title appears on every page
- **Primary Navigation**: Quick access to Home, Recent, Popular pages, and external website link
- **Accessibility**: Proper ARIA labels, semantic HTML, and keyboard navigation support
- **Responsive Design**: Adapts to mobile and desktop viewports
- **Active Page Indication**: Current page is highlighted in the navigation

## Implementation

The header is implemented as a reusable component in `_includes/header.11ty.js` and is automatically included in the main layout (`_includes/layout.11ty.js`).

### File Structure

```
_includes/
├── header.11ty.js      # Header component
└── layout.11ty.js      # Main layout that includes the header
```

### Navigation Items

The header includes the following navigation links:

1. **Home** - Links to the homepage (/)
2. **Recent** - Links to recent tweets page (/recent/)
3. **Popular** - Links to popular tweets page (/popular/)
4. **External Link** - Configurable link to user's main website (from metadata.js)

### Styling

Header styles are defined in `assets/style.css` with the following CSS classes:

- `.site-header` - Main header container
- `.site-header-content` - Content wrapper with max-width
- `.site-title` - Logo and title
- `.site-avatar` - User avatar image
- `.site-nav` - Navigation container
- `.site-nav-list` - Navigation list
- `[aria-current="page"]` - Active page indicator

### Customization

To customize the header:

1. **Change Logo/Avatar**: Update the `avatar` property in `_data/metadata.js`
2. **Modify Navigation Links**: Edit the navigation structure in `_includes/header.11ty.js`
3. **Adjust Styling**: Modify the `.site-header` styles in `assets/style.css`
4. **Add New Navigation Items**: Add new list items to the `.site-nav-list` in `header.11ty.js`

### Accessibility Features

- Semantic HTML5 `<header>` and `<nav>` elements
- ARIA labels for screen readers (`role="banner"`, `aria-label="Main navigation"`)
- `aria-current="page"` attribute for current page indication
- Keyboard navigation support
- Sufficient color contrast for links and text

## Browser Support

The header works across all modern browsers and gracefully degrades for older browsers. The responsive design adapts to:

- Desktop (>768px)
- Tablet (768px)
- Mobile (<512px)
