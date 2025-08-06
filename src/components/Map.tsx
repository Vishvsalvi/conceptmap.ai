'use client'
import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from "@/components/Sidebar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { nodeLabelState } from '@/app/store/atoms/nodelabel';
import CustomTitleNode from '@/components/customNode/TitleNode';
import CustomDataNode from '@/components/customNode/DataNode';
import VideoNode from '@/components/customNode/VideoNode';
import TermNode from '@/components/customNode/TermNode';
import ConceptNode from '@/components/customNode/ConceptNode';
import { targetNode } from '@/app/store/atoms/nodelabel';
import { reactNode, reactEdge, relativeParentNodePosition, selectedNode } from '@/app/store/atoms/nodes'
import Menubar from './Menubar';

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string, description?: string };
  selected: boolean;
  style: {}
}

interface Edge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
}

interface MapProps {
  mapname?: string;
  mapId?: string;
  fetchedNodes?: Node[];
  fetchedEdges?: Edge[];
}

export default function Map({mapname, fetchedNodes, fetchedEdges, mapId}: MapProps) {  
  
  const [nodes, setNodes] = useRecoilState(reactNode);
  const [edges, setEdges] = useRecoilState(reactEdge);
  const setSelectedNode = useSetRecoilState(selectedNode);
  
  useEffect(() => {
    if(fetchedNodes && fetchedEdges) {
      setNodes(fetchedNodes);
      setEdges(fetchedEdges);
    }
    
  },[])

  
  const setNodeLabel = useSetRecoilState(nodeLabelState);
  const setTargetNode = useSetRecoilState(targetNode);

  const [parentNodePosition, setParentNodePosition] = useRecoilState(relativeParentNodePosition);

  const nodeTypes = {
    'titleNode': CustomTitleNode,
    'dataNode': CustomDataNode,
    'videoNode': VideoNode,
    'termNode': TermNode,
    'conceptNode': ConceptNode
  }



  const onConnect = useCallback(
    (connection) =>
      setEdges((eds: Edge[]) => addEdge({ ...connection, animated: true }, eds)),
    [edges],
  );

  const onNodesChange = useCallback(
    
    (changes) => {
      setNodes((nds) => {
        const clonedNodes = structuredClone(nds);
        return applyNodeChanges(changes, clonedNodes);
      });
    },
    [setNodes]
  );
  

  const getNodeData = useCallback(() => {
    const selectedNode = nodes.find((node: Node) => node.selected || false) as Node | undefined;
    setSelectedNode(selectedNode || {});
    setParentNodePosition(selectedNode?.position || { x: 0, y: 0 });

    if (selectedNode?.type === 'dataNode') {
      setNodeLabel(selectedNode.data.description || '');
    } else if (selectedNode?.type === 'termNode') {
      setNodeLabel(selectedNode.data.term || '');
    } else if (selectedNode?.type === 'conceptNode') {
      setNodeLabel(selectedNode.data.term || '');
    }


    else {
      setNodeLabel(selectedNode?.data.label || '');
    }
  }
    , [nodes])


  const getSelectedNode = useCallback(() => {
    const selectedNode = nodes.find((node: Node) => node.selected || false) as Node | undefined;
    if (selectedNode) {
      setTargetNode(selectedNode.id);
    }
  } 
  , [nodes])

  const addNewEdge = (source: string, target: string) => {
    const newEdge = {
      id: new Date().getTime().toString(),
      source,
      target,
      animated: false,
    };
    setEdges([...edges, newEdge]);
  }



  useEffect(() => {
    getNodeData();
    getSelectedNode();
  }, [nodes])

  const onEdgesChange = useCallback(
    (changes: any) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges],
  );

  const addNewNode = (content: string, viewportCenter?: { x: number; y: number }) => {
    if(!content) {
      toast.error('Please enter a topic name');
      return;
    }
    
    // Position the new node at viewport center or spread nodes if center not provided
    const position = viewportCenter || {
      x: Math.random() * 500,
      y: Math.random() * 500
    };
    
    const newNode = {
      id: new Date().getTime().toString(),
      type: 'titleNode',
      position,
      data: { label: content, color: "#FFFFFF" },
      // Don't add animation class immediately
    };
    setNodes([...nodes, newNode]);
    
    // Add animation class after a tiny delay to ensure node is rendered first
    setTimeout(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === newNode.id 
            ? { ...node, className: 'new-node-animation' }
            : node
        )
      );
    }, 50);
    
    // Remove animation class after animation completes
    setTimeout(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === newNode.id 
            ? { ...node, className: '' }
            : node
        )
      );
    }, 2500); // Adjusted for animation delay + duration
    
    return newNode.id; // Return node ID instead of position
  }

  const addDescriptionNode = (title: string, description: string) => {
    const newNode = {
      id: new Date().getTime().toString(),
      type: 'dataNode',
      position: {
        x: parentNodePosition.x + Math.floor(Math.random() * (500 - 300 + 1)) + 300,
        y: parentNodePosition.y + Math.floor(Math.random() * (500 - 300 + 1)) + 300
      },
      data: { title, description, color: "#FFFFFF" },
    };
    setNodes([...nodes, newNode]);
    return newNode.id;
  }

  // Function to update node data (including color)
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);
  

  return (
    

    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onColorChange: (color: string) => updateNodeData(node.id, { color })
          }
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView

      >
        <Panel position="top-right">
          <Sidebar addNewEdge={addNewEdge} addNewNode={addNewNode} addDescriptionNode={addDescriptionNode} />
        </Panel>
        <Panel position='top-left' >
        <Menubar mapId={mapId} mapname={mapname} />
        </Panel>

        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

      </ReactFlow>
      <ToastContainer />
    </div>

  );
}

