import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { TextShimmer } from "./ui/text-shimmer"
import ReactMarkdown from 'react-markdown'
import { ScrollArea } from "./ui/scroll-area"

interface MapInfoDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  content: string
  isLoading?: boolean
}

export default function MapInfoDialog({ isOpen, onClose, onConfirm, content, isLoading }: MapInfoDialogProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>{isLoading ? "Generating Information..." : "Add Information to Map?"}</DialogTitle>
          <DialogDescription>
            {isLoading ? "Please wait while we generate the information." : "Would you like to add this information to the map?"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[150px] mt-4 mb-6 rounded-md">
          <div className="p-4 bg-gray-50">
            {isLoading ? (
              <div className="flex justify-center items-center h-[100px]">
                <TextShimmer className='text-sm' duration={1}>
                  Generating information...
                </TextShimmer>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground prose prose-sm max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Generating..." : "Add to Map"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

