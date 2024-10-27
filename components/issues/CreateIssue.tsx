"use client"

import { Input } from "@/components/ui/input"
import { ArrowLeft, LucideLoader2 } from "lucide-react"

import { Fragment, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, UserCircle } from "lucide-react"

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const assignees = [
  { name: "John Doe", email: "john@example.com", initials: "JD" },
  { name: "Jane Smith", email: "jane@example.com", initials: "JS" },
  { name: "Bob Johnson", empCode: "EMP001", initials: "BJ" },
]


import IssueForm from "./IssueForm"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { fetchProcessAreasData, IProcessAreas } from "@/redux/features/processAreasData"
import AddNewIssueDialogue from "./AddNewIssueDialogue"

export default function CreateIssue() {
  const [isProcessAreaDialogOpen, setIsProcessAreaDialogOpen] = useState(false)
  const [isIssueTypeDialogOpen, setIsIssueTypeDialogOpen] = useState(false)
  const [isIssueFromDialogOpen, setIsIssueFormDialogOpen] = useState(false)
  const [selectedProcessArea, setSelectedProcessArea] = useState<IProcessAreas>()
  const [selectedIssueType, setSelectedIssueType] = useState("")
  const [processAreaSearch, setProcessAreaSearch] = useState("")
  const [issueTypeSearch, setIssueTypeSearch] = useState("")

  const [priority, setPriority] = useState("low")
  const [summary, setSummary] = useState("")
  const [assignee, setAssignee] = useState(null)
  const [dueDate, setDueDate] = useState(null)

  const{processAreasData,processAreasDataStatus,processAreasDataError} = useSelector((state:RootState)=>state.processAreasData)
  const dispatch = useDispatch<AppDispatch>()

  const [processAreas,setProcessAreas] = useState(["Area 1", "Area 2", "Area 3", "Area 4", "Area 5"])
  const [issueTypes,setIssueTypes] = useState(["Vehicle Branding", "Tyre Puncture", "Driver Issue"])

  const filteredProcessAreas = processAreasData.filter(area =>
    area.label.toLowerCase().includes(processAreaSearch.toLowerCase())
  )

  const filteredIssueTypes = selectedProcessArea?.forms.filter(type =>
    type.formName.toLowerCase().includes(issueTypeSearch.toLowerCase())
  )

  const handleCreateIssue = () => {
    setIsProcessAreaDialogOpen(true)
  }

  const handleProcessAreaSelect = (area: IProcessAreas) => {
    setSelectedProcessArea(area)
    setIsProcessAreaDialogOpen(false)
    setIsIssueTypeDialogOpen(true)
  }

  const handleIssueTypeSelect = (type: string) => {
    setSelectedIssueType(type)
    setIsIssueTypeDialogOpen(false)
    setIsIssueFormDialogOpen(true)
    // Here you would typically handle the submission of the selected process area and issue type
  }

  const handleBackToProcessArea = () => {
    setIsIssueTypeDialogOpen(false)
    setIsProcessAreaDialogOpen(true)
  }

  const handeleBackToIssueTypeSelect = () => {
    setIsIssueTypeDialogOpen(true)
    setIsIssueFormDialogOpen(false)
  }

  useEffect(()=>{
    if(processAreasDataStatus === "idle"){
      dispatch(fetchProcessAreasData())
    }
    
  },[processAreasDataStatus, dispatch])

  
  return (
    <div className="relative">
      <Button className="bg-accent" onClick={handleCreateIssue}>Create Issue</Button>

      <Dialog open={isProcessAreaDialogOpen} onOpenChange={setIsProcessAreaDialogOpen}>
        <DialogContent className="absolute z-[999] flex-col flex w-[97.5vw] h-[97.5vh] max-w-[100vw]">
          {
            processAreasDataStatus === "loading"?<div className=' flex justify-center items-center h-[100vh]'>
            <LucideLoader2 className="animate-spin w-40 h-40" />
          </div> : processAreasDataStatus === "failed"?<div className=' flex justify-center items-center h-[100vh]'>
              <h1>{processAreasDataError}</h1>
            </div>:
            
            <Fragment>
            <DialogHeader>
            <DialogTitle>Please select the Process Area</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search process areas..."
            value={processAreaSearch}
            onChange={(e) => setProcessAreaSearch(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-2">
            {filteredProcessAreas.map((area) => (
              <Button
                key={area._id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleProcessAreaSelect(area)}
              >
                {area.label}
              </Button>
            ))}
          </div>
          </Fragment>
          }
        </DialogContent>
      </Dialog>

      <Dialog open={isIssueTypeDialogOpen} onOpenChange={setIsIssueTypeDialogOpen}>
        <DialogContent className="absolute z-[500] flex-col flex w-[97.5vw] h-[97.5vh] max-w-[100vw]">
          <DialogHeader>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={handleBackToProcessArea} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle>{selectedProcessArea?.label}</DialogTitle>
            </div>
          </DialogHeader>
          <Input
            placeholder="Search issue types..."
            value={issueTypeSearch}
            onChange={(e) => setIssueTypeSearch(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-2">
            {filteredIssueTypes?.map((form) => (
  
              <AddNewIssueDialogue key={form.formId} formId={form.formId} formName={form.formName} processAreaName={selectedProcessArea.label}/>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* <Dialog open={isIssueFromDialogOpen} onOpenChange={setIsIssueFormDialogOpen}>
        <DialogContent className="absolute flex-col flex w-[97.5vw] h-[97.5vh] max-w-[100vw]">
        <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create Issue</span>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(priorityColors).map(([value, colorClass]) => (
                  <SelectItem key={value} value={value}>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Issue Summary</h3>
            <Textarea
              placeholder="Type your issue summary here."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="h-24"
            />
          </div>
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Assign</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                            {assignee.initials}
                          </span>
                          <span>{assignee.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-5 h-5" />
                          <span>Assign to</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {assignees.map((a) => (
                      <SelectItem key={a.email || a.empCode} value={a as any}>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                            {a.initials}
                          </span>
                          <div>
                            <div>{a.name}</div>
                            <div className="text-sm text-muted-foreground">{a.email || a.empCode}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !dueDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : <span>Due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button>Report</Button>
            </div>
          </div>
        </div>
      </DialogContent>
      </DialogContent>
      </Dialog> */}
    </div>
  )
}