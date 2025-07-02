# Medical Billing Management System - Figma Design System Guide

## Color Palette (HSL Values)

### Light Mode
```
Background: hsl(40, 30%, 98%)
Foreground: hsl(20, 50%, 15%)
Card: hsl(0, 0%, 100%)
Card Foreground: hsl(20, 50%, 15%)

Primary: hsl(15, 75%, 55%) - Orange-red accent
Primary Foreground: hsl(0, 0%, 100%)

Secondary: hsl(25, 50%, 95%) - Light warm gray
Secondary Foreground: hsl(20, 50%, 15%)

Muted: hsl(25, 50%, 95%)
Muted Foreground: hsl(20, 40%, 40%)

Accent: hsl(50, 100%, 60%) - Bright yellow
Accent Foreground: hsl(20, 50%, 15%)

Destructive: hsl(0, 85%, 60%) - Red for errors
Destructive Foreground: hsl(0, 0%, 100%)

Border: hsl(20, 30%, 85%)
Input: hsl(20, 30%, 85%)
Ring: hsl(15, 75%, 55%)
```

### Dark Mode
```
Background: hsl(20, 50%, 5%)
Foreground: hsl(20, 40%, 90%)
Card: hsl(20, 50%, 8%)
Card Foreground: hsl(20, 40%, 90%)

Primary: hsl(15, 75%, 55%) - Same orange-red
Primary Foreground: hsl(0, 0%, 100%)

Secondary: hsl(20, 40%, 15%)
Secondary Foreground: hsl(20, 40%, 90%)

Muted: hsl(20, 40%, 15%)
Muted Foreground: hsl(20, 40%, 60%)

Accent: hsl(50, 100%, 50%) - Bright yellow (darker)
Accent Foreground: hsl(20, 50%, 5%)

Destructive: hsl(0, 70%, 50%)
Destructive Foreground: hsl(20, 40%, 90%)

Border: hsl(20, 40%, 20%)
Input: hsl(20, 40%, 20%)
Ring: hsl(15, 75%, 55%)
```

### Sidebar Colors
```
Light Mode:
- Background: hsl(0, 0%, 98%)
- Foreground: hsl(240, 5.3%, 26.1%)
- Primary: hsl(240, 5.9%, 10%)
- Accent: hsl(240, 4.8%, 95.9%)
- Border: hsl(220, 13%, 91%)

Dark Mode:
- Background: hsl(240, 5.9%, 10%)
- Foreground: hsl(240, 4.8%, 95.9%)
- Primary: hsl(224.3, 76.3%, 48%)
- Accent: hsl(240, 3.7%, 15.9%)
- Border: hsl(240, 3.7%, 15.9%)
```

## Typography

### Font Family
- Primary: 'Poppins', sans-serif

### Text Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)

### Font Weights
- medium: 500
- semibold: 600
- bold: 700

## Spacing & Layout

### Border Radius
- sm: calc(var(--radius) - 4px) ≈ 4px
- md: calc(var(--radius) - 2px) ≈ 6px
- lg: var(--radius) ≈ 8px

### Container
- Max Width: 1400px (2xl breakpoint)
- Padding: 2rem (32px)
- Centered

### Grid Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1400px

## Component Specifications

### Buttons
```
Default:
- Height: 40px (h-10)
- Padding: 16px horizontal, 8px vertical
- Background: Primary color
- Text: Primary foreground
- Border radius: md (6px)
- Font: 14px medium

Small:
- Height: 36px (h-9)
- Padding: 12px horizontal
- Border radius: md

Large:
- Height: 44px (h-11)
- Padding: 32px horizontal
- Border radius: md

Icon:
- Width: 40px
- Height: 40px
- Padding: 0
```

### Cards
```
Standard Card:
- Background: Card color
- Text: Card foreground
- Border: 1px solid border color
- Border radius: lg (8px)
- Padding: 24px (p-6)
- Shadow: sm

Card Header:
- Padding bottom: 24px
- Border bottom: 1px solid border

Card Content:
- Default padding: 24px
- Can be set to p-0 for full-width content
```

### Navigation

#### Desktop Sidebar
- Width: Fixed
- Background: Sidebar background
- Border right: 1px solid sidebar border
- Items: 48px height minimum for touch targets

#### Mobile Navigation
- Bottom navigation bar
- Fixed position
- Safe area insets for iOS
- Minimum 44px touch targets

### Form Elements

#### Input Fields
- Height: 40px minimum (44px on mobile)
- Padding: 12px horizontal
- Border: 1px solid input color
- Border radius: md
- Background: Background color

#### Select Dropdowns
- Same sizing as inputs
- Background: White/card color
- Border: Border color
- Shadow: lg for dropdown content
- Z-index: 50

### Status Indicators

#### Badges
```
Success (Green): 
- Background: hsl(120, 100%, 95%)
- Text: hsl(120, 100%, 25%)

Warning (Yellow):
- Background: hsl(50, 100%, 95%)
- Text: hsl(50, 100%, 25%)

Error (Red):
- Background: hsl(0, 100%, 95%)
- Text: hsl(0, 100%, 25%)

Info (Blue):
- Background: hsl(210, 100%, 95%)
- Text: hsl(210, 100%, 25%)
```

### Tables
- Row height: 64px minimum
- Padding: 16px in cells
- Border bottom: 1px solid border color
- Hover: Muted background (50% opacity)

### Mobile Optimizations
- Minimum touch targets: 44px
- Cards: 12px padding (reduced from 24px)
- Grid: Single column on mobile
- Safe area insets for iOS devices
- Prevent horizontal scroll

## Animations

### Transitions
- Duration: 200ms for quick interactions
- Duration: 300ms for content changes
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### Hover Effects
- Scale: 1.05 (hover-scale class)
- Duration: 200ms

### Page Transitions
- Fade in: 300ms ease-out
- Y-translate: 10px → 0px

## Layout Patterns

### Dashboard Grid
- Desktop: 3-4 columns
- Tablet: 2 columns  
- Mobile: 1-2 columns
- Gap: 24px (gap-6)

### Page Structure
```
Container (max-w-7xl mx-auto)
├── Header Section (space-y-2)
│   ├── Title (text-3xl font-bold)
│   └── Description (text-muted-foreground)
├── Content Cards (space-y-6)
└── Actions/Dialogs
```

### Navigation Groups
```
Core Operations:
- Dashboard, Reports

Client Management:
- Clients, Claims, Pipeline

Operations:
- Tasks, Data Management, Month-End Close

Advanced Features:
- Credentialing, Team Dashboard, File Vault

Administration:
- Settings, Subscription Admin
```

## Accessibility
- Minimum contrast ratios met
- Focus indicators visible
- Touch targets 44px minimum
- Semantic HTML structure
- ARIA labels where needed

Use this guide to recreate the design system in Figma with proper color styles, text styles, and component variants.