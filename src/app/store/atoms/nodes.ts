import { atom } from "recoil";

export const reactNode  = atom({
    key: 'reactNode',
    default: [] as any[]
})

export const reactEdge = atom({
    key: 'reactEdge',
    default: [] as any[]
})

export const relativeParentNodePosition = atom({
    key: 'relativeParentNodePosition',
    default: {x: 0, y: 0}
})

export const selectedNode = atom({
    key: 'selectedNode',
    default: {}
})

export const selectedNodes = atom({
    key: 'selectedNodes',
    default: [] as any[]
})