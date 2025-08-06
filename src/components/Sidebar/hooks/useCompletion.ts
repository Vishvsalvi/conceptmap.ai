import { useCompletion as useAiCompletion } from 'ai/react'
import { toast } from 'react-toastify'

interface UseCompletionProps {
  onDialogOpen: (open: boolean) => void
  onIntentChange: (intent: string) => void
}

export const useCompletionHook = ({ onDialogOpen, onIntentChange }: UseCompletionProps) => {
  const { completion, complete, isLoading: isCompletionLoading } = useAiCompletion({
    api: '/api/prompt',
    experimental_throttle: 16, // ~60fps for ultra-smooth streaming
    headers: {
      'Cache-Control': 'no-cache', // Prevent caching for faster responses
    },
    onResponse: (response) => {
      if (!response.ok) {
        toast.error("Failed to fetch response")
        onDialogOpen(false)
      }
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred")
      onDialogOpen(false)
    },
    onFinish: () => {
      // Streaming finished - UI will automatically update via completion state
    }
  })

  const fetchDescription = async ({ 
    intent, 
    selectedNodeData, 
    isExpertMode = false 
  }: { 
    intent: string
    selectedNodeData: string
    isExpertMode?: boolean 
  }) => {
    if (!selectedNodeData) {
      toast.error("Please select or drag a node")
      return
    }
    onDialogOpen(true)
    onIntentChange(intent)
    
    await complete(intent, {
      body: { intent, selectedNodeData, isExpert: isExpertMode }
    })
  }

  return {
    completion,
    isCompletionLoading,
    fetchDescription
  }
}