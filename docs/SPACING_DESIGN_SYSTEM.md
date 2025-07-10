# SaaS CRM Spacing Design System

## Overview
This spacing design system provides standardized padding, margins, and spacing guidelines for our SaaS CRM application, following modern practices from Stripe, Notion, and Figma.

## Spacing Scale

### Base Scale (8px System)
```
xs:  4px  (0.25rem)
sm:  8px  (0.5rem)
md:  16px (1rem)
lg:  24px (1.5rem)
xl:  32px (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
4xl: 96px (6rem)
5xl: 128px (8rem)
```

### Micro Spacing (for fine adjustments)
```
px:  1px
0.5: 2px  (0.125rem)
1:   4px  (0.25rem)
1.5: 6px  (0.375rem)
2:   8px  (0.5rem)
2.5: 10px (0.625rem)
3:   12px (0.75rem)
```

## Component-Specific Padding Rules

### 1. Cards & Containers
```css
/* Standard Card */
.card-standard: padding: 24px (lg)

/* Compact Card */
.card-compact: padding: 16px (md)

/* Dense Card (tables, lists) */
.card-dense: padding: 12px (3)

/* Hero Cards/Featured */
.card-hero: padding: 32px (xl) desktop, 24px (lg) mobile
```

### 2. Buttons
```css
/* Small Button */
padding: 8px 12px (sm + 3)

/* Medium Button (default) */
padding: 12px 16px (3 + md)

/* Large Button */
padding: 16px 24px (md + lg)

/* Icon-only Button */
padding: 12px (3) for 44px touch target
```

### 3. Form Elements
```css
/* Input Fields */
padding: 12px 16px (3 + md)

/* Textarea */
padding: 16px (md)

/* Form Groups */
margin-bottom: 24px (lg)

/* Form Sections */
margin-bottom: 32px (xl)
```

### 4. Navigation
```css
/* Sidebar Items */
padding: 12px 16px (3 + md)

/* Top Navigation */
padding: 16px 24px (md + lg)

/* Breadcrumbs */
padding: 8px 0 (sm)

/* Tabs */
padding: 12px 16px (3 + md)
```

### 5. Data Display
```css
/* Table Cells */
padding: 12px 16px (3 + md)

/* Table Headers */
padding: 16px (md)

/* List Items */
padding: 12px 16px (3 + md)

/* Status Badges */
padding: 4px 8px (1 + sm)
```

### 6. Modals & Overlays
```css
/* Modal Content */
padding: 32px (xl) desktop, 24px (lg) mobile

/* Modal Header/Footer */
padding: 24px 32px (lg + xl)

/* Popover Content */
padding: 16px (md)

/* Tooltip */
padding: 8px 12px (sm + 3)
```

## Responsive Spacing Guidelines

### Breakpoint-Based Scaling
```css
/* Mobile First Approach */
.responsive-container {
  padding: 16px; /* Base mobile */
}

@media (min-width: 640px) { /* sm */
  .responsive-container {
    padding: 24px;
  }
}

@media (min-width: 1024px) { /* lg */
  .responsive-container {
    padding: 32px;
  }
}

@media (min-width: 1280px) { /* xl */
  .responsive-container {
    padding: 48px;
  }
}
```

### Component Scaling Rules
- **Reduce by 33%** on mobile for large containers
- **Maintain minimum 44px** touch targets
- **Scale text containers** from 16px → 24px → 32px
- **Scale card containers** from 16px → 24px → 32px → 48px

## SaaS-Specific Best Practices

### 1. Dashboard Layouts
```css
/* Page Container */
padding: 24px lg:32px

/* Widget Grid Gap */
gap: 24px lg:32px

/* Widget Internal */
padding: 20px lg:24px

/* Metric Cards */
padding: 16px lg:20px
```

### 2. Data Tables
```css
/* Table Container */
padding: 0 (full bleed)

/* Table Wrapper */
padding: 24px

/* Cell Padding */
padding: 12px 16px

/* Dense Mode */
padding: 8px 12px
```

