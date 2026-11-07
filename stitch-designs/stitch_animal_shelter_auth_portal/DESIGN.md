---
name: Warm Shelter Modern
colors:
  surface: '#fff8f5'
  surface-dim: '#e3d8d3'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fdf1ec'
  surface-container: '#f7ece7'
  surface-container-high: '#f1e6e1'
  surface-container-highest: '#ebe0db'
  on-surface: '#201a18'
  on-surface-variant: '#57423c'
  inverse-surface: '#352f2c'
  inverse-on-surface: '#faeee9'
  outline: '#8b716b'
  outline-variant: '#dec0b8'
  surface-tint: '#a53b1f'
  primary: '#a2391d'
  on-primary: '#ffffff'
  primary-container: '#c35133'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a2'
  secondary: '#9e4211'
  on-secondary: '#ffffff'
  secondary-container: '#fd8954'
  on-secondary-container: '#6d2700'
  tertiary: '#855234'
  on-tertiary: '#ffffff'
  tertiary-container: '#a16a4b'
  on-tertiary-container: '#0e0300'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd2'
  primary-fixed-dim: '#ffb4a2'
  on-primary-fixed: '#3c0800'
  on-primary-fixed-variant: '#852409'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb596'
  on-secondary-fixed: '#360f00'
  on-secondary-fixed-variant: '#7d2d00'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#fbb893'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#693b1f'
  background: '#fff8f5'
  on-background: '#201a18'
  surface-variant: '#ebe0db'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system projects a compassionate, trustworthy, and mission-driven personality tailored for modern animal shelter operations, adoption coordinators, and shelter staff. It balances heartfelt warmth with professional operational precision. The emotional tone evokes optimism, safety, and care, avoiding cold clinical SaaS motifs as well as overly playful or cartoonish tropes.

The design movement combines **Modern Tactile Warmth** with **Refined Editorial Layouts**. Interfaces rely on generous white space, soft earth-tinted surfaces, split-screen authentication showcases featuring high-fidelity editorial animal imagery, and clear form hierarchies. Micro-interactions are gentle and reassuring, utilizing subtle state shifts that reward user focus and eliminate cognitive strain during administrative and intake workflows.

## Colors

The palette establishes an organic, sun-drenched atmosphere with rigorous WCAG AA contrast compliance across all text and state combinations.

- **Primary (`#C65335` - Burnt Orange):** Used for primary CTAs, active step indicators, key branding landmarks, and high-emphasis focus rings. Against `#FFFFFF` and `#FFF5EF`, it delivers high-contrast legibility.
- **Secondary / Accent (`#E87945` - Warm Orange):** Used for secondary interactions, hover enhancements, progress bars, and high-priority notification chips.
- **Tertiary (`#F3B18D` - Peach):** Utilized for soft interactive states, container accents, subtle tag fills, and celebratory badge backgrounds.
- **Neutral Primary (`#342E2B` - Dark Brown):** Replaces harsh standard blacks for headers, field labels, and base body text to evoke natural leather and earth textures while maintaining superior readability.
- **Surface Foundations:**
  - Base Canvas: `#FFF5EF` (Warm White / Alabaster Peach)
  - Elevated Container / Cards: `#FFFFFF` (Pure Crisp White)
  - Surface Accent / Tint: `#F9EFEB` (Muted Warm Tint)
- **Dividers & Borders (`#EADCD4` - Soft Stone):** Delineates form fields, cards, and list separators without visual clutter.
- **Muted & Placeholder (`#8D7B74` - Warm Taupe):** Designated for inactive icons, supporting captions, and form placeholder text.
- **System Feedback:** Success states lean warm-forest (`#2E6F40` over `#EAF5EE`), while critical validation warnings rely on deep terracotta-red (`#B83226` over `#FDF0EE`).

## Typography

The design system standardizes on **Plus Jakarta Sans** across all roles to achieve a clean, humane aesthetic with subtle geometric curves that echo shelter warmth without sacrificing structural clarity.

- **Headlines:** Set with tight tracking (`-0.02em` to `-0.01em`) and assertive weights (SemiBold 600, Bold 700) to create clear, grounded visual anchors.
- **Body:** Standard text prioritizes open counter forms and generous line-height ratios (`1.55` to `1.6`) to maintain legibility during dense authentication flows and operational checklists.
- **Labels & Microcopy:** Form input headers and button copy use Medium and SemiBold treatments with neutral-to-slight letter spacing to prevent visual crowding in compact form controls.
- **Mobile Adaptations:** Fluid scaling triggers at mobile breakpoints to downscale oversized display titles into compact alternatives, preventing accidental horizontal line-wrapping on compact handheld viewports.

## Layout & Spacing

Layouts adhere to an 8px base rhythm (`0.5rem = 8px`). The primary layout architecture utilizes a responsive 12-column system on desktop, an 8-column layout on tablet, and a 4-column layout on mobile.

- **Split-Screen Desktop Architecture:** Authentication screens utilize an asymmetrical 50/50 or 55/45 desktop split. The editorial showcase pane anchors the screen with rich, warm photography of shelter animals alongside testimonial badges, while the interactive form card is vertically centered within the counter pane with max content bounding at `480px`.
- **Canvas Margins & Gutters:** Desktop experiences provide `2rem` outer margins and `1.5rem` gutters. On mobile devices (`<768px`), gutters contract to `1rem`, outer margins reduce to `1rem`, and the showcase media collapses into an upper banner or disappears in favor of direct form prioritization.
- **Internal Density:** Form fields maintain an internal vertical spacing of `1rem` (`space-md`), button groups maintain `0.75rem` to `1rem`, and parent form containers employ `2rem` to `2.5rem` (`space-xl`) internal padding.

