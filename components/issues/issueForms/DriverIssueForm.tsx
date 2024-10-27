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

interface IDriverIssueData{



  
    _id: string
    issueTitle: string
    mainIssue:string
    assignedTo: string
    relatedTo: string
    issueStatus: string
    problemStatus: string
    description:string
    noOfTimesOpen:string
    vehicleNumber:string
    vehicleStatusBot:string
    driverMobileNumber:string
    issueType:string
    problemIs:string
    proofLink:string
    locationBot:string
    issueLocation:string
    problemProof:string[]
    currentStatus:string
    problems:string[]
    workPlace:string
    estimate:string[]
    amountPaidBy:string
    partCost:number
    labourCost:number
    invoicePic:string[]
    total:number
    taxInvoice:string
    utr_cmsNo:string
    tripSheetNumber:string
    approvalProof:string[]
    location:string
}

interface IDriverIssueForm{
  data:IDriverIssueData
}

const carProblems = [
  "Starting Issue", "Accident", "Battery", "Gear", "Clutch", "Oil Issue", "Brake",
  "Sapat", "Altinator", "Pump Nozel", "Kamani", "Wiring", "Light",
  "Heating", "Air", "Centre Bolt", "Grease", "Engine", "Self", "Advance",
  "Audit", "Servicing", "Other"
];