### 3. Forms & Input Areas
```css
/* Form Container */
padding: 32px

/* Form Sections */
margin-bottom: 32px

/* Field Groups */
margin-bottom: 24px

/* Inline Fields */
gap: 16px
```

### 4. Content Hierarchy
```css
/* Section Spacing */
h1 + content: margin-top: 32px
h2 + content: margin-top: 24px
h3 + content: margin-top: 16px

/* Paragraph Spacing */
margin-bottom: 16px

/* List Item Spacing */
margin-bottom: 8px
```

## CSS Variables Implementation

### Root Variables (add to index.css)
```css
:root {
  /* Spacing Scale */
  --space-px: 1px;
  --space-0-5: 0.125rem; /* 2px */
  --space-1: 0.25rem;    /* 4px */
  --space-1-5: 0.375rem; /* 6px */
  --space-2: 0.5rem;     /* 8px */
  --space-2-5: 0.625rem; /* 10px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */

  /* Component-specific spacing */
  --card-padding-sm: var(--space-4);   /* 16px */
  --card-padding-md: var(--space-6);   /* 24px */
  --card-padding-lg: var(--space-8);   /* 32px */
  --card-padding-xl: var(--space-12);  /* 48px */
  
  --button-padding-sm: var(--space-2) var(--space-3);     /* 8px 12px */
  --button-padding-md: var(--space-3) var(--space-4);     /* 12px 16px */
  --button-padding-lg: var(--space-4) var(--space-6);     /* 16px 24px */
  
  --input-padding: var(--space-3) var(--space-4);         /* 12px 16px */
  --form-gap: var(--space-6);                             /* 24px */
  --form-section-gap: var(--space-8);                     /* 32px */
  
  --nav-item-padding: var(--space-3) var(--space-4);      /* 12px 16px */
  --nav-container-padding: var(--space-4) var(--space-6); /* 16px 24px */
  
  --table-cell-padding: var(--space-3) var(--space-4);    /* 12px 16px */
  --table-dense-padding: var(--space-2) var(--space-3);   /* 8px 12px */
  
  --modal-padding: var(--space-8);                        /* 32px */
  --modal-padding-mobile: var(--space-6);                 /* 24px */
  
  --page-padding: var(--space-6);                         /* 24px */
  --page-padding-lg: var(--space-8);                      /* 32px */
  
  --widget-gap: var(--space-6);                           /* 24px */
  --widget-gap-lg: var(--space-8);                        /* 32px */
}

/* Responsive adjustments */
@media (min-width: 1024px) {
  :root {
    --card-padding-sm: var(--space-5);   /* 20px */
    --card-padding-md: var(--space-8);   /* 32px */
    --card-padding-lg: var(--space-12);  /* 48px */
    --page-padding: var(--space-8);      /* 32px */
    --widget-gap: var(--space-8);        /* 32px */
  }
}
```

## Utility Classes

### Padding Utilities (add to index.css)
```css
@layer utilities {
  /* Standard component padding */
  .padding-card-sm { padding: var(--card-padding-sm); }
  .padding-card-md { padding: var(--card-padding-md); }
  .padding-card-lg { padding: var(--card-padding-lg); }
  .padding-card-xl { padding: var(--card-padding-xl); }
  
  .padding-input { padding: var(--input-padding); }
  .padding-button-sm { padding: var(--button-padding-sm); }
  .padding-button-md { padding: var(--button-padding-md); }
  .padding-button-lg { padding: var(--button-padding-lg); }
  
  .padding-nav-item { padding: var(--nav-item-padding); }
  .padding-table-cell { padding: var(--table-cell-padding); }
  .padding-table-dense { padding: var(--table-dense-padding); }
  
  .padding-modal { padding: var(--modal-padding); }
  .padding-page { padding: var(--page-padding); }
  
  /* Responsive page padding */
  .padding-page-responsive {
    padding: var(--space-4);
  }
  
  @media (min-width: 640px) {
    .padding-page-responsive {
      padding: var(--space-6);
    }
  }
  
  @media (min-width: 1024px) {
    .padding-page-responsive {
      padding: var(--space-8);
    }
  }
  
  /* Container max-widths with padding */
  .container-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--page-padding);
  }
  
  .container-content {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-4);
  }
  
  /* Gap utilities for specific use cases */
  .gap-form { gap: var(--form-gap); }
  .gap-form-section { gap: var(--form-section-gap); }
  .gap-widget { gap: var(--widget-gap); }
  .gap-nav { gap: var(--space-1); }
  .gap-button-group { gap: var(--space-2); }
  .gap-inline { gap: var(--space-4); }
}
```

## Implementation Guide

### 1. Migration Strategy
1. **Phase 1**: Add CSS variables to index.css
2. **Phase 2**: Replace hardcoded values in new components
3. **Phase 3**: Gradually refactor existing components
4. **Phase 4**: Remove hardcoded spacing from legacy components

### 2. Component Standards
```typescript
// ✅ Good: Using design system variables
const Card = ({ children, size = 'md' }) => (
  <div className={`bg-card rounded-lg padding-card-${size}`}>
    {children}
  </div>
)

// ❌ Bad: Hardcoded values
const Card = ({ children }) => (
  <div className="bg-card rounded-lg p-6">
    {children}
  </div>
)
```

### 3. Layout Patterns
```css
/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--widget-gap);
  padding: var(--page-padding);
}

/* Form Layout */
.form-layout {
  display: flex;
  flex-direction: column;
  gap: var(--form-gap);
  padding: var(--card-padding-lg);
}

/* Table Layout */
.table-container {
  padding: var(--card-padding-md);
  overflow-x: auto;
}
```

### 4. Quality Checklist

#### Design Review Checklist
- [ ] All spacing uses design system variables
- [ ] Touch targets are minimum 44px
- [ ] Responsive scaling follows guidelines
- [ ] Visual hierarchy is clear through spacing
- [ ] Loading states maintain spacing structure

#### Code Review Checklist
- [ ] No hardcoded px values in components
- [ ] Spacing utilities used appropriately
- [ ] Mobile-first responsive approach
- [ ] CSS variables used for component spacing
- [ ] Consistent gap usage in flex/grid layouts

### 5. Usage Examples

#### Dashboard Widget
```typescript
const MetricCard = ({ title, value, trend }) => (
  <div className="bg-card rounded-lg padding-card-md">
    <div className="flex items-center justify-between gap-inline">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <TrendIcon trend={trend} />
    </div>
    <div className="mt-2">
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
)
```

#### Form Section
```typescript
const FormSection = ({ title, children }) => (
  <div className="space-y-form-section">
    <h2 className="text-lg font-semibold">{title}</h2>
    <div className="bg-card rounded-lg padding-card-lg">
      <div className="space-y-form-gap">
        {children}
      </div>
    </div>
  </div>
)
```

#### Data Table
```typescript
const DataTable = ({ data, columns }) => (
  <div className="bg-card rounded-lg overflow-hidden">
    <div className="padding-card-md border-b">
      <h3 className="font-semibold">Table Title</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              {columns.map((col, j) => (
                <td key={j} className="padding-table-cell">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)
```

## Maintenance & Evolution

### Regular Reviews
- **Monthly**: Review spacing consistency across new components
- **Quarterly**: Evaluate if spacing scale needs adjustments
- **Annually**: Major design system updates and improvements

### Documentation Updates
- Update this guide when adding new component types
- Document any deviations from standard spacing
- Maintain examples for complex layout patterns

### Performance Considerations
- CSS variables have minimal performance impact
- Utility classes reduce bundle size vs inline styles
- Design tokens enable efficient caching strategies

---

*This spacing design system should be treated as a living document and updated as the application evolves.*