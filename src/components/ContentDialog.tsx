"use client"

import React, {useState} from 'react'
import ReactMarkdown from 'react-markdown'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from "@/components/ui/skeleton"
import { createContent } from '@/app/actions/map'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

interface ContentDialogProps {
  open: boolean
  onClose: () => void
  content: {
    title: string
    content: string
  }
  isLoading: boolean,
  contentType: string
}

const ContentDialog = React.memo(
function ContentDialog({ open, onClose, content, isLoading, contentType }: ContentDialogProps) {
    const defaultContent = {
      title: 'Loading...',
      content: '',
    }

    const [isSaving, setIsSaving] = useState(false)
    
    const effectiveContent = content || defaultContent
    const { data: session } = useSession()

    
    const handleSave = async () => {
     try {
      if (session && session.user) {
      await createContent({
          name: effectiveContent.title,
          content: effectiveContent.content,
          type: contentType,
          email: session.user.email
        })
        onClose();
      } else {
        toast.error('Failed to save content: User session is not available.')
      }
      onClose()
      toast.success(`${contentType.toLowerCase()} saved successfully`)
     } catch (error) {
      console.error(error)
      return toast.error('Failed to save content')
     }
    }

    const handleCancel = () => {
      onClose()
    }

    const SkeletonLoader = () => (
      <div className="space-y-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[400px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[350px]" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-4 w-[300px]" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{isLoading ? 'Loading...' : effectiveContent.title}</DialogTitle>
            <DialogDescription>
              {isLoading ? 'Please wait while we load the content...' : 'Scroll to read the full content'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[calc(80vh-180px)] pr-4">
            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{effectiveContent.content}</ReactMarkdown>
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
          
            <Button onClick={handleSave} disabled={isLoading}>
              {isSaving ? 'Saving...' : 'Save'}
              {isLoading && '...'}
            </Button>
           
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  (prevProps, nextProps) =>
    prevProps.open === nextProps.open &&
    prevProps.content.title === nextProps.content.title &&
    prevProps.content.content === nextProps.content.content &&
    prevProps.isLoading === nextProps.isLoading
)

export default ContentDialog

