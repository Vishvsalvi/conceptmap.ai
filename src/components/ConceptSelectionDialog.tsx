"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TextShimmer } from "./ui/text-shimmer";
import { Loader2 } from "lucide-react";
import {
  reactNode,
  reactEdge,
  relativeParentNodePosition,
} from "@/app/store/atoms/nodes";
import { targetNode } from "@/app/store/atoms/nodelabel";
import { useRecoilValue, useSetRecoilState } from "recoil";

interface ConceptSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  intent: string;
  concepts: { concept: string }[];
}

const ConceptSelectionDialog = React.memo(
  ({ isOpen, onClose, isLoading, concepts, intent }: ConceptSelectionDialogProps) => {
    const [selectedTerms, setSelectedTerms] = useState<string[]>(concepts.map(c => c.concept) || []);
    const [isAddingNodes, setIsAddingNodes] = useState(false);
    const relativePosition = useRecoilValue(relativeParentNodePosition);
    const setNodes = useSetRecoilState(reactNode);
    const setEdges = useSetRecoilState(reactEdge);
    const target = useRecoilValue(targetNode);

    const toggleTerm = (term: string) => {
      setSelectedTerms((prev) =>
        prev.includes(term)
          ? prev.filter((t) => t !== term)
          : [...prev, term]
      );
    };

    const addNewEdge = (source: string, target: string) => {
      const edge = {
        id: new Date().getTime().toString(),
        source: source,
        target: target,
        animated: true,
      };
      setEdges((prevEdges) => [...prevEdges, edge]);
    };

    const addConceptNode = (term: string, title: string) => {
      const node = {
        id: Math.random().toString() + new Date().getTime().toString(),
        type: "conceptNode",
        position: {
          x: relativePosition.x + 200,
          y: relativePosition.y + 200,
        },
        data: {
          term: term,
          title: title,
        },
      };
      setNodes((prevNodes) => [...prevNodes, node]);
      addNewEdge(target, node.id);
    };

    const submitHandler = async () => {
      if (selectedTerms.length === 0) {
        onClose();
        return;
      }

      setIsAddingNodes(true);

      try {
        for (const term of selectedTerms) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          addConceptNode(term, intent.slice(0, -1));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsAddingNodes(false);
        onClose();
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="p-6 pb-4 space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle>Select to Add</DialogTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                <TextShimmer className="text-sm" duration={1}>
                  Searching for concepts...
                </TextShimmer>
              ) : (
                concepts.map((concept) => (
                  <button
                    key={concept.concept}
                    onClick={() => toggleTerm(concept.concept)}
                    className={cn(
                      "px-4 py-2 rounded-md border-2 transition-all duration-200",
                      "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                      "flex items-center gap-2 group",
                      selectedTerms.includes(concept.concept)
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-sm border-2 transition-all duration-200",
                        "flex items-center justify-center",
                        selectedTerms.includes(concept.concept)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground group-hover:border-primary/50"
                      )}
                    >
                      {selectedTerms.includes(concept.concept) && (
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
                    {concept.concept}
                  </button>
                ))
              )}
            </div>
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
                "Add"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isAddingNodes}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.concepts === nextProps.concepts &&
    prevProps.isLoading === nextProps.isLoading
);

export default ConceptSelectionDialog;
