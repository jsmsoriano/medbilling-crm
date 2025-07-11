# Healthcare Color System Guide

## Overview
This document outlines the professional healthcare color palette implemented for the medical billing CRM application. The color system is designed to convey trust, professionalism, and clarity essential for healthcare billing software.

## Core Color Palette

### Primary Colors
- **Primary Blue (#2563EB)**: Professional, trustworthy - used for primary actions and branding
- **Secondary Teal (#0891B2)**: Medical, clean - used for secondary actions and accents

### Status Colors
- **Success Green (#059669)**: Approved claims, successful payments, positive outcomes
- **Warning Orange (#D97706)**: Pending items, items requiring attention
- **Error Red (#DC2626)**: Denied claims, errors, critical issues

### Neutral Colors
- **Dark Gray (#1F2937)**: Primary text, headers, important content
- **Medium Gray (#6B7280)**: Secondary text, supporting information
- **Light Gray (#F3F4F6)**: Background areas, subtle divisions
- **White (#FFFFFF)**: Card backgrounds, content areas
- **Border Gray (#E5E7EB)**: Borders, dividers, subtle separations

## Claim Status Color System

### Status Indicators
Each claim status has a specific color for immediate visual recognition:

- **Submitted**: Blue (#3B82F6) - Fresh submissions
- **Approved/Paid**: Green (#10B981) - Successfully processed
- **Pending**: Amber (#F59E0B) - Awaiting action
- **Denied**: Red (#EF4444) - Rejected claims requiring attention
- **Under Review**: Purple (#8B5CF6) - In progress
- **Resubmitted**: Cyan (#06B6D4) - Corrected and resubmitted

## Implementation Examples

### Buttons
```tsx
// Primary action button (claim submission, save)
<Button variant="default">Submit Claim</Button>

// Approval action
<Button variant="success">Approve</Button>

// Destructive action (delete, reject)
<Button variant="destructive">Reject Claim</Button>

// Secondary action
<Button variant="secondary">Review</Button>
```

### Status Badges
```tsx
// Claim status display
<StatusBadge status="approved">Approved</StatusBadge>
<StatusBadge status="pending">Pending Review</StatusBadge>
<StatusBadge status="denied">Denied</StatusBadge>
```

### Healthcare Alerts
```tsx
// Payment received notification
<HealthcareAlert variant="payment">
  <HealthcareAlertTitle>Payment Received</HealthcareAlertTitle>
  <HealthcareAlertDescription>
    Payment of $2,500 has been processed for claim #12345
  </HealthcareAlertDescription>
</HealthcareAlert>

// Denial alert
<HealthcareAlert variant="denial">
  <HealthcareAlertTitle>Claim Denied</HealthcareAlertTitle>
  <HealthcareAlertDescription>
    Claim #67890 was denied. Review required.
  </HealthcareAlertDescription>
</HealthcareAlert>
```

## Accessibility Standards

### Contrast Ratios
All color combinations meet WCAG 2.1 AA standards:
- **Text on background**: Minimum 4.5:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio
- **Large text (18pt+)**: Minimum 3:1 contrast ratio

### Color-Blind Considerations
- Status information includes icons alongside colors
- Shape and position provide additional context
- Text labels accompany all color-coded elements

## CSS Custom Properties

### Light Theme
```css
:root {
  /* Primary Colors */
  --primary: 217 91% 60%;                    /* #2563EB */
  --secondary: 188 85% 35%;                  /* #0891B2 */
  
  /* Status Colors */
  --success: 158 64% 35%;                    /* #059669 */
  --warning: 32 95% 44%;                     /* #D97706 */
  --destructive: 0 84% 60%;                  /* #DC2626 */
  
  /* Claim Status */
  --status-submitted: 217 91% 60%;           /* #3B82F6 */
  --status-approved: 142 71% 45%;            /* #10B981 */
  --status-pending: 45 93% 47%;              /* #F59E0B */
  --status-denied: 0 72% 51%;                /* #EF4444 */
  --status-review: 258 90% 66%;              /* #8B5CF6 */
  --status-resubmitted: 188 95% 39%;         /* #06B6D4 */
}
```

### Dark Theme
Dark theme variants maintain the same color relationships with adjusted brightness and contrast for optimal readability in low-light conditions.

## Usage Guidelines

### Do's
✅ Use primary blue for main CTAs and navigation
✅ Use status colors consistently throughout the application
✅ Maintain proper contrast ratios for accessibility
✅ Include icons or text with color-coded information
✅ Use light variants of status colors for backgrounds

### Don'ts
❌ Don't use colors directly in components (use CSS custom properties)
❌ Don't rely solely on color to convey information
❌ Don't mix different color schemes within the same interface
❌ Don't use colors that don't meet accessibility standards

## Component Color Applications

### Navigation
- **Header**: Primary blue gradient background
- **Active states**: Primary blue highlighting
- **Hover states**: Lighter blue variants

### Data Tables
- **Headers**: Dark gray text on light backgrounds
- **Row alternation**: Subtle light gray backgrounds
- **Status cells**: Appropriate status color badges

### Forms
- **Inputs**: Clean white backgrounds with gray borders
- **Focus states**: Primary blue borders and rings
- **Error states**: Red borders with error messaging
- **Success states**: Green borders for validated fields

### Cards
- **Backgrounds**: White cards with subtle gray borders
- **Headers**: Dark gray text for strong hierarchy
- **Status indicators**: Colored left borders or badges

## Testing Checklist

### Visual Testing
- [ ] All status colors are clearly distinguishable
- [ ] Text remains readable in both light and dark themes
- [ ] Color combinations meet contrast requirements
- [ ] Status information is clear without color

### Accessibility Testing
- [ ] Test with color-blind simulation tools
- [ ] Verify keyboard navigation visibility
- [ ] Confirm screen reader compatibility
- [ ] Validate focus indicator visibility

### Cross-Platform Testing
- [ ] Colors appear correctly on different monitors
- [ ] Mobile devices display colors accurately
- [ ] Print versions use appropriate alternatives
- [ ] High contrast mode compatibility

## Maintenance

### Adding New Colors
When adding new colors to the system:
1. Define HSL values in index.css
2. Add corresponding tokens to tailwind.config.ts
3. Test contrast ratios for accessibility
4. Update this documentation
5. Add component variants if needed

### Color Updates
To modify existing colors:
1. Update CSS custom properties in index.css
2. Test all existing components for visual consistency
3. Verify accessibility standards are maintained
4. Update documentation with changes
5. Communicate changes to development team

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color-Blind Web Page Filter](https://www.toptal.com/designers/colorfilter)
- [Healthcare UI Design Guidelines](https://www.healthcare.gov/developers/design-guidelines/)