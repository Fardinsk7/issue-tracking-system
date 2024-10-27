"use client"
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useRef } from "react";
import { fetchIssueLogData } from "@/redux/features/issue-data";
import { Loader2 } from "lucide-react";
import { formatDateTime } from "@/helper/helper";

interface IssueLogAreaProps{
    issueTitle:string;
    issueId:string
}

const IssueLogArea: React.FC<IssueLogAreaProps> = ({ issueTitle, issueId}) => {
  const {issueLogDataStatus,issueLogData, issueLogDataError} = useSelector((state:RootState)=>state.issueData)  
  const { value } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const  scrollRef = useRef<HTMLDivElement>()
   
  const scrollToBottomOfLog = ()=>{
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  
  useEffect(() => {
    dispatch(fetchIssueLogData(issueId));
    console.log(issueId)
  }, [issueId, dispatch]);

  useEffect(()=>{
    scrollToBottomOfLog()
  },[issueLogData])

   if(issueLogDataStatus === "loading"){
    return (
      <>
      <div className=" h-[300px] flex justify-center items-center">
        <Loader2 className="animate-spin"/>
      </div>
      </>
    )
   }
   else if(issueLogDataStatus === "failed"){
    return (
      <>
      <div className=" h-[300px] flex justify-center items-center">
        <h1>Error: {issueLogDataError} Hello</h1>
      </div>
      </>
    )
   }
  
    return (
        <>
      
        <ScrollArea>

        {
          issueLogData.map((logs)=>{
            return <>
            <div className="text-[12px] pl-2 my-1 flex flex-row justify-between items-end ">

            <span className="text-[12px] bg-gray-100 p-1 border border-gray rounded-md w-1/2 "><span className="font-bold">{logs.name === localStorage.getItem('name')?"You":logs.name} </span>{logs.updateMade}</span>
            <span className="text-[10px] ">{formatDateTime(logs.updatedAt)}</span>
            </div>
            </>
          })
        }
        <div ref={scrollRef}/>
        </ScrollArea>
       
    </>
    );
  };
  
  export default IssueLogArea;