'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'


type ConceptType = 'Sub-Concept' | 'Similar Concept' | 'Parent Concept' | 'Related Concept'

interface ConceptNodeData {
  term: string
  title: ConceptType
}

const conceptStyles: Record<ConceptType, { border: string; bg: string; text: string }> = {
  'Sub-Concept': {
    border: 'border-blue-400',
    bg: 'bg-blue-100',
    text: 'text-blue-600',
  },
  'Similar Concept': {
    border: 'border-green-400',
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  'Parent Concept': {
    border: 'border-purple-400',
    bg: 'bg-purple-100',
    text: 'text-purple-600',
  },
  'Related Concept': {
    border: 'border-orange-400',
    bg: 'bg-orange-100',
    text: 'text-orange-600',
  },
}


const ConceptNode = ({ data }: { data: ConceptNodeData }) => {
  const styles = conceptStyles[data.title]
  

  return (
    <>
      <Handle type="target" position={Position.Top} className={`w-16 !${styles.border.replace('border', 'bg')}`} />
      <div className={`flex flex-col w-[200px] p-4 rounded-2xl border-2 ${styles.border} bg-white`}>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className={`uppercase ${styles.bg} ${styles.text} px-3 py-1 rounded-full text-sm font-medium inline-block`}>
              {data.title}
            </div>
            <h3 className="text-lg font-medium">
              {data.term}
            </h3>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className={`w-16 !${styles.border.replace('border', 'bg')}`} />
    </>
  )
}

export default memo(ConceptNode)

