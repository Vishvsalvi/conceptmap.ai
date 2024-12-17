"use client"

import { useState } from 'react'
import { FileText, Save, BookType, Newspaper, LibraryBig, PencilLine } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { reactNode, reactEdge } from '@/app/store/atoms/nodes'
import { useRecoilValue } from 'recoil'
import ContentDialog from '@/components/ContentDialog'
import { toast } from 'react-toastify'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSession } from 'next-auth/react'
import { createEdge, createMap, createNode, deleteNodesAndEdgesByMapId } from '@/app/actions/map'
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'

export default function Menubar({ mapname, mapId }: { mapname?: string, mapId?: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isPhraseDialogOpen, setIsPhraseDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [mapName, setMapName] = useState("");
  const [phraseDialogContent, setPhraseDialogContent] = useState({ information: '' });
  const [contentType, setContentType] = useState('');
  const nodes = useRecoilValue(reactNode);
  const edges = useRecoilValue(reactEdge);

  const extractNodeData = () => {
    let subjectData = ''
    nodes.forEach(node => {
      if (node.type === 'termNode') {
        subjectData += node.data.term + ' '
      } else if (node.type === 'descriptionNode') {
        subjectData += node.data.description + ' '
      } else {
        subjectData += node.data.label
      }
    });
    return subjectData;
  }

  const { mutate: getContent, isPending } = useMutation({
    mutationFn: async ({ subjectData, intent }: { subjectData: string, intent: string }) => {
      if (nodes.length < 1) {
        toast.error('Please add some nodes to the concept map');
        return;
      }
      setIsPhraseDialogOpen(true)
      const response = await axios.post('/api/phrase', { subjectData, intent });
      const data = await response.data;
      setContentType(intent)
      return data;
    },
    onSuccess: (data) => {
      setPhraseDialogContent(data);
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
      setIsPhraseDialogOpen(false);
    }
  })

  const { mutate: handleSave, isPending: isSavePending, data } = useMutation({
    mutationFn: async () => {
      if (nodes.length < 1) {
        toast.error('Please add some nodes to the concept map');
        return;
      }
      if (!mapName.trim()) {
        toast.error('Please enter a map name');
        return;
      }
      if (!session || !session.user || !session.user.email) {
        toast.error('User session is not available');
        return;
      }
      const map = await createMap({ name: mapName, email: session.user.email });
      const nodePromises = nodes.map((node:any) =>
        createNode({
          data: node.data,
          id: node.id,
          type: node.type,
          mapId: map,
          position: node.position,
        })
      );
      await Promise.all(nodePromises);
      const edgePromises = edges.map((edge:any) =>
        createEdge({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          mapId: map,
        })
      );
      await Promise.all(edgePromises);
      toast.success('Map saved successfully!');
      setIsSaveDialogOpen(false);
      setMapName('');
      return map;
    },
    onError: (error) => {
      console.error(error);
      toast.error('An error occurred while saving the map');
    },
    onSuccess: (data) => {
      console.log('Map saved successfully');
      console.log(data)
      router.push(`/map/${session?.user?.id}/${data}`);
    }
  });

  const { mutate: handleUpdate, isPending: isUpdating } = useMutation({
    mutationFn: async ({mapId, nodes, edges}: {mapId: string, nodes: any, edges: any}) => {
      await deleteNodesAndEdgesByMapId(mapId);
      console.log(nodes)
      const nodePromises = nodes.map((node:any) =>
        createNode({
          data: node.data,
          id: node.id,
          type: node.type,
          mapId: mapId,
          position: node.position,
        })
      );
      await Promise.all(nodePromises);
      const edgePromises = edges.map((edge:any) =>
        createEdge({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          mapId: mapId,
        })
      );
      await Promise.all(edgePromises);
    },
    onError: (error) => {
      console.log(error);
      toast.error('An error occurred while updating the map');
      return;
    },
    onSuccess: () => {
      console.log('Map updated successfully');
      toast.success('Map updated successfully!');
      return;
    }

  });


  if (status === 'loading') {
    return (
      <div className="py-4 px-6 bg-white shadow-md rounded-lg">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <div className="flex justify-between space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 px-6 bg-white shadow-md rounded-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-gray-800">Overview</span>
        </div>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{mapname === undefined ? "Untitled Map" : mapname}</span>
      </div>
      <div className="flex space-x-2 mb-4">
        {mapname === undefined ? (
          <Button
            onClick={() => setIsSaveDialogOpen(true)}
            variant="outline"
            className="flex-1 h-10 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Map
          </Button>
        ) : (
          <Button
            onClick={() => handleUpdate({mapId, nodes, edges})}
            variant="outline"
            className="flex-1 h-10 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            disabled={isUpdating}
          >
            <PencilLine className="h-4 w-4 mr-2" />
            {isUpdating ? 'Updating...' : 'Update Map'}
          </Button>
        )}

        <Link href="/library" className="flex items-center justify-center px-4 rounded-md text-sm font-semibold py-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md">
          <LibraryBig className="h-4 w-4 mr-2" />
          Library
        </Link>
      </div>
      <div className="flex justify-between space-x-2">
        {[
          { icon: BookType, label: "Essay" },
          { icon: Newspaper, label: "Blog" },
          { icon: FileText, label: "Summary" }
        ].map(({ icon: Icon, label }) => (
          <Button
            onClick={() => getContent({ subjectData: extractNodeData(), intent: label.toUpperCase() })}
            key={label}
            variant="outline"
            size="sm"
            className="flex-1 font-semibold text-gray-700 border hover:bg-gray-50 transition-all duration-200"
            disabled={nodes.length < 1}
          >
            <Icon className="h-4 w-4 mr-1" />
            {label}
          </Button>
        ))}
      </div>
      <ContentDialog
        open={isPhraseDialogOpen}
        onClose={() => setIsPhraseDialogOpen(false)}
        content={phraseDialogContent.information}
        isLoading={isPending}
        contentType={contentType}
      />
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle asChild>
            <p className="text-xl font-bold text-gray-800">Name Your Concept Map</p>
          </DialogTitle>
        </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="My new map"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              className="w-full text-base py-2"
            />
          </div>
          <DialogFooter>
            <Button 
              disabled={mapName.length < 1 || isSavePending} 
              className="w-full h-10 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200" 
              onClick={() => handleSave()}
              
            >
              {isSavePending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

