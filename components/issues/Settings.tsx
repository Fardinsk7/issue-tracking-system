"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings as SettingIcon } from "lucide-react"
import CustomIssueType from "./CustomIssueType"

export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customIssueType, setCustomIssueType] = useState("")

  const handleCreateCustomIssue = () => {
    // Here you would typically send the custom issue type to your backend
    console.log("Creating custom issue type:", customIssueType)
    setIsModalOpen(false)
    setCustomIssueType("")
  }

  return (
    <span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SettingIcon className="h-4 w-4" />
            <span className="sr-only">Open settings menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
            Create Custom Issue Type
          </DropdownMenuItem>
          {/* Add more settings options here if needed */}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="absolute z-[50] flex-col flex w-[97.5vw] h-[97.5vh] max-w-[100vw]">
          <CustomIssueType />
        </DialogContent>
      </Dialog>
    </span>
  )
}