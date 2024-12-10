'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { reactEdge, reactNode, relativeParentNodePosition } from '@/app/store/atoms/nodes';
import { targetNode } from '@/app/store/atoms/nodelabel';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';

interface ExternalDataDialogProps {
  isOpen: boolean
  externalData: any[]
  onClose: () => void
}

const ExternalDataDialog = React.memo(
  function ExternalDataDialog({ isOpen, onClose, externalData }: Omit<ExternalDataDialogProps, 'onAddToMap'>) {
    const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const setNodes = useSetRecoilState(reactNode);
    const setEdges = useSetRecoilState(reactEdge);
    const parentNodePosition = useRecoilValue(relativeParentNodePosition);

    const target = useRecoilValue(targetNode);

    // Memoize callback functions
    const handleCheckboxChange = useCallback((videoId: string) => {
      setSelectedVideos(prev =>
        prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
      );
    }, []);

    const addVideoNode = useCallback((title: string, thumbnail: string, channelName: string, videoId: string) => {
      const newNode = {
        id: new Date().getTime().toString(),
        type: 'videoNode',
        position: {
          x: parentNodePosition.x + Math.floor(Math.random() * (500 - 300 + 1)) + 300,
          y: parentNodePosition.y + Math.floor(Math.random() * (500 - 300 + 1)) + 300,
        },
        data: { title, thumbnail, channelName, videoId },
      };
      setNodes(prevNodes => [...prevNodes, newNode]);
      addNewEdge(target, newNode.id);
    }, [parentNodePosition, target, setNodes]);

    const addNewEdge = useCallback((source: string, target: string) => {
      const newEdge = {
        id: new Date().getTime().toString(),
        source,
        target,
        animated: true,
      };
      setEdges(prevEdges => [...prevEdges, newEdge]);
    }, [setEdges]);

    const handleAddToMap = useCallback(() => {
      setIsLoading(true);
      const videosToAdd = externalData.filter(video => selectedVideos.includes(video.id.videoId));

      videosToAdd.forEach((video, index) => {
        setTimeout(() => {
          addVideoNode(
            video.snippet.title,
            video.snippet.thumbnails.medium.url,
            video.snippet.channelTitle,
            video.id.videoId
          );
          if (index === videosToAdd.length - 1) {
            setIsLoading(false);
            onClose();
          }
        }, index * 500);
      });
    }, [externalData, selectedVideos, addVideoNode, onClose]);

    // Memoize the video cards rendering
    const videoCards = useMemo(() => (
      externalData.map((video, index) => (
        <Card key={index} className="overflow-hidden transition-shadow hover:shadow-lg">
          <div className="relative">
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full object-cover"
            />
          </div>
          <CardHeader className="p-4">
            <CardTitle className="line-clamp-2 text-sm">{video.snippet.title}</CardTitle>
            <CardDescription className="mt-1 text-xs">{video.snippet.channelTitle}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between items-center p-4">
            <Link
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              className="text-xs bg-black text-white px-3 py-2 rounded-md"
            >
              View Video
            </Link>
            <Checkbox
              id={`checkbox-${video.id.videoId}`}
              checked={selectedVideos.includes(video.id.videoId)}
              onCheckedChange={() => handleCheckboxChange(video.id.videoId)}
            />
          </CardFooter>
        </Card>
      ))
    ), [externalData, selectedVideos]); // Add selectedVideos as dependency since it affects checkbox state

    console.log(externalData);  

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>YouTube Videos</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh]">
            <div className="grid gap-4 sm:grid-cols-2">
              {videoCards}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={handleAddToMap} disabled={isLoading || selectedVideos.length === 0}>
              {isLoading ? 'Adding Videos...' : `Add ${selectedVideos.length} Video${selectedVideos.length !== 1 ? 's' : ''} to Map`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
  // Optimize memo comparison
  (prevProps, nextProps) => {
    return prevProps.isOpen === nextProps.isOpen &&
           prevProps.externalData === nextProps.externalData;
  }
);

export default ExternalDataDialog;
