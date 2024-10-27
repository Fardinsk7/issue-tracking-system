"use client"

import { useState } from "react";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Plus, Download, Search, Filter, User, ListTodo } from "lucide-react";

import Settings from "./Settings";
import CreateIssue from "./CreateIssue";

export default function IssuesHeader({onSearch}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<
    { type: string; isChecked: boolean } | {}
  >({});
  const [currentFilter, setCurrentFilter] = useState("All Issues");
  const[searchInput,setSearchInput] = useState("")

  const handleIssueTypeChange = (type: keyof typeof selectedIssueTypes) => {
    setSelectedIssueTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleDownload = () => {
    // Implement the download logic here
    setIsDialogOpen(false);
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    // Implement the filtering logic here
  };

  return (
    <>
      <header className="flex flex-wrap items-center justify-between py-4 bg-background border-b gap-4">
        <div className="flex flex-wrap items-center space-x-4">

         <CreateIssue />
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-8 w-[300px]"
              placeholder="Search issues..."
              type="search"
              onChange={(e)=>onSearch(e.target.value)}
            />
            
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {currentFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => handleFilterChange("All Issues")}
              >
                <ListTodo className="mr-2 h-4 w-4" />
                All Issues
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleFilterChange("Assigned to Me")}
              >
                <User className="mr-2 h-4 w-4" />
                Assigned to Me
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleFilterChange("My Issues")}
              >
                <User className="mr-2 h-4 w-4" />
                My Issues
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Settings />
        </div>
     
      </header>
    </>
  );
}
