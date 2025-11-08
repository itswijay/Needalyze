'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useState } from 'react'
import WhatsappButton from './WhatsappButton'

const CreateLinkDialog = () => {
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const generateFormLink = async () => {
    setIsGenerating(true)
    
    try {
      
      const formId = `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      const generatedLink = `${window.location.origin}/form/step1?ref=${formId}`
      
      setLink(generatedLink)
      
      
    } catch (error) {
      console.error('Error generating form link:', error)

    } finally {
      setIsGenerating(false)
    }
  }

  const handleDialogOpen = (open) => {
    setIsOpen(open)
    if (open) {

      setCopied(false)
      setLink('')
      generateFormLink()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-[#3EAA66] to-[#189370] w-full px-3 py-3 sm:py-5 text-xs sm:text-sm">
            Create New Link
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Need Analysis Form Link</DialogTitle>
            <DialogDescription className="text-sm">
              Share this link with your clients to collect their need analysis information.
            </DialogDescription>
          </DialogHeader>
          
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3EAA66]"></div>
              <p className="text-sm text-gray-600">Generating your form link...</p>
            </div>
          ) : link ? (
            <>
              <div className="flex items-center gap-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input id="link" value={link} readOnly className="text-xs" />
                </div>
              </div>
              <DialogFooter>
                <div className="flex justify-end w-full gap-2">
                  <WhatsappButton link={link} />
                  <Button
                    type="button"
                    variant="primary"
                    onClick={copyToClipboard}
                    className="bg-gradient-to-r from-[#3EAA66] to-[#189370] hover:opacity-90 text-white cursor-pointer"
                  >
                    {copied ? 'Copied' : 'Copy Link'}
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-6">
              <p className="text-sm text-red-500">Failed to generate link. Please try again.</p>
              <Button
                onClick={generateFormLink}
                className="bg-gradient-to-r from-[#3EAA66] to-[#189370] hover:opacity-90"
              >
                Retry
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateLinkDialog