import React, { useState, useCallback, Fragment } from 'react'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IFromsData } from '@/redux/features/processAreasData';
import axios, { AxiosError } from 'axios';
import { Loader2, LucideLoader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import IssueImageGallery from './issueImageGallery';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from '../ui/checkbox';
import { toCamelCase } from '@/helper/helper';
import { useToast } from '@/hooks/use-toast';

interface AddNewIssueDialogueProps  {
    formName:string,
    formId:string,
    processAreaName:string,
}
export interface ApiResponse{
    success:boolean,
    message:string
}


const AddNewIssueDialogue: React.FC<AddNewIssueDialogueProps> = ({formName, formId, processAreaName}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formMetaData, setFormMetaData] = useState<any>(null);
    const [formData,setFormData] = useState(null);
    const [createIssueLoading,setCreateIssueLoading] = useState(false)
    const {toast} = useToast()

    const fetchIssueFormMetaData = async () => {
        if (isOpen) return; // Only fetch if the dialog is open
        console.log("dialogue is open")
        try {
            setIsLoading(true);
            const response = await axios(`/api/issues/getIssueFormMetaData?formId=${formId}`);
            console.log(response.data.data);
            const initialData = {};
            response.data.data.fields.forEach(field => {
                if(field.type === "text" || field.type === "dropDown" || field.type === "radio"){
                    initialData[field.fieldId] = '';
                }
                else if(field.type === "image" || field.type === "checkBox"){
                    initialData[field.fieldId] = [];
                }
                else if(field.type === "dropDown"){
                    initialData[field.fieldId] = "NA"
                }
            });
            setFormData(initialData);
            console.log("Initiale data: ", initialData)
            setFormMetaData(response.data.data);
            setError("");
        } catch (err) {
            console.error("Error fetching form metadata:", err);
            setError("Failed to load form data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        console.log("outside openchange")
        if (open) {
            console.log("inside openchange")
            fetchIssueFormMetaData();
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));  
      };

      const onUploadImage = (url,fieldName,title)=>{
        const newArr = formData[fieldName] || []
        setFormData(prev => ({ ...prev, [fieldName]: [...newArr,url] }));
        console.log(`One File Uploaded to ${title}`)
        // setLogs(`One File Uploaded to ${title}`)
      }
      
      const onDeleteImage = (index,fieldName,title)=>{        
        const newArr = formData[fieldName].filter((_, i) => i !== index)
        setFormData(prev => ({ ...prev, [fieldName]: [...newArr] }));
        console.log(`One File Deleted from ${title}`)
        // setLogs(`One File Deleted from ${title}`)
      }

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

    const renderTextField = (fieldData) => {
        
        return (
          <div className="mb-4">
            <Label>{fieldData.label}</Label>
            <div className="flex items-center">
              <Input
                type={fieldData.type}
                value={formData[fieldData.fieldId]}
                onChange={(e) => handleChange(fieldData.fieldId, e.target.value)}
                placeholder={`Enter ${fieldData.label}`}
                className="mr-2"
              />
            </div>
          </div>
        );
      };
    
      const renderImageField = (fieldData)=>{
        return <IssueImageGallery images={formData[fieldData.fieldId]} title={fieldData.label} onUpload={onUploadImage} onDelete={onDeleteImage} fieldName={fieldData.fieldId}/>
      }

      const renderDropDownField = (fieldData)=>{
        return<>
          <Label className='m-2'>{fieldData.label}</Label>
                <Select
                  value={formData[fieldData.fieldId]}
                  onValueChange={(value) => {handleChange(fieldData.fieldId, value);
                  }}
                  
                >
                  <SelectTrigger >
                    <SelectValue placeholder={`Select ${fieldData.label}`}/>
                  </SelectTrigger>
                  <SelectContent className='z-[999] m-2' >
                    {
                      fieldData.options?.map((e,i)=>{
                        return <SelectItem key={i} value={e} >{e}</SelectItem>
      })
                    }
                  </SelectContent>
                </Select>
        </>
      }

      const renderCheckBoxField = (field)=>{
        return<div className="">
         <div className="p-6 bg-white rounded-lg   mt-3">
        <h2 className="text-md  mb-4">{field.label}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {field.options?.map((option) => (
            <div key={option} className="flex items-center space-x-1 ">
              <Checkbox
                id={option}
                // checked={selectedProblems.includes(problem)}
                checked={formData[field.fieldId].includes(option)}
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
      </div>
      }
    
      const renderRadioButtonField = (fieldData) => {
        return (
          <>
            <div>
            <Label>{fieldData.label}</Label>
            <RadioGroup
              value={formData[fieldData.fieldId]}
              onValueChange={(value) => {
                handleChange(fieldData.fieldId, value);
              }}
            >
              {fieldData.options?.map((option,i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${fieldData.fieldId}-${option}`} />
                  <Label htmlFor={`${fieldData.fieldId}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            </div>
          </>
        );
      };

      const createIssue = async () => {
        setCreateIssueLoading(true);
      
        const formDataToAdd = {
          ...formData,
          formId: formId,
          issueTitle: formName,
          processArea: toCamelCase(processAreaName),
          mainIssue: toCamelCase(formName),
        };
      
        try {
          const response = await axios.post('/api/issues/addNewIssue', formDataToAdd);
          
          if (response.data.success) {
            toast({
              title: "Issue Created Successfully",
              description: response.data.message,
              variant: "default"
            });
            // Reset form fields or perform any other necessary actions
            // For example:
            // resetFormFields();
            // navigateToIssuePage(response.data.data.insertedId);
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: "Error", 
            description: axiosError.response?.data.message || "Error in creating issue",
            variant: "destructive",
          });
        } finally {
          setCreateIssueLoading(false);
        }
      };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-full justify-start" variant='outline'>{formName}</Button>
            </DialogTrigger>
            <DialogContent className="w-[97.5vw] h-[97.5vh] max-w-[100vw] z-[600]">
                <DialogHeader>
                    <DialogTitle>Your Selected Issue {formName}</DialogTitle>
                </DialogHeader>
                {error && (
                    <div className='flex justify-center items-center h-full'>
                        <h1>{error}</h1>
                    </div>
                )}
                {isLoading && (
                    <div className='flex justify-center items-center h-[100vh]'>
                        <LucideLoader2 className="animate-spin w-40 h-40" />
                    </div>
                )}
                {!isLoading && !error && formMetaData && (
                    <Fragment>
                    <div className='max-h-[550px]  overflow-y-scroll shadow-md p-1 grid grid-cols-2'>
                        {formMetaData.fields.map((field, index) => {
                            if(field.type === "text"){

                                return <div className='grid grid-cols-1 gap-2' key={index}>
                                  {renderTextField(field)}
                                  {/* text */}
                                </div>
                              }
                              else if(field.type === "image"){
                                return renderImageField(field)
                              }
                              else if(field.type === "dropDown"){
                                return <div className='grid grid-cols-1 gap-2' key={index}>
                                  {renderDropDownField(field)}
                                  </div>
                              }
                              else if(field.type === "checkBox"){
                                return renderCheckBoxField(field)
                              }
                              else if(field.type === "radio"){
                                return renderRadioButtonField(field)
                              }
                        })}
                    </div>
                    <Button className='bg-accent' onClick={()=>createIssue()} disabled={createIssueLoading}>
                        {
                            createIssueLoading ?(
                                <div className='flex'>
                                    <Loader2 className='animate-spin'/>
                                    {"Please Wait"}
                                </div>
                            ):("Create Issue")
                        }
                    </Button>
                    </Fragment>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default AddNewIssueDialogue