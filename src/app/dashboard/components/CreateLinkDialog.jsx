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
            <DialogDescription>
              Copy this link to share view access with others.
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
          <DialogFooter className="inline-flexflex sm:justify-between ">
            <div className="hidden sm:flex">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="">
                  Close
                </Button>
              </DialogClose>
            </div>
            <div>
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
