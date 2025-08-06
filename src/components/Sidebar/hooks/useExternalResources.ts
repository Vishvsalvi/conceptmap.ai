import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { SourceData } from '../types'

interface UseExternalResourcesProps {
  onSuccess: (data: SourceData[]) => void
  onDialogOpen: (open: boolean) => void
}

export const useExternalResources = ({ onSuccess, onDialogOpen }: UseExternalResourcesProps) => {
  const { mutate: getResources, isPending } = useMutation({
    mutationFn: async ({ source, topic }: { source: string, topic: string }) => {
      if (!topic) {
        toast.error("Please select or drag a node")
        return
      }
      
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source, topic }),
      })
      
      const data = await response.json()
      return data
    },
    onSuccess: (data) => {
      if (data) {
        onSuccess(data.data)
        onDialogOpen(true)
        console.log(data)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred")
      onDialogOpen(false)
    },
  })

  const fetchYouTubeVideos = async (topics: string, onSuccess: (data: any[]) => void) => {
    console.log(topics)
    if (!topics) {
      toast.error("Please select or drag a node")
      return
    }
    
    console.log(topics.split(' ').length <= 5)

    if (!(topics.split(' ').length <= 5)) {
      toast.error("Please select the topic node")
      return
    }

    try {
      const query = topics.trim().split(/\s+/).join('+')
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=What+is+${query}&maxResults=10&type=video&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      )
      const data = await response.json()
      onDialogOpen(true)
      onSuccess(data.items)
    } catch (error) {
      console.error(error)
      return []
    }
  }

  return { getResources, fetchYouTubeVideos, isPending }
}