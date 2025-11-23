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

import { useContext, useState } from "react";
import WhatsappButton from "./WhatsappButton";
import { useAuthContext } from "@/context/AuthContext";

const CreateLinkDialog = () => {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [linkCreated, setLinkCreated] = useState(false);
  const { user: loadUser } = useAuthContext();

  const createNewLink = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/form-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: loadUser?.id,
          expiry_hours: 24*14, // Link expires in 14 days
        }),
      });

      const result = await response.json();

      if (result.success) {
        setLink(result.formUrl);
        setLinkCreated(true);
      } else {
        console.error("Failed to create link:", result.error);
        // You might want to show an error message here
      }
    } catch (error) {
      console.error("Error creating link:", error);
      // You might want to show an error message here
    } finally {
      setIsCreating(false);
    }
  };

  const resetDialog = () => {
    setLink("");
    setCopied(false);
    setLinkCreated(false);
  };

  return (
    <div>
      <Dialog onOpenChange={(open) => !open && resetDialog()}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-[#3EAA66] to-[#189370] w-full px-3 py-3 sm:py-5 text-xs sm:text-sm">
            Create New Link
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create link</DialogTitle>
            <DialogDescription className="text-sm">
              {!linkCreated
                ? "Click the button below to create a new form link."
                : "Copy this link to share with others."}
            </DialogDescription>
          </DialogHeader>
          {!linkCreated ? (
            <div className="flex justify-center py-4">
              <Button
                onClick={createNewLink}
                disabled={isCreating}
                className="bg-gradient-to-r from-[#3EAA66] to-[#189370] hover:opacity-90 text-white"
              >
                {isCreating ? "Creating..." : "Create New Link"}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input id="link" value={link} readOnly />
                </div>
              </div>
              <DialogFooter>
                <div className="flex justify-end w-full">
                  <WhatsappButton link={link} />
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateLinkDialog;
