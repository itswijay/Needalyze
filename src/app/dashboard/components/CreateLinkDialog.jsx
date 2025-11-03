"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2Icon } from "lucide-react";

import { useState } from "react";

const CreateLinkDialog = () => {
  const [link, setLink] = useState(
    "https://formlink.com/s/your-generated-link"
  );
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-[#3EAA66] to-[#189370] w-full px-2 py-5">
            Create New Link
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create link</DialogTitle>
            <DialogDescription className="text-sm">
              Copy this link to share with others.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" value={link} readOnly />
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-between w-full ">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                    link
                  )}`;
                  window.open(whatsappUrl, "_blank");
                }}
              >
                <Share2Icon size={25} className="mr-2" />
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  navigator.clipboard
                    .writeText(link)
                    .then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    })
                    .catch(() => {});
                }}
                className="bg-gradient-to-r from-[#3EAA66] to-[#189370] hover:opacity-90 text-white cursor-pointer"
              >
                {copied ? "Copied" : "Copy Link"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateLinkDialog;
