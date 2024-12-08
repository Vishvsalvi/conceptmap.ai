import {atom} from 'recoil';

export const nodeLabelState = atom({
    key: 'nodeLabelState',
    default: ''
});

export const targetNode = atom({
    key: 'targetNode',
    default: ''
});