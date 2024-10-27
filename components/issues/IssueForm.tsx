import { useState } from "react"
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

export default function IssueForm() {
  const [priority, setPriority] = useState("low")
  const [summary, setSummary] = useState("")
  const [assignee, setAssignee] = useState(null)
  const [dueDate, setDueDate] = useState(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Issue</Button>
      </DialogTrigger>
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
    </Dialog>
  )
}

