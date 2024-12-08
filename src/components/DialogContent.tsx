import { Button } from "./ui/button"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { TextShimmer } from "./ui/text-shimmer"
import ReactMarkdown from 'react-markdown'
import { memo } from 'react'

interface DialogContentProps {
  isLoading: boolean;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default memo(function DialogInnerContent({ 
  isLoading, 
  content, 
  onClose, 
  onConfirm 
}: DialogContentProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isLoading ? "Generating Information..." : "Add Information to Map?"}</DialogTitle>
        <DialogDescription>
          {isLoading ? "Please wait while we generate the information." : "Would you like to add this information to the map?"}
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[300px] overflow-y-auto mt-4 mb-6 p-4 bg-gray-50 rounded-md">
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
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Generating..." : "Add to Map"}
        </Button>
      </div>
    </DialogContent>
  );
});