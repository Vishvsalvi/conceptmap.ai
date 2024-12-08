import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog"


interface SubjectPersonDialogOptionProps {
    isOpen: boolean
    onClose: () => void
    fetchDescription: ({ intent, selectedNodeData }: { intent: string, selectedNodeData: string }) => void
    nodeLabel: string
  }
const buttons = [
    { label: "Who is this person/entity?" },
    { label: "Who founded/invented this?" },
    { label: "Who are the key figures in this?" },
    { label: "Who are the proponents of this?" },
    { label: "Who are the opponents of this?" },
  ]
  
export default function SubjectPersonDialogOption({ isOpen, onClose, fetchDescription, nodeLabel }: SubjectPersonDialogOptionProps) {
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Retrieve information about the person or entity relevant to the input.
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 max-h-[300px] overflow-y-auto rounded-md p-4">
            <div className="flex flex-col space-y-3">
              {buttons.map((button, index) => (
              <DialogClose key={index} asChild >
                <Button 
                onClick={() => fetchDescription({ intent: button.label, selectedNodeData: nodeLabel })}
                 variant="outline" className="w-full">
                  {button.label}
                </Button>
              </DialogClose>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }