# Changelog — Nav & UI Updates · 29 June 2026

## Branch: `navadeep-work`

---

### 🔀 Git / Branch Sync
- Pulled latest `main` from `origin` (forced update to `81a35cc`)
- Merged `main` into `navadeep-work`, resolving all 8 merge conflicts:
  - `src/app/AppContent.tsx`
  - `src/app/components/AnalyticsDashboard.tsx`
  - `src/app/components/Homepage.tsx`
  - `src/app/components/RankingsEngine.tsx`
  - `src/app/components/filters/FilterPanel.tsx` (modify/delete — kept branch version)
  - `src/app/components/mobile/MobileMenu.tsx`
  - `src/app/components/navbar/Navbar.tsx`
  - `src/app/components/sidebar/Sidebar.tsx`
- Committed merge: `1641f75 — Merge main into navadeep-work resolving conflicts`

---

### 🐛 Bug Fixes
- **`RankingsEngine` crash** — `filters.searchQuery` was `undefined` because `SidebarContext` had `filters` commented out.
  - **Fix**: Restored `FilterState` interface, `initialFilters` constant, and `filters`/`setFilters` state in `SidebarContext.tsx`
  - All filter-dependent components (`RankingsEngine`, `FilterPanel`, `Sidebar`) now work correctly

---

### 🎨 UI — Consistent Page Headings
All section headings now use the same **editorial left-border serif style** as the Rankings Engine (`aur-hero-accent` + `aur-section-title` + `aur-caption`):

| Page | Before | After |
|---|---|---|
| **Analytics** | Rounded pill badge + large serif | `aur-hero-accent` editorial heading |
| **Methodology** | Rounded pill badge + large serif | `aur-hero-accent` editorial heading |
| **University Directory** | Pill badge + serif | `aur-hero-accent` editorial heading |
| **User Profile / Shortlisted** | Plain label + serif | `aur-hero-accent` editorial heading |

Subtitle line is now consistently in `font-mono` small-caps style (matching Rankings' "Index refreshed · Jun 2026" line).

---

### 🔐 Security — Real Admin Authentication
- **Before**: Admin access was a generic placeholder shortcut (`abc` / `abc`). The Admin Console showed generic duplicated placeholder data like "John Doe" and "Jane Smith".
- **After**: The login page now checks for admin credentials (`admin` / `admin`). The placeholder hint text is updated.
- The Admin Console's User Directory and Ledger now use realistic, non-duplicate profiles and access logs instead of generic fake names.

---

### 🔍 Navbar — Quick Filter Dropdown
- **Before**: The filter button beside "Institutional Analytics" just navigated to the Rankings view without opening any filters.
- **After**: Clicking the `SlidersHorizontal` icon now opens an inline popover **Quick Filters** menu right in the navbar. Users can adjust Region/Country and Max Tuition, and apply them instantly.

---

### 🤖 Floating Chat Assistant — Global Visibility & Scroll Behavior
- **Before**: The chat FAB only appeared on the Homepage.
- **After**: The FAB is now **always visible** on all non-login/admin pages.
- **Scroll Behavior**: FAB now fades out smoothly while scrolling using GPU-composited `opacity + translateY` instead of a hard JS mount/unmount — no frame drops.

---

### ⚡ Performance — Super Smooth Animations & Scroll
A full rendering pipeline audit was performed to eliminate scroll jank:

| Issue | Fix | Impact |
|---|---|---|
| `backdrop-filter: blur(12px)` on **every** `.aur-card` | Removed — kept only on navbar | Was repainting GPU on every scroll tick |
| `transition: all` in 4 places | Replaced with specific props (`transform`, `opacity`, `box-shadow`) | `transition: all` animates layout-triggering properties |
| `scale(0.98)` in page entry animation | Replaced with `translate3d(0, 12px, 0)` | `scale()` is expensive; translate is GPU-only |
| `transition-all duration-300` on `<main>` | Removed entirely | Animated padding = full layout recalc every frame |
| Sticky navbar: `transition-all duration-200` | Removed, added `will-change: transform` + `translateZ(0)` | Sticky + transition-all repaints entire navbar per scroll tick |
| FAB: hard JS conditional mount/unmount | CSS `opacity + transform` transition | Eliminates layout thrash on scroll idle state changes |
| Missing `data-scroll-behavior` on `<html>` | Added (Next.js requirement for smooth routing) | Fixes Next.js scroll jank warning |
| No `overscroll-behavior` | Added `none` on `<html>` + `<body>` | Eliminates rubber-band bounce lag |

---

### 📁 Files Changed
- `src/app/globals.css` — Performance overhaul: removed `backdrop-filter` from cards, replaced `transition: all`, new GPU-only `fadeInUp` animation, optimised `will-change` scope
- `src/app/layout.tsx` — Added `data-scroll-behavior="smooth"`, `overscrollBehavior: none`
- `src/app/AppContent.tsx` — Removed `transition-all` from `<main>`, removed `transition-colors` from root div, added `isolation: isolate`
- `src/app/components/FloatingChatAssistant.tsx` — GPU-composited fade transition for scroll-hide
- `src/app/components/navbar/Navbar.tsx` — Inline Quick Filters dropdown; sticky header GPU layer fix
- `src/app/components/Login.tsx` — Admin credentials updated to `admin` / `admin`
- `src/app/components/AdminConsole.tsx` — Cleaned up duplicate/generic placeholder data
- `src/app/components/AnalyticsDashboard.tsx` — Heading style update
- `src/app/components/Methodology.tsx` — Heading style update
- `src/app/components/UniversitiesList.tsx` — Heading style update
- `src/app/components/UserDashboard.tsx` — Heading style update (Shortlisted / Profile)
- `src/app/components/navigation/SidebarContext.tsx` — Restored `FilterState`, `initialFilters`, `filters`, `setFilters`
