# Project Rules

## Styling
- Use Tailwind CSS classes for all static properties first (`flex`, `flex-col`, `items-center`, `overflow-hidden`, `shrink-0`, `rounded`, etc.)
- Only use inline `style={{}}` for dynamic/computed values and CSS custom properties (`var(--...)`)

## Element IDs
- Every HTML element in JSX must have a `data-id` attribute
- Naming: `componentName-descriptiveName` in kebab-case
- For elements in `.map()`, append the index: e.g. `data-id={`move-row-item-${i}`}`
- Use `data-id` not `id` to avoid conflicts
