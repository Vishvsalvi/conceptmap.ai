import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CustomQuestionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (customQuestion: string) => void
  nodeLabel: string
  isLoading?: boolean
}

const CustomQuestionDialog: React.FC<CustomQuestionDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  nodeLabel,
  isLoading = false
}) => {
  const [customQuestion, setCustomQuestion] = useState('')

  const handleSubmit = () => {
    if (customQuestion.trim()) {
      onSubmit(customQuestion.trim())
      setCustomQuestion('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Ask a any Question
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label htmlFor="custom-question" className="text-sm font-medium">
              Your Question
            </label>
            <Textarea
              id="custom-question"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              className="mt-2 min-h-[80px] resize-none"
              placeholder="e.g., What are the practical applications of this concept?"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to submit, Shift+Enter for new line
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleSubmit}
              disabled={!customQuestion.trim() || isLoading}
            >
              {isLoading ? 'Getting Answer...' : 'Ask Question'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomQuestionDialog
