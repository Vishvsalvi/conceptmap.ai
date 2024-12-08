'use client'

import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Play } from 'lucide-react'

const VideoNode = memo(({ data }: { data: { title: string; thumbnail: string; channelName: string; videoId: string } }) => {
  const { title, thumbnail, channelName, videoId } = data

  return (
    <div className="bg-white text-card-foreground rounded-lg shadow-lg overflow-hidden w-64 transition-transform hover:scale-105">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative group">
          <img src={thumbnail} alt={title} className="w-full h-36 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-xs">{channelName}</p>
        </div>
      </a>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  )
})

VideoNode.displayName = 'VideoNode'

export default VideoNode