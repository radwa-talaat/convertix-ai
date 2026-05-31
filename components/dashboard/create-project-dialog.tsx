"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateProjectDialogProps = {
  disabled?: boolean;
  onCreate: (name: string) => void;
};

export function CreateProjectDialog({
  disabled,
  onCreate,
}: CreateProjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  function submitProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreate(name);
    setName("");
    setOpen(false);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Plus />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitProject}>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>
              Start a new landing page workspace saved to Supabase.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              autoFocus
              disabled={disabled}
              id="project-name"
              minLength={2}
              onChange={(event) => setName(event.target.value)}
              placeholder="Q3 Product Launch"
              required
              value={name}
            />
          </div>
          <DialogFooter className="mt-6">
            <Button
              onClick={() => setOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={disabled} type="submit">
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
