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
import { Book, FileText, Link, Newspaper, Search, TrendingUp, Youtube, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import axios from 'axios'
import { useRecoilValue } from 'recoil';
import { nodeLabelState, targetNode } from '@/app/store/atoms/nodelabel';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import MapInfoDialog from './MapInfoDialog';
import SubjectPersonDialogOption from './SubjectPersonDialogOption';
import ExternalDataDialog from './ExternalDataDialog';
import OptionsDialog from './OptionsDialog';
import TermSelectionDialog from './TermSelectionDialog';
import { useReactFlow } from '@xyflow/react';
import { signOut } from 'next-auth/react'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type Props = {
  addNewNode: (content: string) => void;
  addDescriptionNode: (title: string, description: string) => string;
  addNewEdge: (source: string, target: string) => void;
}

const buttons = [
  { label: "What", tooltip: "Get more information about the selected topic" },
  { label: "How", tooltip: "Understand the process or method related to the topic" },
  { label: "Who", tooltip: "Identify key people or entities related to the topic", badge: true },
  { label: "Origin", tooltip: "Explore the origins or history of the topic" },
  { label: "Elaborate", tooltip: "Get a more detailed explanation of the topic" },
  { label: "Pros", tooltip: "List the advantages or benefits of the topic" },
  { label: "Cons", tooltip: "List the disadvantages or drawbacks of the topic" },
  { label: "Example", tooltip: "See an example related to the topic" },
  { label: "Research", tooltip: "Learn and research using other sources of information", badge: true },
  { label: "Extract", tooltip: "Extract key information from the topic", badge: true },
  { label: "Concepts", tooltip: "Identify main concepts related to the topic", badge: true },
  { label: "Compare", tooltip: "Compare this topic with a related one" },
  { label: "Analogy", tooltip: "Get an analogy to help understand the topic" },
  { label: "Controversies", tooltip: "Explore controversies related to the topic", badge: true },
  { label: "Implications", tooltip: "Understand the implications of the topic", badge: true },
  { label: "Significance", tooltip: "Learn about the significance of the topic", badge: true },
  { label: "Interesting", tooltip: "Discover interesting facts about the topic" },
  { label: "Explain", tooltip: "Get a simplified explanation of the topic", badge: true },
  { label: "Question", tooltip: "Generate questions about the topic", badge: true },
  { label: "Logout", tooltip: "Logout from the application" }
];


const Sidebar = ({ addNewNode, addDescriptionNode, addNewEdge }: Props) => {


  const [content, setContent] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [currentIntent, setCurrentIntent] = useState('')
  const [subjectPersonOpen, setSubjectPersonOpen] = useState(false)
  const [externalDialogIsOpen, setExternalDialogIsOpen] = useState(false)
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false)
  const [OptionsDialogIntent, setOptionsDialogIntent] = useState<string>("")
  const [extractedWords, setExtractedWords] = useState<string[]>([])
  const [isConceptSelectionDialogOpen, setIsConceptSelectionDialogOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false)
  const [isExpertMode, setIsExpertMode] = useState(false);

  const handleSignOut = () => {
    signOut();
    return;
  }

  const nodeLabel = useRecoilValue(nodeLabelState);
  const target = useRecoilValue(targetNode);
  const { zoomOut, setViewport } = useReactFlow();

  const { mutate: fetchDescription, isPending } = useMutation({
    mutationFn: async ({ intent, selectedNodeData }: { intent: string, selectedNodeData: string }) => {
      if (!selectedNodeData) throw new Error("Please select or drag a node")
      setDialogOpen(true)
      setCurrentIntent(intent)
      const { data } = await axios.post("/api/prompt", { intent, selectedNodeData, isExpert:isExpertMode })

      return data
    },
    onSuccess: (data) => {
      setGeneratedContent(data.information)

    },
    onError: (error) => {
      toast.error(error.message || "An error occurred")
      setDialogOpen(false)
    },
  })

  const handleConfirmAddToMap = () => {
    const newNodeId = addDescriptionNode(currentIntent, generatedContent);
    addNewEdge(target, newNodeId);
    setDialogOpen(false);
  };

  const handleSubjectPerson = () => {
    setSubjectPersonOpen(true)
  }

  const { mutate: extractKeywords, isPending: isLoading } = useMutation({
    mutationFn: async (paragraph: string) => {
      console.log("Extracting keywords")
      setIsConceptSelectionDialogOpen(true);
      const response = await axios.post("/api/extract", { paragraph })
      const terms = await response.data
      return terms.data;
    },
    onSuccess: (data) => {
      setExtractedWords(data)
    },
    onError: (error) => {
      console.error(error)
    }
  })


  return (
    <TooltipProvider>
      <div className="w-[280px] p-2 border rounded-lg bg-white">
        <div className="space-y-2">
          {/* Top Dropdowns */}
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
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm rounded-md">New</DialogTrigger>
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
                  className='py-2' type="text" placeholder="Computer Science" />
                <DialogClose asChild>
                  <Button
                    onClick={() => {
                      const newposition = addNewNode(content)
                      zoomOut({ duration: 800 })
                      setContent('');
                    }}
                  >Explore 🔎</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            {buttons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant={button.label === "Logout" ? "destructive" : "outline"}
                    onClick={() => {
                      if (button.label === "Logout") {
                        setIsLogout(true)
                        return;
                      }
                      if (!nodeLabel) {
                        toast.error("Please select or drag a node")
                        return;
                      }
                      if (button.label === "Who") {
                        handleSubjectPerson()
                      }
                      else if (button.label === "Research") {
                        setExternalDialogIsOpen(true)
                      }
                      else if (button.label === "Explain" || button.label === "Implications" || button.label === "Significance" || button.label === "Concepts") {
                        setIsOptionDialogOpen(true);
                        setOptionsDialogIntent(button.label)
                      } else if (button.label === "Extract") {
                        console.log("Extracting keywords");

                        extractKeywords(nodeLabel); // Call the function directly
                      }

                      else {
                        fetchDescription({ intent: button.label, selectedNodeData: nodeLabel })
                      }
                    }}
                    // variant="outline"
                    className={button.badge ? "relative" : ""}
                    disabled={isPending && button.label !== "Reset"}
                  >
                    {button.label}
                    {button.badge && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{button.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </div>

        </div>
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

        <MapInfoDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirmAddToMap}
          content={generatedContent}
          isLoading={isPending}
        />

        <SubjectPersonDialogOption
          isOpen={subjectPersonOpen}
          onClose={() => setSubjectPersonOpen(false)}
          fetchDescription={fetchDescription}
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
          intent={OptionsDialogIntent}
          isExpertMode={isExpertMode}

        />

        <TermSelectionDialog
          isOpen={isConceptSelectionDialogOpen}
          onClose={() => { setIsConceptSelectionDialogOpen(false) }}
          terms={extractedWords}
          isLoading={isLoading}
        />

      </div>
    </TooltipProvider>
  )
}

export default Sidebar

interface FetchExternalSourceDialogProps {
  isOpen: boolean
  onClose: () => void
  fetchDescription: ({ intent, selectedNodeData }: { intent: string, selectedNodeData: string }) => void
  nodeLabel: string
}

interface SourceData {
  title: string
  link: string
  source: string
}

function FetchExternalSourceDialog({ isOpen, onClose, fetchDescription, nodeLabel }: FetchExternalSourceDialogProps) {

  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const [sourceData, setSourceData] = useState<SourceData[]>([])


  const { mutate: getResources, isPending } = useMutation({
    mutationFn: async ({ source, topic }: { source: string, topic: string }) => {
      if (!topic) {
        toast.error("Please select or drag a node")
        return;
      }
      const response = await axios.post("/api/research", { source, topic })
      const data = await response.data
      return data;
    },
    onSuccess: (data) => {
      setSourceData(data.data)
      setIsSourceDialogOpen(true)
      console.log(data)
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred")
      setIsSourceDialogOpen(false)
    },
  })


  const fetchYouTubeVideos = async (topics: string) => {
    console.log(topics)
    if (!topics) {
      toast.error("Please select or drag a node")
      return;
    }
    console.log(topics.split(' ').length <= 5)

    if (!(topics.split(' ').length <= 5)) {
      toast.error("Please select the topic node");
      return;
    }

    try {
      const query = topics.trim().split(/\s+/).join('+');
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=What+is+${query}&maxResults=10&type=video&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      setIsSourceDialogOpen(true);
      setSourceData(data.items);
    } catch (error) {
      console.error(error);
      return [];
    }

  }


  const sources = [
    { name: "Wikipedia", icon: Search },
    { name: "arXiv", icon: FileText },
    { name: "PubMed", icon: FileText },
    { name: "Semantic Scholar", icon: Search },
    { name: "Links", icon: Link },
    { name: "News", icon: Newspaper },
    { name: "YouTube", icon: Youtube },
    { name: "Books", icon: Book },
    { name: "References", icon: FileText },
    { name: "Recent Developments", icon: TrendingUp },
  ]

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
              {sources.slice(0, 8).map((source) => (
                <DialogClose key={source.name} asChild>
                  <Button

                    variant="secondary"
                    className="justify-start gap-2"
                    size="sm"
                    onClick={source.name == "YouTube" ? async () => await fetchYouTubeVideos(nodeLabel) : async () => await getResources({ source: source.name, topic: nodeLabel })}
                  >
                    <source.icon className="h-4 w-4" />
                    {source.name.length > 10 ? `${source.name.slice(0, 10)}...` : source.name}
                  </Button>
                </DialogClose>
              ))}
            </div>

            {/* Third row */}
            <div className="grid grid-cols-12 gap-2">
              {sources.slice(8).map((source) => (
                <DialogClose key={source.name} asChild>
                  <Button

                    variant="secondary"
                    className="col-span-4 justify-start gap-2"
                    size="sm"
                    onClick={() => fetchDescription({ intent: source.name, selectedNodeData: nodeLabel })}
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

