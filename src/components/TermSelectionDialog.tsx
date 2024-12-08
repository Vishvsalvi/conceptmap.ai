'use client'

import { useState, memo, useCallback } from 'react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TextShimmer } from "@/components/ui/text-shimmer"
import { reactNode, reactEdge, relativeParentNodePosition } from '@/app/store/atoms/nodes'
import { targetNode } from '@/app/store/atoms/nodelabel'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Loader2 } from 'lucide-react'
import { ScrollArea } from './ui/scroll-area'

type Props = {
  isOpen: boolean
  onClose: () => void
  terms: any[]
  isLoading: boolean
}

const TermSelectionDialog = memo(
  ({ isOpen, onClose, terms, isLoading }: Props) => {
    const [selectedTerms, setSelectedTerms] = useState<string[]>(terms)
    const [isAddingNodes, setIsAddingNodes] = useState(false)
    const relativePosition = useRecoilValue(relativeParentNodePosition);

    const toggleTerm = (term: string) => {
      setSelectedTerms(prev =>
        prev.includes(term)
          ? prev.filter(t => t !== term)
          : [...prev, term]
      )
    }

    const [nodes, setNodes] = useRecoilState(reactNode);
    const [edges, setEdges] = useRecoilState(reactEdge);
    const target = useRecoilValue(targetNode);

    const addNewEdge = useCallback((source: string, target: string) => {
      const edge = {
        id: new Date().getTime().toString(),
        source: source,
        target: target,
        animated: true,
      }
      setEdges(prevEdges => [...prevEdges, edge])
    }, [setEdges])

    const submitHandler = async () => {
      if (selectedTerms.length === 0) return;

      setIsAddingNodes(true);

      try {
        for (const term of selectedTerms) {
          await new Promise(resolve => setTimeout(resolve, 500)); 
          
          const node = {
            id: Math.random().toString() + new Date().getTime().toString(),
            type: 'termNode',
           position: {
              x: relativePosition.x + Math.floor(Math.random() * (500 - 300 + 1)) + 300,
              y: relativePosition.y + Math.floor(Math.random() * (500 - 300 + 1)) + 300
            },
            data: { term },
          }
          
          setNodes(prevNodes => [...prevNodes, node])
          addNewEdge(target, node.id)
        }
        
        setSelectedTerms([])
        onClose()
      } catch (error) {
        console.error('Error adding nodes:', error)
      } finally {
        setIsAddingNodes(false)
      }
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="p-6 pb-4 space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle>
                Select to Add
              </DialogTitle>
            </div>
            <ScrollArea className="h-[30vh] mt-4 pr-4">
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                <TextShimmer className="text-sm" duration={1}>
                  Extracting terms...
                </TextShimmer>
              ) : (
                terms.map((term) => (
                  <button
                    key={term.concept}
                    onClick={() => toggleTerm(term.concept)}
                    className={cn(
                      "px-4 py-2 rounded-md border-2 transition-all duration-200",
                      "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-green-400",
                      "flex items-center gap-2 group",
                      selectedTerms.includes(term.concept)
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-sm border-2 transition-all duration-200",
                        "flex items-center justify-center",
                        selectedTerms.includes(term.concept)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground group-hover:border-primary/50"
                      )}
                    >
                      {selectedTerms.includes(term.concept) && (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {term.concept}
                  </button>
                ))
              )}
            </div>
            </ScrollArea>
          </div>
          <div className="p-4 bg-muted/40 border-t flex gap-2 justify-end">
            <Button 
              disabled={isLoading || isAddingNodes || selectedTerms.length === 0}
              onClick={submitHandler}
            >
              {isAddingNodes ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add'
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isAddingNodes}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  },
  (prevProps, nextProps) =>
    prevProps.isOpen === nextProps.isOpen &&
    JSON.stringify(prevProps.terms) === JSON.stringify(nextProps.terms)
)

export default TermSelectionDialog