'use client'

import { useState, useRef, useEffect, memo } from 'react'
import { Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Handle, Position } from '@xyflow/react'

// Function to determine text color based on background color
function getContrastColor(hexColor: string) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export default memo(({ data }: { data: { label: string; color?: string; onColorChange?: (color: string) => void } }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [cardColor, setCardColor] = useState(data.color || '#FFFFFF')
  const [cardHeight, setCardHeight] = useState('auto')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleAccordion = () => setIsOpen(!isOpen)

  useEffect(() => {
    if (contentRef.current) {
      const height = isOpen ? contentRef.current.scrollHeight : 0
      setCardHeight(`${height + 56}px`) // Reduced from 76px to 56px for less padding
    }
  }, [isOpen])

  const colorOptions = [
    { value: '#FFFFFF', label: 'White' },
    { value: '#FFF7ED', label: 'Orange' },
    { value: '#FEFCE8', label: 'Yellow' },
    { value: '#ECFDF5', label: 'Green' },
    { value: '#F5F5F5', label: 'Gray' },
    { value: '#EFF6FF', label: 'Blue' },
    { value: '#FAF5FF', label: 'Purple' }
  ]

  const textColor = getContrastColor(cardColor)

  const handleColorChange = (color: string) => {
    setCardColor(color)
    setIsDialogOpen(false) // Close the dialog after color selection
    // Call the onColorChange callback if provided
    if (data.onColorChange) {
      data.onColorChange(color)
    }
  }

  return (
    <>
      <Handle type="target" position={Position.Top} className="w-16 !bg-muted-foreground" />
      <Card 
        className="cursor-pointer w-full max-w-md transition-all duration-300 ease-in-out" 
        style={{ backgroundColor: cardColor, height: cardHeight, color: textColor }}
      >
        <CardHeader className="px-4 py-2">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-center flex-grow" style={{ color: textColor }}>{data.label}</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2 h-8 w-8"
                  style={{ color: textColor }}
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
          </div>
        </CardHeader>
        <CardContent ref={contentRef} className="px-4 pb-4" />
      </Card>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-muted-foreground" />
    </>
  )
})

