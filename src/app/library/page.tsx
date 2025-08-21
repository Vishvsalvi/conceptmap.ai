"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, AlertCircle, Loader2, ExternalLink, Share2, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAllContent, getAllMaps } from '../actions/map'
import { useSession } from 'next-auth/react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area' 
import { deleteMap, deleteNodesAndEdgesByMapId  } from '../actions/map'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
type ContentType = 'BLOG' | 'SUMMARY' | 'ESSAY' | 'CONCEPT_MAP'

interface Content {
  id: string
  title?: string
  name?: string
  type: ContentType
  content: string
  createdAt?: string
}

interface Map {
  id: string
  name: string
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<ContentType>("CONCEPT_MAP")
  const { data: session } = useSession()
  const dialog = useDialog()
  const [mapToDelete, setMapToDelete] = useState<string | null>(null)
  const router = useRouter()
  const { data: contents, isLoading, isError, error, refetch } = useQuery<Content[], Error>({
    queryKey: ['content'],
    queryFn: async () => {
      if (!session?.user?.email) {
        throw new Error("User email is not available")
      }
      const response = await getAllContent(session.user.email)
      return response
    }
  })

  const { data: maps, isLoading: mapsLoading, isError: mapsError } = useQuery<Map[], Error>({
    queryKey: ['maps'],
    queryFn: async () => {
      if (!session?.user?.email) {
        throw new Error("User email is not available")
      }
      const response = await getAllMaps(session.user.email)
      return response
    }
  })

const {mutate: deleteMapMutation, isPending: isDeletingMap} = useMutation({
  mutationFn: async (mapId: string) => {
    await deleteNodesAndEdgesByMapId(mapId)
    await deleteMap(mapId)
  },
  onSuccess: () => {
    // Refetch both maps and contents
    // refetch()
    router.refresh()
    toast.success("Map deleted successfully")
    setMapToDelete(null)
  },
  onError: (error) => {
    console.error(error)
    toast.error("Failed to delete map")
    toast.error(error.message)
  }
})

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const handleShare = (mapId: string) => {
    const url = `${window.location.origin}/map/view/${mapId}`
    setShareUrl(url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
    navigator.clipboard.writeText(url)
    setShareDialogOpen(true)

  }

  if (isLoading || mapsLoading) return <LoadingScreen />
  if (isError || mapsError) return <ErrorScreen error={error || new Error("Failed to load content")} retry={() => refetch()} />

  const filteredContents = contents?.filter(content => content.type === activeTab) || []

  const handleCardClick = (content: Content) => {
    dialog.show({
      title: content.title || content.name || 'Content',
      content: <ReactMarkdown>{content.content}</ReactMarkdown>
    })
  }



  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container px-4 py-12 relative">
        <Link
          href="/map"
          className="flex items-center hover:bg-slate-100 px-4 py-2 rounded-md text-sm absolute top-4 left-4 text-primary transition-all duration-200 hover:translate-x-[-5px]"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-4xl tracking-tight font-extrabold text-primary">Library</span>
        </motion.header>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="CONCEPT_MAP">Concept Maps</TabsTrigger>
            <TabsTrigger value="SUMMARY">Summaries</TabsTrigger>
            <TabsTrigger value="BLOG">Blogs</TabsTrigger>
            <TabsTrigger value="ESSAY">Essays</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              {...fadeIn}
            >
              {activeTab === "CONCEPT_MAP" && maps ? (
                [...filteredContents, ...maps].map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden transition-all duration-200 hover:shadow-lg"
                    onClick={() => 'content' in item ? handleCardClick(item as Content) : null}
                  >
                    <CardHeader className="bg-primary/5">
                      <CardTitle className='text-xl font-sans' >
                        <div className='flex items-center justify-between'>
                          <span>{'name' in item ? item.name : item.title || ''}</span>
                          <Dialog open={mapToDelete === item.id} onOpenChange={(open) => !open && setMapToDelete(null)}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMapToDelete(item.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure you want to delete this map?</DialogTitle>
                              <DialogDescription>This action cannot be undone.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setMapToDelete(null)}>Cancel</Button>
                              <Button 
                                variant="destructive"
                                onClick={() => {
                                  if (mapToDelete) {
                                    deleteMapMutation(mapToDelete)
                                  }
                                }} 
                                disabled={isDeletingMap}
                              >
                                {isDeletingMap ? 'Deleting...' : 'Delete'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    {'name' in item && (
                      <CardContent className="pt-4">
                        <div className="flex space-x-2">
                          <Link href={`/map/${session?.user?.id}/${item.id}`} passHref className="flex-grow">
                            <Button variant="outline" className="w-full">
                              Visit Map
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="secondary"

                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(item.id); 
                            }}
                          >
                            Share <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    )}
                    <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <span className='font-bold' >Map Link</span>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                          <input
                            className="flex-1 px-3 py-2 text-sm border rounded-md"
                            value={shareUrl}
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleShare(shareUrl)}
                          >
                            {isCopied ? "Copied!" : "Copy to Clipboard"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </Card>
                ))
              ) : (
                filteredContents.map((content) => {
                  const demoContent = content.content.length > 200 ? content.content.slice(0, 200) + '...' : content.content
                  return (
                    <Card
                      key={content.id}
                      className="overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
                      onClick={() => handleCardClick(content)}
                    >
                      <CardHeader className="bg-primary/5">
                        <CardTitle className="text-primary">{content.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ReactMarkdown>{demoContent}</ReactMarkdown>
                      </CardContent>
                      <CardFooter>

                        <Dialog>
                          <DialogTrigger asChild >
                            <Button>Show Content</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{content.name}</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="mt-4 h-[calc(80vh-180px)] pr-4">

                              <div className="prose prose-sm dark:prose-invert">
                                <ReactMarkdown>{content.content}</ReactMarkdown>
                              </div>

                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  )
                }
                )
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}

function ErrorScreen({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AlertCircle className="h-16 w-16 text-destructive" />
      <h2 className="text-2xl font-semibold mt-4">Oops! Something went wrong</h2>
      <p className="text-muted-foreground mt-2">{error.message}</p>
      <Button onClick={retry} className="mt-4">
        Try Again
      </Button>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto">
          <Loader2 className="w-16 h-16 animate-spin absolute" />
        </div>
        <span className="text-2xl font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-200">
          Loading your library...
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This may take a few moments
        </p>
      </div>
    </div>
  )
}

function useDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<React.ReactNode | null>(null)

  const show = ({ title, content }: { title: string; content: React.ReactNode }) => {
    setTitle(title)
    setContent(content)
    setIsOpen(true)
  }

  const hide = () => {
    setIsOpen(false)
    setTitle('')
    setContent(null)
  }

  return {
    isOpen,
    title,
    content,
    show,
    hide
  }
}

