'use client'

import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { reactEdge, reactNode, relativeParentNodePosition } from '@/app/store/atoms/nodes';
import { targetNode } from '@/app/store/atoms/nodelabel';

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

    const handleCheckboxChange = (videoId: string) => {
      setSelectedVideos(prev =>
        prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
      );
    };

    const addVideoNode = (title: string, thumbnail: string, channelName: string, videoId: string) => {
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
    };

    const addNewEdge = (source: string, target: string) => {
      const newEdge = {
        id: new Date().getTime().toString(),
        source,
        target,
        animated: true,
      };
      setEdges(prevEdges => [...prevEdges, newEdge]);
    };

    const handleAddToMap = () => {
      setIsLoading(true); // Start loading
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
            setIsLoading(false); // Stop loading when all videos are added
            onClose();
          }
        }, index * 500);
      });
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>YouTube Videos</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh]">
            <div className="grid gap-4 sm:grid-cols-2">
              {externalData.map((video, index) => (
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
              ))}
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
  (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen
);

export default ExternalDataDialog;
