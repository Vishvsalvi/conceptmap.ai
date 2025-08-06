export interface SidebarProps {
  addNewNode: (content: string, viewportCenter?: { x: number; y: number }) => string | undefined
  addDescriptionNode: (title: string, description: string) => string
  addNewEdge: (source: string, target: string) => void
}

export interface FetchExternalSourceDialogProps {
  isOpen: boolean
  onClose: () => void
  fetchDescription: ({ intent, selectedNodeData, isExpertMode }: { intent: string, selectedNodeData: string, isExpertMode?: boolean }) => void
  nodeLabel: string
}

export interface SourceData {
  title: string
  link: string
  source: string
}

export interface YouTubeVideoItem {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: {
        url: string
      }
    }
  }
}

export interface ButtonConfig {
  label: string
  tooltip: string
  badge?: boolean
}

export interface ExternalSource {
  name: string
  icon: any
}