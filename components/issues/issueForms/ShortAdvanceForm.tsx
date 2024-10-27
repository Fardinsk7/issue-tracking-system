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

interface IShortAdvanceData{
    _id: string
    issueTitle: string
    mainIssue:string
    assignedTo: string
    relatedTo: string
    issueStatus: string
    problemStatus: string
    description:string
    branch:string
    tripKms:number
    route:string
    milage:string
    consignmentLoad:string
    rto:string
    normalEntryPerKm:string
    salary:number
    states:string[]
    dieselAmountTotal:number
    dieselAmountPerLtr:number
    total:number
    taken:number
    rest:number
    otherExpense:string
    advSlipNo:string
    modeOfPayment:string
    deductionCP:string
}

interface IShortAdvanceForm{
  data:IShortAdvanceData
}

const states = ["Maharashtra","Rajasthan","Madhya Pradesh","Karnataka","Telengana","Andhra Pradesh", "Bihar","Chattisgarh","Other"];

const ShortAdvanceForm:React.FC<IShortAdvanceForm> = ({data}) => {
    const [formData, setFormData] = useState({
        description: data?.description,
        issueTitle:data?.issueTitle,
        assignedTo:data?.assignedTo,
        relatedTo: data?.relatedTo,
        issueStatus: data?.issueStatus,
        problemStatus: data?.problemStatus,
        branch:data?.branch,
        tripKms:data?.tripKms,
        route:data?.route,
        milage:data?.milage,
        consignmentLoad:data?.consignmentLoad,
        rto:data?.rto,
        normalEntryPerKm:data?.normalEntryPerKm,
        salary:data?.salary,
        states:data?.states || [],
        dieselAmountTotal:data?.dieselAmountTotal,
        dieselAmountPerLtr:data?.dieselAmountPerLtr,
        total:data?.total,
        taken:data?.taken,
        rest:data?.rest,
        otherExpense:data?.otherExpense,
        advSlipNo:data?.advSlipNo,
        modeOfPayment:data?.modeOfPayment,
        deductionCp:data?.deductionCP
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

      const handleCheckboxChange = (state) => {
        setFormData((prev) => {
          const updatedStates = prev.states.includes(state)
            ? prev.states.filter((p) => p !== state)
            : [...prev.states, state];

          updateIssueData(updatedStates,"states",`Updated States from ${prev.states.toString()} to ${updatedStates.toString()}`)
          return { ...prev, states: updatedStates };
        });
      };

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
          {renderField('Trip Kms', 'tripKms')}
          
          {renderField('Route', 'route')}
          <div className="mb-4">
            <Label>Milage</Label>
            <Select
              value={formData.milage}
              onValueChange={(value) => {handleChange('milage', value);
                console.log(`Update Milage from ${oldFormData["milage"]} to ${value}`);
                setLogs(`Update Milage from ${oldFormData["milage"]} to ${value}`)
                updateIssueData(value,"milage",`Update Milage from ${oldFormData["milage"]} to ${value}`)
                setOldFormData(prev => ({ ...prev, ["milage"]: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue>{formData.milage}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4 km/ltr">4 km/ltr</SelectItem>
                <SelectItem value="3.5 km/ltr">3.5 km/ltr</SelectItem>
                <SelectItem value="3 km/ltr">3 km/ltr</SelectItem>
                <SelectItem value="2.5 km/ltr">2.5 km/ltr</SelectItem>
                <SelectItem value="2 km/ltr">2 km/ltr</SelectItem>
                <SelectItem value="1.5 km/ltr">1.5 km/ltr</SelectItem>
                <SelectItem value="2.25 km/ltr">2.25 km/ltr</SelectItem>
                <SelectItem value="1.8 km/ltr">1.8 km/ltr</SelectItem>
                <SelectItem value="1.9 km/ltr">1.9 km/ltr</SelectItem>
                <SelectItem value="1.7 km/ltr">1.7 km/ltr</SelectItem>
                <SelectItem value="5.5 km/ltr">5.5 km/ltr</SelectItem>
                <SelectItem value="3.75 km/ltr">3.75 km/ltr</SelectItem>
                
              </SelectContent>
            </Select>
          </div>

          {renderField('Consignment Load', 'consignmentLoad')}
          {renderField('RTO', 'rto')}

          {renderField('Normal Entry Per Km', 'normalEntryPerKm')}
          {renderField('Salary', 'salary')}

          </div>

          
            <div className="p-6 bg-white rounded-lg ">
              <h2 className="text-md  mb-4">States</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {states.map((state) => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={state}
                      // checked={selectedProblems.includes(problem)}
                      checked={formData.states.includes(state)}
                      onCheckedChange={() => handleCheckboxChange(state)}
                    />
                    <label
                      htmlFor={state}
                      className="text-[9px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {state}
                    </label>
                  </div>
                ))}
              </div>
              
            </div>

          <div className="grid grid-cols-2 gap-4">

            {renderField('Diesel Amount Total', 'dieselAmountTotal')}
            {renderField('Diesel Amount Per Ltr', 'dieselAmountPerLtr')}

            {renderField('Total', 'total')}
            {renderField('Taken', 'taken')}

            {renderField('Rest', 'rest')}
            {renderField('Other Expense', 'otherExpense')}

            {renderField('Adv Slip No', 'advSlipNo')}
            <div className="mb-4">
            <Label>Mode Of Payment</Label>
            <Select
              value={formData.modeOfPayment}
              onValueChange={(value) => {handleChange('modeOfPayment', value);
                console.log(`Update Milage from ${oldFormData["modeOfPayment"]} to ${value}`);
                setLogs(`Update Milage from ${oldFormData["modeOfPayment"]} to ${value}`)
                updateIssueData(value,"modeOfPayment",`Update Mode Of Payment from ${oldFormData["modeOfPayment"]} to ${value}`)
                setOldFormData(prev => ({ ...prev, ["modeOfPayment"]: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue>{formData.modeOfPayment}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank">Bank</SelectItem>
                <SelectItem value="Fuel Card">Fuel Card</SelectItem>               
              </SelectContent>
            </Select>
          </div>

            {renderField('Deduction CP', 'deductionCP')}
            
          
          </div>

          

           


          

         



        
        
      </CardContent>
    </Card>
    <Toaster/>
    </>
  )
}

export default ShortAdvanceForm
