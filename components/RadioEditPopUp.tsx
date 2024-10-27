import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ApiResponse } from "./issues/CustomIssueType";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { addUsersData } from "@/redux/features/usersDataSlice";
import { Toaster } from "./ui/toaster";


interface RadioEditPopUpProps{
    id:string;
    title:string;
    dataArr: string[];
    defaultData:string;
    fieldToUpdate:string;
}

const RadioEditPopUp:React.FC<RadioEditPopUpProps>=({id,title,dataArr,defaultData,fieldToUpdate})=> {
    const [currentValue,setCurrentValue] = useState(defaultData)
    const oldData = defaultData;
    const [loading,setLoading] = useState<boolean>(false)
    const {toast} = useToast()
    const dispatch = useDispatch<AppDispatch>()
    const{usersData} = useAppSelector((state:RootState)=>state.usersData)

    const handleSave = async()=>{
        if(oldData === currentValue || !currentValue){
            return
        }
        setLoading(true)
        try {
            const res = await axios.post(`/api/users/updateData`,{id,fieldToUpdate,newData:currentValue})
            if(res.data.success){
                const newUserData = usersData.map((e)=>{
                    if(e._id === id){
                        return {
                            ...e,
                            [fieldToUpdate]:currentValue

                        }
                    }
                    return e
                })
                dispatch(addUsersData(newUserData))
                toast({
                    title:"Success",
                    description:res.data.message
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title:"Error",
                description: axiosError.response?.data.message || "Error in update data",
                variant:"destructive",
            })
        }finally{
            setLoading(false)
        }
    }
  return (
    <>
    
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Change {title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {title.charAt(0).toUpperCase()+title.slice(1)}</DialogTitle>
          <DialogDescription>
            Make changes. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup defaultValue={defaultData}>
     
      {
        dataArr.map((e,i)=>{
            return <div  key={i} className="flex items-center space-x-2">
            <RadioGroupItem value={e} id={i.toString()} onClick={()=>setCurrentValue(e)} />
            <Label htmlFor="r1">{e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()}</Label>
          </div>
        })
      }
    </RadioGroup>
        <DialogFooter>
          <Button type="submit" onClick={()=>handleSave()} disabled={loading}>{
            loading?(
                <span className="flex">
                    <Loader2 className="animate-spin"/>Please Wait
                </span>
            ):("Save Changes")
            }</Button>
        </DialogFooter>
      </DialogContent>
      
    </Dialog>
    <Toaster/>
    </>
  )
}

export default RadioEditPopUp
