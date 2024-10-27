import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Pencil } from 'lucide-react';
import IssueImageGallery from '../issueImageGallery';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { addIssueData, addIssueLogData } from '@/redux/features/issue-data';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


const CustomIssueForm = ({data}:any) => {
  const [formMetaData, setFormMetaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [formData, setFormData] = useState({...data});
  const [oldFormData, setOldFormData] = useState({...formData});
  const [currentValue,setCurrentValue] =useState("")
  const {issueData,issueLogData} =useSelector((state:RootState)=>state.issueData)
  const dispatch = useDispatch<AppDispatch>()
  const {toast} = useToast()
  const roleOfCurrentUser = localStorage.getItem("role")



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
        const indianTime = now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
        const dateString = now.toISOString();
        const issueDataToAdd = {
          _id:dateString,
          name:localStorage.getItem('name'),
          updateMade:msg,
          updatedAt:indianTime,
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

  const handleEdit = (field,label) => {
    setCurrentValue(currentValue)
  if(editMode[field]){
    console.log(`Updated ${label} from ${oldFormData[field]} to ${formData[field]}`)
    
    setOldFormData(prev => ({ ...prev, [field]: formData[field] }));
    updateIssueData(formData[field],field, `Updated ${label} from ${oldFormData[field]} to ${formData[field]}`)

  }
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setCurrentValue(value)
    // const oldValue = formData[field];
    setFormData(prev => ({ ...prev, [field]: value }));  
  };

const onUploadImage = (url,fieldName,title)=>{
  const newArr = formData[fieldName] || []
  setFormData(prev => ({ ...prev, [fieldName]: [...newArr,url] }));
  console.log(`One File Uploaded to ${title}`)
  // setLogs(`One File Uploaded to ${title}`)
  updateIssueData([...newArr,url],fieldName,`One File Uploaded to ${title}`)
}

const onDeleteImage = (index,fieldName,title)=>{        
  const newArr = formData[fieldName].filter((_, i) => i !== index)
  setFormData(prev => ({ ...prev, [fieldName]: [...newArr] }));
  console.log(`One File Deleted from ${title}`)
  // setLogs(`One File Deleted from ${title}`)
  updateIssueData([...newArr],fieldName,`One File Deleted from ${title}`)
}


const handleCheckboxChange = (data,field) => {
  if(roleOfCurrentUser === "admin" || roleOfCurrentUser === "control room"){
    setFormData((prev) => {
      console.log("Old Data: ",prev[field.fieldId].toString())
      const updatedCheckBox = prev[field.fieldId].includes(data)
        ? prev[field.fieldId].filter((p) => p !== data)
        : [...prev[field.fieldId], data];
      console.log("New Data: ",updatedCheckBox.toString())
      updateIssueData(updatedCheckBox,"problems",`Updated ${field.label} from ${prev[field.fieldId].toString()} to ${updatedCheckBox.toString()}`)
  
    
      return { ...prev, [field.fieldId]: updatedCheckBox };
    });

  }
};

  const renderTextField = (fieldData) => { 
    
      return <div className=''>
      <div className="mb-4 ">
      <Label>{fieldData.label}</Label>
      <div className="flex items-center">
        {editMode[fieldData.fieldId] ? (
          <>
          {(roleOfCurrentUser=== "admin" || roleOfCurrentUser === "control room")&&(
            <>
            <Input
              type={fieldData.type}
              value={formData[fieldData.fieldId]}
              onChange={(e) => handleChange(fieldData.fieldId, e.target.value)}
              placeholder={`Enter ${fieldData.label}`}
              className="mr-2"
            />
            <Button size="icon" onClick={() => handleEdit(fieldData.fieldId, fieldData.label)}>
              <Check className="h-4 w-4" />
            </Button>
            </>
          )
        }
        {(roleOfCurrentUser=== "tripsheet" && fieldData.fieldId ==="utr_cmsNo")&&(
          <>
          <Input
            type={fieldData.type}
            value={formData[fieldData.fieldId]}
            onChange={(e) => handleChange(fieldData.fieldId, e.target.value)}
            placeholder={`Enter ${fieldData.label}`}
            className="mr-2"
          />
          <Button size="icon" onClick={() => handleEdit(fieldData.fieldId, fieldData.label)}>
            <Check className="h-4 w-4" />
          </Button>
          </>
        )}
            
          </>
        ) : (
          <>
            <span className="flex-grow border h-9 ml-1 rounded-md cursor-text w-1/2 overflow-hidden pt-1 pl-1 text-[15px]">{formData[fieldData.fieldId]}</span>
            {
              (roleOfCurrentUser=== "admin" || roleOfCurrentUser === "control room")&&<Button size="icon" variant="ghost" onClick={() => handleEdit(fieldData.fieldId,"")}>
              <Pencil className="h-4 w-4" />
            </Button>
            }
            {
              (roleOfCurrentUser==="tripsheet" && fieldData.fieldId ==="utr_cmsNo" )&&<Button size="icon" variant="ghost" onClick={() => handleEdit(fieldData.fieldId,"")}>
              <Pencil className="h-4 w-4" />
            </Button>
            }
            
          </>
        )}
      </div>
    </div>
    </div>
   
    
  };

  const renderImageField = (fieldData)=>{
    return <IssueImageGallery images={formData[fieldData.fieldId]} title={fieldData.label} onUpload={onUploadImage} onDelete={onDeleteImage} fieldName={fieldData.fieldId}/>
  }

  const renderDropDownField = (fieldData)=>{
    return<>
    {
      (roleOfCurrentUser=== "admin" || roleOfCurrentUser === "control room")&&(
        <>
           <Label>{fieldData.label}</Label>
            <Select
              value={formData[fieldData.fieldId]}
              onValueChange={(value) => {handleChange(fieldData.fieldId, value);
                console.log(`Update ${fieldData.label} from ${oldFormData[fieldData.fieldId]} to ${value}`);
                updateIssueData(value,fieldData.fieldId,`Update ${fieldData.label} from ${oldFormData[fieldData.fieldId]} to ${value}`)
                setOldFormData(prev => ({ ...prev, [fieldData.fieldId]: value }));
              }}
              
            >
              <SelectTrigger className=''>
                <SelectValue>{formData[fieldData.fieldId]}</SelectValue>
              </SelectTrigger>
              <SelectContent >
                {
                  fieldData.options?.map((e,i)=>(
                    <SelectItem value={e} key={i} >{e}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select> <Label>{fieldData.label}</Label>
            <Select
              value={formData[fieldData.fieldId]}
              onValueChange={(value) => {handleChange(fieldData.fieldId, value);
                console.log(`Update ${fieldData.label} from ${oldFormData[fieldData.fieldId]} to ${value}`);
                updateIssueData(value,fieldData.fieldId,`Update ${fieldData.label} from ${oldFormData[fieldData.fieldId]} to ${value}`)
                setOldFormData(prev => ({ ...prev, [fieldData.fieldId]: value }));
              }}
              
            >
              <SelectTrigger className=''>
                <SelectValue>{formData[fieldData.fieldId]}</SelectValue>
              </SelectTrigger>
              <SelectContent >
                {
                  fieldData.options?.map((e,i)=>(
                    <SelectItem value={e} key={i}>{e}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
        </>
      )
    }
     {
      (roleOfCurrentUser !== "admin" && roleOfCurrentUser !== "control room")&&(
        <span className="flex-grow border h-9 ml-1 rounded-md cursor-text w-1/2 overflow-hidden pt-1 pl-1 text-[15px]">{formData[fieldData.fieldId]}</span>
      )
     }
           
    </>
  }

  const renderCheckBoxField = (field)=>{
    return<div className="">
     <div className="p-6 bg-white rounded-lg   mt-3">
    <h2 className="text-md  mb-4">{field.label}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
      {field.options?.map((option,i) => (
        <div key={i} className="flex items-center space-x-1 ">
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
        <Label>{fieldData.label}</Label>
        <RadioGroup
          value={formData[fieldData.fieldId]}
          onValueChange={(value) => {
            if(roleOfCurrentUser === "admin" || roleOfCurrentUser === "control room"){
              handleChange(fieldData.fieldId, value);
              console.log(`Update ${fieldData.label} from ${oldFormData[fieldData.fieldId]} to ${value}`);
              updateIssueData(value, fieldData.fieldId, `Update ${fieldData.label} from ${oldFormData[fieldData.fieldId]} to ${value}`);
              setOldFormData(prev => ({ ...prev, [fieldData.fieldId]: value }));
            }
          }}
        >
          {fieldData.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${fieldData.fieldId}-${option}`} />
              <Label htmlFor={`${fieldData.fieldId}-${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </>
    );
  };

  useEffect(() => {
    async function fetchIssueFormMetaData() {
      try {
        setIsLoading(true);
        const response = await axios(`/api/issues/getIssueFormMetaData?formId=${data.formId}`);
        console.log(response.data.data)
        setFormMetaData(response.data.data);
        console.log(formMetaData)
        setError(null);
      } catch (err) {
        console.error("Error fetching form metadata:", err);
        setError("Failed to load form data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchIssueFormMetaData();
    console.log("formData: ",formData["problems"])
  }, [data.formId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className=''>
      {formMetaData.fields?.map((field, index) => {
        if(field.type === "text"){
          return <div className='grid grid-cols-1 gap-2' key={index}>
            {renderTextField(field)}
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
        <Toaster/>
    </div>
  );
};

export default CustomIssueForm;