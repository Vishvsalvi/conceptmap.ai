import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRecoilValue } from 'recoil'
import { nodeLabelState, targetNode } from '@/app/store/atoms/nodelabel'
import { toast } from 'react-toastify'
import { useReactFlow } from '@xyflow/react'
import { signOut } from 'next-auth/react'

// Import dialogs
import MapInfoDialog from '../MapInfoDialog'
import SubjectPersonDialogOption from '../SubjectPersonDialogOption'
import OptionsDialog from '../OptionsDialog'
import TermSelectionDialog from '../TermSelectionDialog'
import FetchExternalSourceDialog from './FetchExternalSourceDialog'

// Import constants and types
import { SIDEBAR_BUTTONS, DIALOG_OPTIONS } from './constants'
import { SidebarProps } from './types'

// Import custom hooks
import { useCompletionHook } from './hooks/useCompletion'
import { useExtractKeywords } from './hooks/useExtractKeywords'

const Sidebar: React.FC<SidebarProps> = ({ addNewNode, addDescriptionNode, addNewEdge }) => {
  // State management
  const [content, setContent] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentIntent, setCurrentIntent] = useState('')
  const [subjectPersonOpen, setSubjectPersonOpen] = useState(false)
  const [externalDialogIsOpen, setExternalDialogIsOpen] = useState(false)
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false)
  const [optionsDialogIntent, setOptionsDialogIntent] = useState<string>("")
  const [extractedWords, setExtractedWords] = useState<string[]>([])
  const [isConceptSelectionDialogOpen, setIsConceptSelectionDialogOpen] = useState(false)
  const [isLogout, setIsLogout] = useState(false)
  const [isExpertMode, setIsExpertMode] = useState(false)

  // Recoil values
  const nodeLabel = useRecoilValue(nodeLabelState)
  const target = useRecoilValue(targetNode)

  // React Flow hooks
  const { zoomOut, fitView, getViewport, setViewport } = useReactFlow()

  // Custom hooks
  const { completion, isCompletionLoading, fetchDescription } = useCompletionHook({
    onDialogOpen: setDialogOpen,
    onIntentChange: setCurrentIntent
  })

  const { extractKeywords, isLoading: isExtractLoading } = useExtractKeywords({
    onSuccess: setExtractedWords,
    onDialogOpen: setIsConceptSelectionDialogOpen
  })

  // Event handlers
  const handleSignOut = () => {
    signOut()
  }

  const handleConfirmAddToMap = () => {
    const newNodeId = addDescriptionNode(currentIntent, completion)
    addNewEdge(target, newNodeId)
    setDialogOpen(false)
  }

  const handleNewTopic = () => {
    // Get current viewport to calculate center position
    const viewport = getViewport()
    const viewportCenter = {
      x: (-viewport.x + window.innerWidth / 2) / viewport.zoom,
      y: (-viewport.y + window.innerHeight / 2) / viewport.zoom
    }
    
    // Add new node at viewport center
    const newNodeId = addNewNode(content, viewportCenter)
    
    if (newNodeId) {
      // Add a small delay to ensure the node is rendered first
      setTimeout(() => {
        // First zoom out smoothly
        zoomOut({ duration: 600 })
        
        // Then after zoom out, fit the view to show all nodes with the new one
        setTimeout(() => {
          fitView({
            duration: 800,
            padding: 0.2,
            maxZoom: 1.5,
            minZoom: 0.5,
            nodes: [{ id: newNodeId }] // Focus on the new node
          })
        }, 650)
      }, 100) // Small delay to let the node render first
    }
    
    setContent('')
  }

  const handleButtonClick = async (buttonLabel: string) => {
    // Handle logout
    if (buttonLabel === "Logout") {
      setIsLogout(true)
      return
    }

    // Check if node is selected
    if (!nodeLabel) {
      toast.error("Please select or drag a node")
      return
    }

    // Handle special cases
    switch (buttonLabel) {
      case "Who":
        setSubjectPersonOpen(true)
        break
      case "Research":
        setExternalDialogIsOpen(true)
        break
      case "Extract":
        extractKeywords(nodeLabel)
        break
      default:
        if (DIALOG_OPTIONS.includes(buttonLabel)) {
          setIsOptionDialogOpen(true)
          setOptionsDialogIntent(buttonLabel)
        } else {
          await fetchDescription({ 
            intent: buttonLabel, 
            selectedNodeData: nodeLabel,
            isExpertMode 
          })
        }
    }
  }

  return (
    <TooltipProvider>
      <div className="w-[280px] p-2 border rounded-lg bg-white">
        <div className="space-y-2">
          {/* Expert Mode Toggle */}
          <div className="flex gap-1">
            <Switch
              id="expert-mode"
              checked={isExpertMode}
              onCheckedChange={setIsExpertMode}
            />
            <Label htmlFor="expert-mode" className="text-sm font-medium">
              Expert Mode
            </Label>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* New Topic Dialog */}
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm rounded-md">
                    New
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Create a new topic</TooltipContent>
              </Tooltip>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle asChild>
                    <p className="text-xl font-bold text-gray-800">
                      What do you want to learn?
                    </p>
                  </DialogTitle>
                  <DialogDescription>
                    Enter a topic to start exploring
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className='py-2' 
                  type="text" 
                  placeholder="Computer Science" 
                />
                <DialogClose asChild>
                  <Button onClick={handleNewTopic}>
                    Explore 🔎
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>

            {/* Action Buttons */}
            {SIDEBAR_BUTTONS.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant={button.label === "Logout" ? "destructive" : "outline"}
                    onClick={() => handleButtonClick(button.label)}
                    className={button.badge ? "relative" : ""}
                    disabled={isCompletionLoading && button.label !== "Reset"}
                  >
                    {button.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{button.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Logout Confirmation Dialog */}
        <Dialog open={isLogout} onOpenChange={setIsLogout}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure you want to sign out?</DialogTitle>
              <DialogDescription>
                Your progress will be lost if you sign out now.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLogout(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Components */}
        <MapInfoDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirmAddToMap}
          content={completion}
          isLoading={isCompletionLoading}
        />

        <SubjectPersonDialogOption
          isOpen={subjectPersonOpen}
          onClose={() => setSubjectPersonOpen(false)}
          fetchDescription={({ intent, selectedNodeData }: { intent: string, selectedNodeData: string }) => 
            fetchDescription({ intent, selectedNodeData, isExpertMode })
          }
          nodeLabel={nodeLabel}
        />

        <FetchExternalSourceDialog
          isOpen={externalDialogIsOpen}
          onClose={() => setExternalDialogIsOpen(false)}
          fetchDescription={fetchDescription}
          nodeLabel={nodeLabel}
        />

        <OptionsDialog
          isOpen={isOptionDialogOpen}
          onClose={() => setIsOptionDialogOpen(false)}
          intent={optionsDialogIntent}
          isExpertMode={isExpertMode}
        />

        <TermSelectionDialog
          isOpen={isConceptSelectionDialogOpen}
          onClose={() => setIsConceptSelectionDialogOpen(false)}
          terms={extractedWords}
          isLoading={isExtractLoading}
        />
      </div>
    </TooltipProvider>
  )
}

export default Sidebar