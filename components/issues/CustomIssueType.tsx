"use client"

import { Fragment, useState } from "react"


import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { format } from "date-fns"
import { CalendarIcon, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toCamelCase } from "@/helper/helper"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "../ui/toaster"
import IssueImageGallery from "./issueImageGallery"
import ProcessAreaInput from "./processAreaInput"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import axios, { AxiosError } from "axios"


// import { createFlowJson } from "@/lib/create-flow-json"

type FieldType = "text" | "number" | "passcode" | "email" | "phone" | "password" | "checkbox" | "radio" | "dropdown" | "datepicker"

interface Field {
  id: string
  fieldId?:string
  label: string
  type: string
  subType?: string
  options?: string[]
}

interface CustomIssueTypeProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export interface ApiResponse{
  success:boolean,
  message:string
}

const CustomIssueType: React.FC<CustomIssueTypeProps> = ({ isOpen, setIsOpen }) => {
  const [fields, setFields] = useState<Field[]>([])
  const [newField, setNewField] = useState<Field>({ id: "",fieldId:"", label: "", type: "text" })
  const [options, setOptions] = useState<string>("")
  const {toast} =useToast()
  const [formData, setFormData] = useState({});
  const [imagesOption,setImagesOptions] = useState([])
  const [formType, setFormType]= useState("")
  const [processAreaName,setProcessAreaName] = useState("")
  const [createFormLoading,setCreateFormLoading] = useState(false)



  const handleCheckboxChange = (data,field) => {
    setFormData((prev) => {
      console.log("Old Data: ",prev[field.fieldId].toString())
      const updatedCheckBox = prev[field.fieldId].includes(data)
        ? prev[field.fieldId].filter((p) => p !== data)
        : [...prev[field.fieldId], data];
      console.log("New Data: ",updatedCheckBox.toString())
  
    
      return { ...prev, [field.fieldId]: updatedCheckBox };
    });
  };


  const addField = () => {
    let fieldIdToAdd = toCamelCase(newField.label.trim());
    const checkFieldExist = fields.find((e)=>e.fieldId===fieldIdToAdd)
    if(checkFieldExist){
      return toast({
        title:"Field Already Exist",
        variant:"destructive"
      })
    }
    if (newField.label && newField.type) {
      const fieldToAdd: Field = {
        ...newField,
        label:newField.label.trim(),
        fieldId:fieldIdToAdd,
        id: Date.now().toString(),
      }
      console.log(fieldToAdd)
      if (newField.type === "checkBox" || newField.type === "dropDown" || newField.type === "image" || newField.type === "radio") {
    
        if((!options || options.length === 0) && newField.type !== "image"){
          toast({
            title:"Please atleast an option for this field",
            variant:"destructive"
          })
          return
        }
        fieldToAdd.options = newField.type ==="image"? [] :options.split(",").map(o => o.trim())
      }

      if (newField.type === "text") {
        fieldToAdd.type = "text"
        fieldToAdd.subType = newField.type
      }

      setFields([...fields, fieldToAdd])
      setOptions("")
    }
  }

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id))
  }

  const renderField = (field: Field) => {
    if (field.type === "text") {
      return <Input type="text" placeholder={`Enter ${field.label}`} className="border-[1px] border-gray-400" />
    }
   
    else if (field.type === "checkBox") { 
      return <div className="p-6 bg-white rounded-lg   mt-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
        {field.options?.map((option) => (
          <div key={option} className="flex items-center space-x-1 ">
            <Checkbox
              id={option}
              // checked={selectedProblems.includes(problem)}
              checked={ !Array.isArray(formData[field.fieldId])?setFormData((prev)=>({...prev,[field.fieldId]:[]})) : formData[field.fieldId].includes(option)}
              onCheckedChange={() => handleCheckboxChange(option,field)}
            />
            <label
              htmlFor={option}
              className="text-[9px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      
    </div>
    }
    else if (field.type === "image") {
      return <IssueImageGallery uploadPermission={false} images={imagesOption} title={""} onUpload={(url,fileName, title,file)=>{console.log("upload file: ", url); setImagesOptions([...imagesOption,file])}} onDelete={(index,fieldName, title)=>console.log(index)} fieldName={field.label}/>
     }
    else if (field.type === "dropDown") {
      console.log('Dropdown options:', field.options);
    
      // Ensure field.options is an array
      const options = Array.isArray(field.options) ? field.options : [];
      
      return (
        <Select >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent className="absolute z-[1000]">
                  <SelectItem value="demo">{`Select ${field.label}`}</SelectItem>
                    {
                      field.options.map((e,i)=><SelectItem value={e} key={i}>{e}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
      );
     }
     else if(field.type === "radio"){
      console.log(field.options)
      return <RadioGroup defaultValue={field.options?.[0]} className="flex flex-col space-y-1">
      {field.options?.map((option, index) => {
        console.log(option)
        return <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem value={option} id={`${field.fieldId}-${index}`} />
          <Label htmlFor={`${field.fieldId}-${index}`}>{option}</Label>
        </div>
      })}
    </RadioGroup>
     }
   
  }

  const createForm = async () => {
    setCreateFormLoading(true)
    if (!formType) {
      toast({
        title: "Please Add a Form Name",
        variant: "destructive"
      });
      return;
    }

    const formToAdd = {
      formType:formType,
      title: formType,
      processArea: processAreaName.trim(),
      fields: [...fields]
    };

    try {
      const response = await axios.post('/api/issues/addNewFormMetaData', formToAdd);
      
      if (response.data.success) {
        toast({
          title: "Form Created Successfully",
          description: response.data.message,
          variant: "default"
        });
        // Reset form fields or perform any other necessary actions
        setFormType('');
        setProcessAreaName('');
        setFields([]);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error", 
        description: axiosError.response?.data.message || "Error in setting switching",
        variant:"destructive",
      })
    }
    finally{
      setCreateFormLoading(false)
    }
  };

  return (<Fragment>
  
    <div className="flex w-[100%] h-[100%] gap-4 p-4">
      <div className="w-[60%] flex flex-col gap-y-4">
        <Card>
          <CardHeader>Issue Data</CardHeader>
          <CardContent>
            <div>
            <ProcessAreaInput selectedArea={processAreaName} setSelectedArea={setProcessAreaName}/>

            </div>
            <Input type="text" placeholder="Enter Issue Name" value={formType} onChange={(e)=>setFormType(e.target.value)}/>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Issue Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="fieldName">Field Name</Label>
                <Input
                  id="fieldName"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  placeholder="Enter field name"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="fieldType">Field Type</Label>
                <Select onValueChange={(value) => setNewField({ ...newField, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent className="absolute z-[1000]">
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="checkBox">Checkbox</SelectItem>
                    <SelectItem value="dropDown">Dropdown</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                  </SelectContent>
                </Select>
                
              </div>
              
            </div>
            {(newField.type === "checkBox" || newField.type === "dropDown" || newField.type === "radio") && (
              <div>
                <Label htmlFor="options">Options (comma-separated)</Label>
                <Input
                  id="options"
                  value={options}
                  onChange={(e) => setOptions(e.target.value)}
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}
            <Button onClick={addField} className="bg-accent text-white">Add Field</Button>
          </CardContent>
        </Card>
        

        <div className="h-[60%] overflow-y-scroll">
          <Card>
            <CardHeader>
              <CardTitle>Added Fields</CardTitle>
            </CardHeader>
            <CardContent>
              {fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between py-2">
                  <span>{field.label} ({field.type})</span>
                  <Button variant="destructive" size="icon" onClick={() => removeField(field.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Button className="bg-accent" onClick={() => {createForm()}} disabled={createFormLoading}>
         {createFormLoading? <span className="flex"><Loader2 className="animate-spin"/> Please Wait</span>:"Create Form"}
        </Button>
      </div>

      <Card className="w-[40%]">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-scroll max-h-[500px] min-h-[500px]">
          {fields.map((field) => (
            <div key={field.id} className="flex flex-col space-y-2">
              <Label htmlFor={field.id} className="block uppercase">{field.label}</Label>
              {renderField(field)}
            </div>
          ))}
          
        </CardContent>
      </Card>

    </div>
  
      <Toaster/>
    </Fragment>
  )
}

export default CustomIssueType;
