import React, { use, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import MapInfoDialog from "@/components/MapInfoDialog"
import { nodeLabelState, targetNode } from '@/app/store/atoms/nodelabel';
import { reactNode, reactEdge, relativeParentNodePosition } from '@/app/store/atoms/nodes'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import ConceptSelectionDialog from './ConceptSelectionDialog'
type Props = {
  isOpen: boolean
  onClose: () => void
  intent: string
  isExpertMode?: boolean
}

const OptionsDialog: React.FC<Props> = React.memo(({ isOpen, onClose, intent, isExpertMode }) => {

  const [selectedValue, setSelectedValue] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [isConceptSelectionDialogOpen, setIsConceptSelectionDialogOpen] = useState(false)
  const [concepts, setConcepts] = useState({data: [], intent: ''})
  const selectedNodeData = useRecoilValue(nodeLabelState)
  const [nodes, setNodes] = useRecoilState(reactNode);
  const [edges, setEdges] = useRecoilState(reactEdge);
  const target = useRecoilValue(targetNode)
  const parentNodePosition = useRecoilValue(relativeParentNodePosition);

  const { mutate: getInformation, isPending } = useMutation({
    mutationFn: async ({ intent, instruction, selectedNodeData }: { intent: string, instruction: string, selectedNodeData: string, }) => {
      if (!selectedNodeData) {
        toast.error('Please select a node')
        return;
      }
      setDialogOpen(true)

      const { data } = await axios.post('/api/details', {
        intent,
        instruction,
        selectedNodeData,
        isExpert: isExpertMode
      })

      const text = await data.information;
      console.log(text)
      return text;
    },
    onSuccess: (data) => {
      setGeneratedContent(data)
    },
    onError: () => {
      toast.error('An error occurred! Please try again');
      return;
    }
  });

  const {mutate: getConcepts, isPending: isPendingConcepts} = useMutation({
    mutationFn: async ({intent, subjectdata,}: {intent: string, subjectdata: string}) => {
      if(!subjectdata){
        toast.error('Please select a node')
        return
      }
      onClose()
      setIsConceptSelectionDialogOpen(true);
      const {data} = await axios.post('/api/concept', {
        intent,
        subjectdata
      })
      return data;
    },
    onSuccess: (data) => {
      setConcepts(data)
    },
    onError: () => {
      setIsConceptSelectionDialogOpen(false);
      toast.error('An error occurred! Please try again');
      return;
    }
  })

  const addNewEdge = (source: string, target: string) => {
    const newEdge = {
      id: new Date().getTime().toString(),
      source,
      target,
      animated: true,
    };
    setEdges([...edges, newEdge]);
  }
  const addDescriptionNode = (title: string, description: string) => {
    const newNode = {
      id: new Date().getTime().toString(),
      type: 'dataNode',
      position: {
        x: parentNodePosition.x + Math.floor(Math.random() * (500 - 300 + 1)) + 300,
        y: parentNodePosition.y + Math.floor(Math.random() * (500 - 300 + 1)) + 300
      },
      data: { title, description, color: "#ffffff" },
    };
    setNodes([...nodes, newNode]);
    addNewEdge(target, newNode.id)
    return
  }


  const handleConfirmAddToMap = () => {
    addDescriptionNode(`${intent}: ${selectedValue}`, generatedContent);
    setDialogOpen(false)
  }

  const handleSelect = () => {
    if (selectedValue) {
      onClose()
    }
  }

  const renderContent = () => {
    switch (intent) {
      case 'Explain':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                Explain the concept in a way that is easy to understand
              </DialogTitle>
            </DialogHeader>
            <Select onValueChange={setSelectedValue} value={selectedValue}>
              <SelectTrigger className="w-full border-2 h-12">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Like I am 5 years old">Like I am 5 years old</SelectItem>
                <SelectItem value="Like I am 10 years old">Like I am 10 years old</SelectItem>
                <SelectItem value="Like I am a college student">Like I am a college student</SelectItem>
                <SelectItem value="Like I am someone who is non-technical">Like I am someone who is non-technical</SelectItem>
                <SelectItem value="From first principles">From first principles</SelectItem>
                <SelectItem value="Using a story">Using a story</SelectItem>
                <SelectItem value="Step by step">Step by step</SelectItem>
                <SelectItem value="Through frequently asked questions">Through frequently asked questions</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                onClose()
                getInformation({ intent, instruction: selectedValue, selectedNodeData })
              }}
              disabled={!selectedValue}
            >
              Explain
            </Button>
          </>
        )
      case 'Significance':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                Explain the significance of the concept
              </DialogTitle>
            </DialogHeader>
            <Select onValueChange={setSelectedValue} value={selectedValue}>
              <SelectTrigger className="w-full border-2 h-12">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Significance">General Significance</SelectItem>
                <SelectItem value="Practical Significance">Practical Significance</SelectItem>
                <SelectItem value="Theoretical Significance">Theoretical Significance</SelectItem>
                <SelectItem value="Cultural Significance">Cultural Significance</SelectItem>
                <SelectItem value="Social Significance">Social Significance</SelectItem>
                <SelectItem value="Technological significance">Technological significance</SelectItem>
                <SelectItem value="Economical significance">Economical significance</SelectItem>
                <SelectItem value="Short-term significance">Short-term significance</SelectItem>
                <SelectItem value="Long-term significance">Long-term significance</SelectItem>

              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                onClose()
                getInformation({ intent, instruction: selectedValue, selectedNodeData })
              }}
              disabled={!selectedValue}
            >
              Explain
            </Button>
          </>
        )

      case 'Implications':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                Explain the potential consequences or impact of the concept
              </DialogTitle>
            </DialogHeader>
            <Select onValueChange={setSelectedValue} value={selectedValue}>
              <SelectTrigger className="w-full border-2 h-12">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General implications">General implications</SelectItem>
                <SelectItem value="Practical implications">Practical implications</SelectItem>
                <SelectItem value="Theoretical implications">Theoretical implications</SelectItem>
                <SelectItem value="Cultural implications">Cultural implications</SelectItem>
                <SelectItem value="Social implications">Social implications</SelectItem>
                <SelectItem value="Technological implications">Technological implications</SelectItem>
                <SelectItem value="Economical implications">Economical implications</SelectItem>
                <SelectItem value="Short-term implications">Short-term implications</SelectItem>
                <SelectItem value="Long-term implications">Long-term implications</SelectItem>

              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                onClose()
                getInformation({ intent, instruction: selectedValue, selectedNodeData })
              }}
              disabled={!selectedValue}
            >
              Explain
            </Button>
          </>
        )

      case 'Concepts':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Get information about concepts related to this input
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Button
                className='w-full hover:bg-gray-200'
                variant="secondary"
                onClick={() => getConcepts({intent: "Related Concepts", subjectdata: selectedNodeData})}
              >
                Related Concepts
              </Button>
              <Button
                className='w-full hover:bg-gray-200'
                variant="secondary"
                onClick={() => getConcepts({intent: "Similar Concepts", subjectdata: selectedNodeData})}
              >
                Similar Concepts
              </Button>
              <Button
                className='w-full hover:bg-gray-200'
                variant="secondary"
                onClick={() => getConcepts({intent: "Parent Concepts", subjectdata: selectedNodeData})}
              >
                Parent Concepts
              </Button>
              <Button
                variant="secondary"
                className='w-full hover:bg-gray-200'
                onClick={() => getConcepts({intent: "Sub-Concepts", subjectdata: selectedNodeData})}
              >
                Sub-Concepts
              </Button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          {renderContent()}
        </DialogContent>
      </Dialog>

      <MapInfoDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmAddToMap}
        content={generatedContent}
        isLoading={isPending}
      />

      <ConceptSelectionDialog
        isOpen={isConceptSelectionDialogOpen}
        onClose={() => setIsConceptSelectionDialogOpen(false)}
        concepts={concepts.data}
        isLoading={isPendingConcepts}
        intent={concepts.intent}
      />

     

    </div>
  )
}, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen && prevProps.intent === nextProps.intent
})

OptionsDialog.displayName = 'OptionsDialog'

export default OptionsDialog