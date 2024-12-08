import { atom } from "recoil";

export const reactNode  = atom({
    key: 'reactNode',
    default: []
})

export const reactEdge = atom({
    key: 'reactEdge',
    default: []
})

export const relativeParentNodePosition = atom({
    key: 'relativeParentNodePosition',
    default: {x: 0, y: 0}
})

export const selectedNode = atom({
    key: 'selectedNode',
    default: {}
})