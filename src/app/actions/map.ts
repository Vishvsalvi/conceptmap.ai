"use server"
import { Content, Edge, Map, Node } from "@prisma/client";
import prisma from "../db";

// Create a new node
export const createNode = async (node: Node) => {
    const newnode = await prisma.node.create({
        data: {
        id: node.id,
        type: node.type,
        position: node.position || { x: 0, y: 0 },
        data: node.data || {},
        mapId: node.mapId,
        }
    })
    return newnode;
}

// Create a new edge
export const createEdge = async (edge: Edge) => {
    const newedge = await prisma.edge.create({
        data: edge
    });
    return newedge;
}

// Create a new map
export const createMap = async (map: Map) => {
   const newmap =  await prisma.map.create({
        data: map
    });
   return newmap.id;
}

// Create a new content
export const createContent = async(content: Content) => {
    
    const newcontent = await prisma.content.create({
        data: content
    })
    return newcontent;
}

// Get a content by email
export const getAllContent = async (email: string) => {
    const contents = await prisma.content.findMany({
        where: {
            email: email
        },
        select: {
            id: true,
            name: true,
            type: true,
            content: true
        }
    });
    return contents;
}

// Get map by email and mapId
export const getMap = async (email: string, mapId: string) => {
    const map = await prisma.map.findFirst({
        where: {
            id: mapId,
            email: email
        }
    });
    return map;
}

// Get all maps by email
export const getAllMaps = async (email: string) => {
    const maps = await prisma.map.findMany({
        where: {
            email: email
        }
    });
    return maps;
}  

// Get all nodes by mapId
export const getNodesByMapId = async (mapId: string) => {
    const nodes = await prisma.node.findMany({
        where: {
            mapId: mapId,
        },
    });

    // Remove mapId from each node
    const nodesWithoutMapId = nodes.map(({ mapId, ...rest }) => rest);

    return nodesWithoutMapId;
};


// Get all edges by mapId
export const getEdgesByMapId = async (mapId: string) => {
    const edges = await prisma.edge.findMany({
        where: {
            mapId: mapId
        }
    });

     const edgesWithAnimation = edges.map(({ mapId, ...rest }) => ({
        ...rest,
        animated: true,
    }));

    return edgesWithAnimation;
}
// Get map name by mapId
export const getMapName = async (mapId: string) => {
    const map = await prisma.map.findFirst({
        where: {
            id: mapId
        }
    });
    return map?.name;
}

//  Delete map by mapId
export const deleteMap = async (mapId: string) => {
    const map = await prisma.map.delete({
        where: {
            id: mapId
        }
    });
    return map;
}

export const updateMap = async(map: Map) => {
    const updatedMap = await prisma.map.update({
        where: {
            id: map.id
        },
        data: map
    });
    return updatedMap;
}

export const deleteNodesAndEdgesByMapId = async(mapId: string) => {
     await prisma.node.deleteMany({
        where: {
            mapId: mapId
        }
    });

     await prisma.edge.deleteMany({
        where: {
            mapId: mapId
        }
    });

    return true;
}
