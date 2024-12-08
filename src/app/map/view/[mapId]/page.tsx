"use client"

import React, { useState, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import CustomTitleNode from '@/components/customNode/TitleNode'
import CustomDataNode from '@/components/customNode/DataNode'
import VideoNode from '@/components/customNode/VideoNode'
import TermNode from '@/components/customNode/TermNode'
import ConceptNode from '@/components/customNode/ConceptNode'
import { getMapName, getNodesByMapId, getEdgesByMapId } from '@/app/actions/map';

const Map = ({ params }: { params: { mapId: string } }) => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [mapName, setMapName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const nodeTypes = {
    titleNode: CustomTitleNode,
    dataNode: CustomDataNode,
    videoNode: VideoNode,
    termNode: TermNode,
    conceptNode: ConceptNode,
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nodesData, edgesData, mapData] = await Promise.all([
          getNodesByMapId(params.mapId),
          getEdgesByMapId(params.mapId),
          getMapName(params.mapId)
        ])
        setNodes(nodesData)
        setEdges(edgesData)
        setMapName(mapData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.mapId])

  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }

  const onEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }

  const onConnect = (connection) => {
    setEdges((eds) => addEdge(connection, eds))
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll={true}
        preventScrolling={false}
        fitView={true}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <DisplayName name={mapName} />
        
      </ReactFlow>
    </div>
  )
}

export default Map

function DisplayName ({name}: {name: string}) {
  return(
    <div className='m-4' >

    <span className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm transition-colors duration-200 ease-in-out hover:bg-gray-200">
      {name}
    </span>
    </div>
  )
}