## Elevation & Depth

Visual depth is achieved through **ambient warm shadows** combined with **subtle low-contrast containment strokes**, avoiding stark drop shadows or flat utilitarian cutouts.

- **Shadow Tinting:** All box-shadow elevations use a brown/terracotta pigment base (`rgba(52, 46, 43, ...)`) instead of neutral charcoal or pure black, harmonizing the ambient light with the warm shelter palette.
- **Level 1 (Subtle Inset / Interactive Rest):** `0px 1px 3px rgba(52, 46, 43, 0.05), 0px 1px 2px rgba(52, 46, 43, 0.03)` with a `1px solid #EADCD4` perimeter. Used for inputs, unselected chips, and flat card boundaries.
- **Level 2 (Containers & Authentication Cards):** `0px 12px 32px -4px rgba(52, 46, 43, 0.08), 0px 4px 12px -2px rgba(52, 46, 43, 0.04)`. Applied to elevated authentication sheets, dialogs, and focused cards.
- **Level 3 (Dropdowns & Popovers):** `0px 20px 40px -8px rgba(52, 46, 43, 0.12), 0px 8px 16px -4px rgba(52, 46, 43, 0.06)`. Reserved for contextual menus, date pickers, and tooltips.
- **Focus Elevation:** Focused fields feature zero elevation jump, relying instead on an outer ring: `0px 0px 0px 3.5px rgba(198, 83, 53, 0.18)` over a crisp `#C65335` border.

## Shapes

The design system incorporates a gentle, welcoming shape language. Geometry utilizes curvature to communicate friendliness and empathy while retaining reliable structural alignment.

- **Base Corner Radius (`rounded-md`):** `0.5rem` (8px). Assigned to checkboxes, status badges, and contextual popover menus.
- **Controls & Buttons (`rounded-lg`):** `0.75rem` to `1rem` (12px–16px). Form inputs, primary buttons, and tab segment selections adopt a rounded profile that feels soft to the touch without turning into full pills.
- **Cards & Modal Sheets (`rounded-xl` / `rounded-2xl`):** `1rem` to `1.5rem` (16px–24px). Hero authentication cards, split-pane media frames, and standalone floating panels display sweeping corners that soften the application's framing edges.
- **Pill Shapes:** Strictly reserved for status chips, intake tags (e.g., "Ready for Adoption"), and avatar badges.

## Components

### Buttons
- **Primary:** Filled `#C65335` with pure `#FFFFFF` label text. Height is `48px` for touch targets with `1rem` border radius. Hover state smooths to `#B44629`; active state drops to `#9D3A20`. Includes an accessible `3px` focus ring in `#C65335` at 20% opacity.
- **Secondary:** Surface `#FFFFFF` with `#EADCD4` border, `#342E2B` label text. Hover switches border to `#C65335` with a `#FFF5EF` background tint.
- **Tertiary / Ghost:** Transparent background with `#C65335` text; transitions to `#F9EFEB` on hover for low-friction secondary actions like "Forgot password?" or "Back to login".

### Form Inputs & Text Fields
- **Container:** Height of `48px`, pure `#FFFFFF` background, `1px solid #EADCD4` border, and `0.75rem` corner radius.
- **Typography:** Value text set in `body-md` (`#342E2B`), placeholder text set in `#8D7B74`.
- **States:**
  - *Rest:* `#EADCD4` outline.
  - *Hover:* `#C65335` outline at 50% opacity.
  - *Active / Focus:* `1.5px solid #C65335` border accompanied by an ambient halo `0px 0px 0px 4px rgba(198, 83, 53, 0.15)`.
  - *Error:* `1.5px solid #B83226` border, `#B83226` helper text, and a light `#FDF0EE` tinted background.
- **Password Strength Indicators:** Segmented horizontal pill meter using `#EADCD4` (empty), `#E87945` (fair), and `#2E6F40` (secure).

### Cards & Authentication Containers
- Form containers are constructed on `#FFFFFF` with `1.5rem` border radius, reinforced by Level 2 ambient brown shadows and an optional subtle perimeter outline of `#EADCD4`.
- The split-screen visual container features edge-to-edge media masking, inner gradient scrims (`rgba(52, 46, 43, 0.45)` down to transparent) for legible editorial quotes, and floating animal shelter identity badges.

### Checkboxes & Radios
- Size: `20px x 20px` with `6px` radius for checkboxes; circular for radios.
- Unchecked: `#FFFFFF` fill with `1.5px solid #EADCD4`.
- Checked: `#C65335` fill with a crisp white centered check icon or dot.
- Focus: Offset focus indicator with `2px` white gap and `2px #C65335` outline.

### Chips & Badges
- **Status Badges:** Compact `24px` height, pill-shaped (`9999px` radius), padding `0.25rem 0.75rem`.
- Text is `label-sm` uppercase or small-caps.
- Adoption ready: `#EAF5EE` background, `#2E6F40` text.
- Medical hold / In review: `#FFF5EF` background, `#C65335` text.

### Segmented Switchers & Social Auth
- Social OAuth buttons (e.g., Google or Shelter Partner SSO) feature full-width `48px` layouts, `#FFFFFF` surfaces, subtle `#EADCD4` borders, `#342E2B` labels, and brand-accurate icons with `0.75rem` border radius.