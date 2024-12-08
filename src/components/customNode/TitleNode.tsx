'use client'
import { useState, useRef, useEffect, memo } from 'react'
import { Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Handle, Position } from '@xyflow/react'

export default memo( ( { data }: { data: { label:string } } ) => {
  const [isOpen, setIsOpen] = useState(false)
  const [cardColor, setCardColor] = useState('#ffffff')
  const [cardHeight, setCardHeight] = useState('auto')
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleAccordion = () => setIsOpen(!isOpen)

  useEffect(() => {
    if (contentRef.current) {
      const height = isOpen ? contentRef.current.scrollHeight : 0
      setCardHeight(`${height + 56}px`) // Reduced from 76px to 56px for less padding
    }
  }, [isOpen])

  const colorOptions = [
    { value: '#ffffff', label: 'White' },
    { value: '#f3f4f6', label: 'Light Gray' },
    { value: '#e5e7eb', label: 'Gray' },
  ]

  return (
    <>
      <Handle type="target" position={Position.Top} className="w-16 !bg-muted-foreground" />
      <Card 
        className="cursor-pointer w-full max-w-md transition-all duration-300 ease-in-out" 
        style={{ backgroundColor: cardColor, height: cardHeight }}
      >
        <CardHeader className="px-4 py-2">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-center flex-grow">{data.label}</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2 h-8 w-8"
                >
                  <Palette className="h-4 w-4" />
                  <span className="sr-only">Change card color</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Change Card Color</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <RadioGroup value={cardColor} onValueChange={setCardColor} className="grid grid-cols-3 gap-4">
                    {colorOptions.map((option, index) => (
                      <div key={index}>
                        <DialogClose asChild>
                          <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                        </DialogClose>
                        <Label 
                          htmlFor={option.value} 
                          className="flex flex-col items-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                        >
                          <span className="w-12 h-12 rounded-full mb-2" style={{ backgroundColor: option.value }} />
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent ref={contentRef} className="px-4 pb-4" />
      </Card>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-muted-foreground" />
    </>
  )
})