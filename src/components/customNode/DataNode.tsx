'use client'

import { useState, useRef, useEffect, memo } from 'react'
import { ChevronDown, ChevronUp, Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Handle, Position } from '@xyflow/react'
import ReactMarkdown from 'react-markdown'

export default memo(({ data }: { data: { title: string, description: string, color: string }}) => {

  const [isOpen, setIsOpen] = useState(true)
  const [cardColor, setCardColor] = useState(data.color)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const toggleAccordion = () => setIsOpen(!isOpen)
  
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : '0'
    }
  }, [isOpen])  

  const colorOptions = [
    { value: '#FFF7ED', label: 'Orange' },
    { value: '#FEFCE8', label: 'Yellow' },
    { value: '#ECFDF5', label: 'Green' },
    { value: '#F5F5F5', label: 'Gray' },
    { value: '#EFF6FF', label: 'Blue' },
    { value: '#FAF5FF', label: 'Purple' }
  ]

  const handleColorChange = (color: string) => {
    setCardColor(color)
    setIsDialogOpen(false) // Close the dialog after color selection
  }

  return (
    <div className="relative w-[400px]">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-16 !bg-muted-foreground/50 !rounded-t-md" 
      />
      <Card
        className="w-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
        style={{ backgroundColor: cardColor }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold mr-2">{data.title}</CardTitle>
          <div className="flex items-center space-x-1">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Palette className="h-4 w-4" />
                  <span className="sr-only">Change card color</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Change Card Color</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <RadioGroup
                    value={cardColor}
                    onValueChange={handleColorChange}
                    className="grid grid-cols-3 gap-4"
                  >
                    {colorOptions.map((option, index) => (
                      <div key={index}>
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={option.value}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span
                            className="w-12 h-12 rounded-full mb-2"
                            style={{ backgroundColor: option.value }}
                          />
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleAccordion} 
              aria-expanded={isOpen}
              className="h-8 w-8"
            >
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">{isOpen ? 'Close' : 'Open'} accordion</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div
            ref={contentRef}
            className="overflow-hidden transition-all duration-300 ease-in-out"
          >
            <div className="text-sm text-muted-foreground prose prose-sm max-w-none pt-2">
              <ReactMarkdown>{data.description}</ReactMarkdown>
            </div>
          </div>
        </CardContent>
      </Card>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-16 !bg-muted-foreground/50 !rounded-b-md" 
      />
    </div>
  )
})