const DriverIssueForm:React.FC<IDriverIssueForm> = ({data}) => {
    const [formData, setFormData] = useState({
        description: data?.description,
        issueTitle:data?.issueTitle,
        assignedTo:data?.assignedTo,
        relatedTo: data?.relatedTo,
        issueStatus: data?.issueStatus,
        problemStatus: data?.problemStatus,
        noOfTimesOpen:data?.noOfTimesOpen,//Select
        vehicleNumber:data?.vehicleNumber,
        vehicleStatusBot:data?.vehicleStatusBot,
        driverMobileNumber:data?.driverMobileNumber,
        issueType: data?.issueType ,
        problemIs: data?.problemIs|| "" ,
        proofLink:data?.proofLink,
        locationBot: data?.locationBot,
        issueLocation: data?.issueLocation,
        problemProof: data?.problemProof,//Array
        currentStatus:data?.currentStatus,//Select
        problems: data?.problems,//Array
        workPlace: data?.workPlace,
        estimate: data?.estimate,//Array
        amountPaidBy: data?.amountPaidBy,//Select
        partCost:data?.partCost,
        labourCost:data?.labourCost,
        invoicePic: data?.invoicePic,//Array
        total:data?.total,
        taxInvoice: data?.taxInvoice,//Select
        utr_cmsNo: data?.utr_cmsNo,
        tripSheetNumber: data?.tripSheetNumber,
        approvalProof:data?.approvalProof,
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

      const handleCheckboxChange = (problem) => {
        setFormData((prev) => {
          console.log("Old Problems: ",prev.problems.toString())
          const updatedProblems = prev.problems.includes(problem)
            ? prev.problems.filter((p) => p !== problem)
            : [...prev.problems, problem];
          console.log("New Problems: ",updatedProblems.toString())

          updateIssueData(updatedProblems,"problems",`Updated Problems from ${prev.problems.toString()} to ${updatedProblems.toString()}`)
          return { ...prev, problems: updatedProblems };
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

          {renderField('No of Times Open', 'noOfTimesOpen')}
          {renderField('Vehicle Number', 'vehicleNumber')}

          {renderField('Vehicle Status Bot', 'vehicleStatusBot')}
          {renderField('Driver Mobile Number', 'driverMobileNumber')}

          {renderField('Issue Type', 'issueType')}
          {renderField('Problem Is', 'problemIs')}

          {renderField('Proof Link', 'proofLink')}
          {renderField('Location Bot', 'locationBot')}

          {renderField('Location', 'issueLocation')}

          <IssueImageGallery images={formData?.problemProof} title='Problem Proof 1' onUpload={onUploadImage} onDelete={onDeleteImage} fieldName='problemProof' />

          <div className="mb-4">
            <Label>Current Status</Label>
            <Select
              value={formData.currentStatus}
              onValueChange={(value) => {handleChange('currentStatus', value);
                console.log(`Update Current Status from ${oldFormData["currentStatus"]} to ${value}`);
                setLogs(`Update Current Status from ${oldFormData["currentStatus"]} to ${value}`)
                updateIssueData(value,"currentStatus",`Update Current Status from ${oldFormData["currentStatus"]} to ${value}`)
                setOldFormData(prev => ({ ...prev, ["currentStatus"]: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue>{formData.currentStatus}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNATTENDED">UNATTENDED</SelectItem>
                <SelectItem value="WAIT FOR APPROVAL">WAIT FOR APPROVAL</SelectItem>
                <SelectItem value="WIP">WIP</SelectItem>
                <SelectItem value="PAYMENT PENDING">PAYMENT PENDING</SelectItem>
                <SelectItem value="ONWAY DOCUMENTATION PENDING">ONWAY DOCUMENTATION PENDING</SelectItem>
                <SelectItem value="ONWAY PAYMENT PENDING">ONWAY PAYMENT PENDING</SelectItem>
              </SelectContent>
            </Select>
          </div>
          </div>

          
            <div className="p-6 bg-white rounded-lg ">
              <h2 className="text-md  mb-4">Problem</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {carProblems.map((problem) => (
                  <div key={problem} className="flex items-center space-x-2">
                    <Checkbox
                      id={problem}
                      // checked={selectedProblems.includes(problem)}
                      checked={formData.problems.includes(problem)}
                      onCheckedChange={() => handleCheckboxChange(problem)}
                    />
                    <label
                      htmlFor={problem}
                      className="text-[10px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {problem}
                    </label>
                  </div>
                ))}
              </div>
              
            </div>

            <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <Label>Amount Paid By</Label>
            <Select
              value={formData.amountPaidBy}
              onValueChange={(value) => {handleChange('amountPaidBy', value);
                console.log(`Update Amount Paid By from ${oldFormData["amountPaidBy"]} to ${value}`);
                setLogs(`Update Amount Paid By from ${oldFormData["amountPaidBy"]} to ${value}`)
                updateIssueData(value,"amountPaidBy",`Update Amount Paid By from ${oldFormData["amountPaidBy"]} to ${value}`)
                setOldFormData(prev => ({ ...prev, ["amountPaidBy"]: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue>{formData.amountPaidBy}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No Payment">No Payment</SelectItem>
                <SelectItem value="Control Room Tripsheet">Control Room Tripsheet</SelectItem>
                <SelectItem value="Control Room IMPS">Control Room IMPS</SelectItem>
                <SelectItem value="Driver">Driver</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderField('Part Cost', 'partCost')}

          {renderField('Labour Cost', 'labourCost')}
          {renderField('Total', 'total')}

          <IssueImageGallery images={formData?.invoicePic} title='Invoice Pic' onUpload={onUploadImage} onDelete={onDeleteImage} fieldName='invoicePic' />

          <div className="mb-4">
            <Label>Tax Invoice?</Label>
            <Select
              value={formData.taxInvoice}
              onValueChange={(value) => {handleChange('taxInvoice', value);
                console.log(`Update Tax Invoice? from ${oldFormData["taxInvoice"]} to ${value}`);
                setLogs(`Update Tax Invoice? from ${oldFormData["taxInvoice"]} to ${value}`)
                updateIssueData(value,"taxInvoice",`Update Tax Invoice? from ${oldFormData["taxInvoice"]} to ${value}`)
                setOldFormData(prev => ({ ...prev, ["taxInvoice"]: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue>{formData.taxInvoice}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
            </div>
        </div>


        {renderField('UTR/CMS No.', 'utr_cmsNo')}

        <div className='grid grid-cols-2 gap4'>
          {renderField("Tripsheet Number", "tripSheetNumber")}

          <IssueImageGallery images={formData?.approvalProof} title='Approval Proof' onUpload={onUploadImage} onDelete={onDeleteImage} fieldName='approvalProof' />

        </div>
        
      </CardContent>
    </Card>
    <Toaster/>
    </>
  )
}

export default DriverIssueForm
