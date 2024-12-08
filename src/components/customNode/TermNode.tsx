'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

const TermNode = ({ data }: {data: {term: string}}) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-16 !bg-pink-400" />
      <div className="flex flex-col w-[200px] p-4 rounded-2xl border-2 border-pink-400 bg-white">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
              TERMS
            </div>
            <h3 className="text-lg font-medium">
              {data.term}
            </h3>
          </div>

        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-pink-400" />
    </>
  )
}

export default memo(TermNode)