import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useRecoilValue } from 'recoil'
import { selectedNodes } from '@/app/store/atoms/nodes'
import { toast } from 'react-toastify'
import MapInfoDialog from './MapInfoDialog'

interface CompareDialogProps {
  isOpen: boolean
  onClose: () => void
  onCompare: (selectedNodes: any[]) => void
  isLoading?: boolean
}

const CompareDialog: React.FC<CompareDialogProps> = ({
  isOpen,
  onClose,
  onCompare,
  isLoading = false
}) => {
  const selectedNodesList = useRecoilValue(selectedNodes)
  const [showResult, setShowResult] = useState(false)
  const [comparisonResult, setComparisonResult] = useState('')

  const handleCompare = async () => {
    if (selectedNodesList.length < 2) {
      toast.error("Please select at least 2 nodes to compare")
      return
    }

    try {
      await onCompare(selectedNodesList)
      onClose()
    } catch (error) {
      toast.error("Failed to generate comparison")
    }
  }

  const handleResultConfirm = (result: string) => {
    setComparisonResult(result)
    setShowResult(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Compare Selected Nodes
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selected Nodes Display */}
            <div>
              <h4 className="text-sm font-medium mb-2">Selected Nodes ({selectedNodesList.length})</h4>
              <ScrollArea className="max-h-[150px] border rounded-lg p-2">
                <div className="space-y-2">
                  {selectedNodesList.map((node, index) => (
                    <div key={node.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-blue-500 rounded-full">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium truncate">
                        {node.type === 'dataNode' ? node.data.title :
                         node.type === 'titleNode' ? node.data.label :
                         node.data.term || node.data.label}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {selectedNodesList.length < 2 && (
                <p className="text-xs text-red-500 mt-1">
                  Select at least 2 more nodes (hold Shift and click)
                </p>
              )}
            </div>



            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleCompare}
                disabled={selectedNodesList.length < 2 || isLoading}
              >
                {isLoading ? 'Comparing...' : 'Compare Nodes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MapInfoDialog
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        onConfirm={() => {
          // This will be handled by the parent component
          setShowResult(false)
        }}
        content={comparisonResult}
        isLoading={false}
      />
    </>
  )
}

export default CompareDialog
