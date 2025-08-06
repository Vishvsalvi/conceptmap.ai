import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import ExternalDataDialog from '../ExternalDataDialog'
import { FetchExternalSourceDialogProps, SourceData } from './types'
import { EXTERNAL_SOURCES } from './constants'
import { useExternalResources } from './hooks/useExternalResources'

const FetchExternalSourceDialog: React.FC<FetchExternalSourceDialogProps> = ({ 
  isOpen, 
  onClose, 
  fetchDescription, 
  nodeLabel 
}) => {
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false)
  const [sourceData, setSourceData] = useState<SourceData[]>([])

  const { getResources, fetchYouTubeVideos } = useExternalResources({
    onSuccess: setSourceData,
    onDialogOpen: setIsSourceDialogOpen
  })

  const handleSourceClick = async (sourceName: string) => {
    if (sourceName === "YouTube") {
      await fetchYouTubeVideos(nodeLabel, setSourceData)
    } else if (["Books", "References", "Recent Developments"].includes(sourceName)) {
      fetchDescription({ intent: sourceName, selectedNodeData: nodeLabel, isExpertMode: false })
    } else {
      await getResources({ source: sourceName, topic: nodeLabel })
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Research using external sources of information
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {/* First two rows */}
            <div className="grid grid-cols-4 gap-2">
              {EXTERNAL_SOURCES.slice(0, 8).map((source) => (
                <DialogClose key={source.name} asChild>
                  <Button
                    variant="secondary"
                    className="justify-start gap-2"
                    size="sm"
                    onClick={() => handleSourceClick(source.name)}
                  >
                    <source.icon className="h-4 w-4" />
                    {source.name.length > 10 ? `${source.name.slice(0, 10)}...` : source.name}
                  </Button>
                </DialogClose>
              ))}
            </div>

            {/* Third row */}
            <div className="grid grid-cols-12 gap-2">
              {EXTERNAL_SOURCES.slice(8).map((source) => (
                <DialogClose key={source.name} asChild>
                  <Button
                    variant="secondary"
                    className="col-span-4 justify-start gap-2"
                    size="sm"
                    onClick={() => handleSourceClick(source.name)}
                  >
                    <source.icon className="h-4 w-4" />
                    {source.name}
                  </Button>
                </DialogClose>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ExternalDataDialog
        isOpen={isSourceDialogOpen}
        externalData={sourceData}
        onClose={() => setIsSourceDialogOpen(false)}
      />
    </div>
  )
}

export default FetchExternalSourceDialog