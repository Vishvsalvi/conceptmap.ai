# Sidebar Component

## Structure

The Sidebar component has been refactored into a modular architecture for better maintainability and readability.

### Directory Structure

```
Sidebar/
├── index.tsx                     # Main Sidebar component
├── FetchExternalSourceDialog.tsx # External sources dialog component
├── constants.ts                  # Button configurations and external sources
├── types.ts                      # TypeScript interfaces and types
├── hooks/
│   ├── useCompletion.ts         # Hook for AI completion functionality
│   ├── useExtractKeywords.ts    # Hook for keyword extraction
│   └── useExternalResources.ts  # Hook for fetching external resources
└── README.md                     # This file
```

## Components

### Main Sidebar (`index.tsx`)
The main component that orchestrates all sidebar functionality. It manages:
- New topic creation
- Action buttons grid
- Expert mode toggle
- Dialog management
- Event handling

### FetchExternalSourceDialog
Handles the external source selection dialog for research purposes. Supports:
- Wikipedia, arXiv, PubMed searches
- YouTube video searches
- News and references
- Other academic sources

## Hooks

### useCompletionHook
Manages AI completion requests with:
- Streaming responses
- Error handling
- Loading states
- Expert mode support

### useExtractKeywords
Handles keyword extraction from selected nodes:
- API calls to extraction endpoint
- Loading states
- Success/error handling

### useExternalResources
Manages external resource fetching:
- Research API calls
- YouTube API integration
- Source-specific handling

## Constants

### SIDEBAR_BUTTONS
Array of button configurations with labels, tooltips, and badge indicators.

### EXTERNAL_SOURCES
List of external sources with their icons for research functionality.

### DIALOG_OPTIONS
List of intents that require the options dialog.

## Usage

```tsx
import Sidebar from '@/components/Sidebar'

<Sidebar
  addNewNode={handleAddNewNode}
  addDescriptionNode={handleAddDescriptionNode}
  addNewEdge={handleAddNewEdge}
/>
```

## Props

- `addNewNode`: Function to add a new node to the concept map
- `addDescriptionNode`: Function to add a node with title and description
- `addNewEdge`: Function to connect two nodes

## Dependencies

- React Flow for node/edge management
- Recoil for state management
- Next-Auth for authentication
- React Query for API calls
- AI SDK for completion streaming
- React Toastify for notifications

## Future Improvements

1. Consider extracting button click logic to a separate handler
2. Add unit tests for hooks
3. Implement error boundaries
4. Add analytics tracking for button usage
5. Consider implementing a command pattern for actions