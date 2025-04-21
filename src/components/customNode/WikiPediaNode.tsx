"use client";

import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface WikiPediaNodeProps {
  data: {
    title: string;
    content: string;
    link: string;
    fullContent: string;
  };
}

const WikiPediaNode = memo(({ data }: WikiPediaNodeProps) => {
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);
  const { title, content, link } = data;

  return (
    <>
      <div className="relative w-[300px] rounded-lg border border-gray-200 bg-white p-4 shadow-md">
        {/* Input Handle */}
        <Handle
          type="target"
          position={Position.Top}
          className="h-3 w-3 !bg-gray-500"
        />

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Bottom}
          className="h-3 w-3 !bg-gray-500"
        />

        {/* Header with Title and External Link */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {title}
          </h3>
          <Link
            href={link}
            target="_blank"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Content Preview */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-3">
          {content.slice(0, 150) + "..."}
        </p>

        {/* Read More Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => setIsReadMoreOpen(true)}
        >
          Read more
        </Button>
      </div>

      {/* Read More Dialog */}
      <Dialog open={isReadMoreOpen} onOpenChange={setIsReadMoreOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                {title}
                <Link
                  href={link}
                  target="_blank"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className=" prose prose-sm dark:prose-invert">
            <p className="text-sm text-gray-700">
              <ReactMarkdown>{content}</ReactMarkdown>
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsReadMoreOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

WikiPediaNode.displayName = "WikiPediaNode";

export default WikiPediaNode;
