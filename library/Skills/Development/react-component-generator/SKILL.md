---
name: react-component-generator
description: Generate robust, accessible, and well-typed React components using Tailwind CSS and TypeScript. Use this skill when asked to create a new UI component, page element, or widget.
---

# React Component Generator

This skill guides the creation of high-quality React components following modern best practices.

## Guidelines

When generating a React component, follow these rules:

1. **Language & Framework**: Use React with TypeScript (TSX).
2. **Styling**: Use Tailwind CSS for all styling. Avoid custom CSS files unless strictly necessary.
3. **Props Interface**: Define a clear, well-documented `Props` interface using TypeScript at the top of the file.
4. **Accessibility (a11y)**: Include necessary ARIA attributes, semantic HTML elements (like `<button>`, `<nav>`, `<main>`), and ensure keyboard navigability.
5. **State Management**: Use appropriate React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
6. **Export**: Export the component as the default export.
7. **Modularity**: Break down complex components into smaller, internal helper components if it improves readability.

## Template

Follow this structure for the component:

```tsx
import React from 'react';

export interface {ComponentName}Props {
  /**
   * Description of what this prop does
   */
  title: string;
  // Add other props here
}

/**
 * {ComponentName} component.
 * [Brief description of the component's purpose and usage.]
 */
export default function {ComponentName}({ title }: {ComponentName}Props) {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {/* Component content */}
    </div>
  );
}
```

## Example Prompt Response

When asked to build a "UserCard" component, generate the TypeScript code directly, ensuring it covers edge cases (like missing avatars or long names) and is fully styled with Tailwind.
