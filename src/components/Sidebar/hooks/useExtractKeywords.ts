import { useMutation } from '@tanstack/react-query'

interface UseExtractKeywordsProps {
  onSuccess: (data: string[]) => void
  onDialogOpen: (open: boolean) => void
}

export const useExtractKeywords = ({ onSuccess, onDialogOpen }: UseExtractKeywordsProps) => {
  const { mutate: extractKeywords, isPending: isLoading } = useMutation({
    mutationFn: async (paragraph: string) => {
      console.log("Extracting keywords")
      onDialogOpen(true)
      
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paragraph }),
      })
      
      const terms = await response.json()
      return terms.data
    },
    onSuccess: (data) => {
      onSuccess(data)
    },
    onError: (error) => {
      console.error(error)
      onDialogOpen(false)
    }
  })

  return { extractKeywords, isLoading }
}