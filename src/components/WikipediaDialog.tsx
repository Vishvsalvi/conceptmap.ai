import { useState, useCallback, useMemo, memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  reactEdge,
  reactNode,
  relativeParentNodePosition,
} from "@/app/store/atoms/nodes";
import { targetNode } from "@/app/store/atoms/nodelabel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { TextShimmer } from "./ui/text-shimmer";
import { TextLoop } from "./ui/text-loop";

export type WikiPediaData = {
  title: string;
  link: string;
  content: string;
};

interface WikiPediaDialogProps {
  isOpen: boolean;
  WikiPediaDataArray: WikiPediaData[];
  onClose: () => void;
  isLoading: boolean;
}

interface ReadMoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title: string;
}

const ReadMoreDialog = memo(
  ({ isOpen, onClose, content, title }: ReadMoreDialogProps) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {content}
            </p>
          </div>
          <DialogFooter>
            <Button>Summarize</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

const WikipediaDialog = memo(
  ({
    isOpen,
    WikiPediaDataArray,
    onClose,
    isLoading,
  }: WikiPediaDialogProps) => {
    console.log(WikiPediaDataArray);
    const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
    const [readMoreContent, setReadMoreContent] = useState<{
      isOpen: boolean;
      content: string;
      title: string;
    }>({
      isOpen: false,
      content: "",
      title: "",
    });

    const setNodes = useSetRecoilState(reactNode);
    const setEdges = useSetRecoilState(reactEdge);
    const parentNodePosition = useRecoilValue(relativeParentNodePosition);
    const target = useRecoilValue(targetNode);

    const handleCheckboxChange = useCallback((articleLink: string) => {
      setSelectedArticles((prev) =>
        prev.includes(articleLink)
          ? prev.filter((link) => link !== articleLink)
          : [...prev, articleLink]
      );
    }, []);

    const addWikipediaNode = useCallback(
      (title: string, content: string, link: string) => {
        const newNode = {
          id: new Date().getTime().toString(),
          type: "wikiPediaNode",
          position: {
            x:
              parentNodePosition.x +
              Math.floor(Math.random() * (500 - 300 + 1)) +
              300,
            y:
              parentNodePosition.y +
              Math.floor(Math.random() * (500 - 300 + 1)) +
              300,
          },
          data: {
            title,
            content,
            link,
          },
        };
        setNodes((prevNodes) => [...prevNodes, newNode]);
        addNewEdge(target, newNode.id);
      },
      [parentNodePosition, target, setNodes]
    );

    const addNewEdge = useCallback(
      (source: string, target: string) => {
        const newEdge = {
          id: new Date().getTime().toString(),
          source,
          target,
          animated: false,
        };
        setEdges((prevEdges) => [...prevEdges, newEdge]);
      },
      [setEdges]
    );

    const handleAddToMap = useCallback(() => {
      const articlesToAdd = WikiPediaDataArray.filter((article) =>
        selectedArticles.includes(article.link)
      );

      articlesToAdd.forEach((article, index) => {
        setTimeout(() => {
          addWikipediaNode(article.title, article.content, article.link);
          if (index === articlesToAdd.length - 1) {
            onClose();
          }
        }, index * 500);
      });
    }, [WikiPediaDataArray, selectedArticles, addWikipediaNode, onClose]);

    const handleReadMore = useCallback((content: string, title: string) => {
      setReadMoreContent({
        isOpen: true,
        content,
        title,
      });
    }, []);

    const articleCards = useMemo(
      () =>
        WikiPediaDataArray.map((article, index) => (
          <Card
            key={index}
            className="overflow-hidden transition-shadow hover:shadow-lg"
          >
            <CardHeader className="p-4">
              <CardTitle className="line-clamp-2 text-sm flex items-center justify-between">
                {article.title}
                <Link href={article.link} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="line-clamp-3 text-xs">
                {article.content.slice(0, 150)}...
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
              <Checkbox
                id={`checkbox-${index}`}
                checked={selectedArticles.includes(article.link)}
                onCheckedChange={() => handleCheckboxChange(article.link)}
              />
            </CardFooter>
          </Card>
        )),
      [WikiPediaDataArray, selectedArticles, handleCheckboxChange]
    );

    return (
      <>
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Wikipedia Articles</DialogTitle>
            </DialogHeader>
            {isLoading ? (
                  <div className="flex justify-center items-center text-sm h-[100px]">
                <TextShimmer>
                  Agent is working on your request, please wait. 
                </TextShimmer>
              </div>
            ) : (
              <ScrollArea className="h-[70vh]">
                <div className="grid gap-4 sm:grid-cols-2">{articleCards}</div>
              </ScrollArea>
            )}

            <DialogFooter>
              <Button
                onClick={handleAddToMap}
                disabled={isLoading || selectedArticles.length === 0}
              >
                {isLoading
                  ? "Please wait..."
                  : `Add ${selectedArticles.length} Article${
                      selectedArticles.length !== 1 ? "s" : ""
                    } to Map`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ReadMoreDialog
          isOpen={readMoreContent.isOpen}
          onClose={() =>
            setReadMoreContent((prev) => ({ ...prev, isOpen: false }))
          }
          content={readMoreContent.content}
          title={readMoreContent.title}
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isOpen === nextProps.isOpen &&
      prevProps.WikiPediaDataArray === nextProps.WikiPediaDataArray
    );
  }
);

export default WikipediaDialog;
