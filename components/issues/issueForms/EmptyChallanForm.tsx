'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Check } from "lucide-react";
import IssueImageGallery from '../issueImageGallery';
import { addIssueData, addIssueLogData, IssueData } from '@/redux/features/issue-data';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { Toaster } from '../../ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface IEmptyChallanData{
    _id: string
    issueTitle: string
    mainIssue:string
    assignedTo: string
    relatedTo: string
    issueStatus: string
    problemStatus: string
    description:string

    branch:string
    from:string
    to:string
    fromLoaded:string
    toLoaded:string
    bookingAmount:number
    reason:string
    challanNumber:string
    instructionGivenBy:string
}

interface IEmptyChallanForm{
  data:IEmptyChallanData
}


const ShortAdvanceForm:React.FC<IEmptyChallanForm> = ({data}) => {
    const [formData, setFormData] = useState({
        description: data?.description,
        issueTitle:data?.issueTitle,
        assignedTo:data?.assignedTo,
        relatedTo: data?.relatedTo,
        issueStatus: data?.issueStatus,
        problemStatus: data?.problemStatus,
        branch:data?.branch,
        from:data?.from,
        to:data?.to,
        fromLoaded:data?.fromLoaded,
        toLoaded:data?.toLoaded,
        bookingAmount:data?.bookingAmount,
        reason:data?.reason,
        challanNumber:data?.challanNumber,
        instructionGivenBy:data?.instructionGivenBy,
      });
      const [oldFormData,setOldFormData] = useState({...formData})
      const [logs, setLogs] = useState("");
      const [currentValue, setCurrentValue]= useState("")
      const [oldValue, setOldValue]= useState("")
      const dispatch = useDispatch<AppDispatch>()
      const {issueLogData,issueData} = useSelector((state:RootState)=>state.issueData)
      const {toast} = useToast()

      const updateIssueData = async( newValue:string|string[], fieldName:string, msg:string) => {

        try {
          const response = await fetch('/api/issues/updateIssueData', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id:data?._id,
              nameOfUpdater:localStorage.getItem("name"),
              newValue:newValue,
              fieldname:fieldName,
              logMsg:msg
            }),
          });
    
          if (response.ok) {
            const newIssueData = issueData.map((e)=>{
              if(e._id === data?._id){
                return {
                  ...e,
                  [fieldName]:newValue,
                }
              }
              else{
                return e
              }
            })
            console.log(newIssueData)
            dispatch(addIssueData(newIssueData))

            const now = new Date();
            const dateString = now.toISOString();
            const issueDataToAdd = {
              _id:dateString,
              name:localStorage.getItem('name'),
              updateMade:msg,
              updatedAt:dateString,
              issueId:data?._id,
            }
            dispatch(addIssueLogData([...issueLogData,issueDataToAdd]))
            const dataGot = await response.json();
            toast({
              title:dataGot.message,
              description:msg
            })
          }
        } catch (error) {
          console.log(error)
          toast({
            title:error,
            variant:"destructive"
          })
        }

        
      };
    
      const [editMode, setEditMode] = useState({});
    
      const handleEdit = (field,label) => {
        setCurrentValue(currentValue)
        setOldValue(formData[field])
      if(editMode[field]){
        console.log(`Updated ${label} from ${oldFormData[field]} to ${formData[field]}`)
        setLogs(`Updated ${label} from ${oldFormData[field]} to ${formData[field]}`)
        
        updateIssueData(formData[field],field, `Updated ${label} from ${oldFormData[field]} to ${formData[field]}`)
        setOldFormData(prev => ({ ...prev, [field]: formData[field] }));
      }
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
      };
    
      const handleChange = (field, value) => {
        setCurrentValue(value)
        // const oldValue = formData[field];
        setFormData(prev => ({ ...prev, [field]: value }));
        
        
    };

      const onUploadImage = (url,fieldName,title)=>{
        const newArr = formData[fieldName]
        setFormData(prev => ({ ...prev, [fieldName]: [...newArr,url] }));
        console.log(`One File Uploaded to ${title}`)
        setLogs(`One File Uploaded to ${title}`)
        updateIssueData([...newArr,url],fieldName,`One File Uploaded to ${title}`)
      }
      
      const onDeleteImage = (index,fieldName,title)=>{        
        const newArr = formData[fieldName].filter((_, i) => i !== index)
        setFormData(prev => ({ ...prev, [fieldName]: [...newArr] }));
        console.log(`One File Deleted from ${title}`)
        setLogs(`One File Deleted from ${title}`)
        updateIssueData([...newArr],fieldName,`One File Deleted from ${title}`)
      }



      const renderField = (label, field, type = 'text') => (
        <div className="mb-4">
          <Label>{label}</Label>
          <div className="flex items-center">
            {editMode[field] ? (
              <>
                <Input
                  type={type}
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="mr-2"
                />
                <Button size="icon" onClick={() => handleEdit(field, label)}>
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-grow border h-9 ml-1 rounded-md cursor-text w-1/2 overflow-hidden pt-1 pl-1 text-[15px]">{formData[field]}</span>
                <Button size="icon" variant="ghost" onClick={() => handleEdit(field,"")}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      );

      useEffect(()=>{
        console.log(data)
      },[])
  return (
    <>
         <Card className="w-full max-w-2xl ">
      <CardHeader>
        <CardTitle>Issue Details</CardTitle>
      </CardHeader>
      <CardContent>
        {renderField('Description', 'description')}
        {renderField('Issue', 'issueTitle')}
   
        <div className="grid grid-cols-2 gap-4">
          {renderField('Assigned To', 'assignedTo')}
          {renderField('Related To', 'relatedTo')}

          {renderField('Current Status', 'issueStatus')}
          {renderField('Problem Status', 'problemStatus')}

          {renderField('Branch', 'branch')}
          {renderField('From', 'from')}
          
          {renderField('To', 'to')}
          {renderField('From (Loaded)', 'fromLoaded')}
        

          {renderField('To (Loaded)', 'consignmentLoad')}
          {renderField('Booking Amount', 'bookingAmount')}

          {renderField('Reason', 'reason')}
          {renderField('Challan Number', 'challanNumber')}

          {renderField('Instruction Given By', 'instructionGivenBy')}
          </div>

          
            


          

           


          

         



        
        
      </CardContent>
    </Card>
    <Toaster/>
    </>
  )
}

export default ShortAdvanceForm
