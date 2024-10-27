"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { User } from "lucide-react";
import IssueChatArea from "./issueChatArea";
import { useEffect, useState } from "react";
import IssueLogArea from "./issueLogs";
import { getStatusColor, getProblemStatusColor } from "@/helper/helper";
import BatteryIssueForm from "./issueForms/BatteryIssueForm";
import { ScrollArea } from "../ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DriverIssueForm from "./issueForms/DriverIssueForm";
import ShortAdvanceForm from "./issueForms/ShortAdvanceForm";
import EmptyChallan from "./issueForms/EmptyChallanForm";
import EmptyChallanForm from "./issueForms/EmptyChallanForm";
import CustomIssueForm from "./issueForms/CustomIssueForm";

const IssuePopUp = ({ Issue, closeDialog, selectedIssueId }) => {
  const [selectedArea, setSelectedArea] = useState(true)
  const{issueData} = useSelector((state:RootState)=>state.issueData)
  const selectedIssue = issueData.find((e)=>e._id === selectedIssueId)
  
 
  return (
    <div>
      <Dialog open={Issue !== null} onOpenChange={closeDialog}>

        <DialogContent className="md:max-w-[80%] md:h-[92%] md:ml-8 h-[80%] flex flex-col">
          <DialogHeader className=''>
            <DialogTitle>#. {selectedIssue?.issueTitle}</DialogTitle>
            <DialogDescription>Issue Id: {selectedIssue?._id}</DialogDescription>
          </DialogHeader>
          <div className='w-[100%] h-[100%] border border-gray-300 rounded-xl flex flex-row'>
            <div className='w-[50%] md:h-[40%] h-[50%]  '>
              <div className='w-[100%] h-[100%]'>
                <div className="flex mb-4">
                  <div className="w-1/2 pr-2">
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 ">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {selectedIssue?.assignedTo ? (
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white text-lg font-semibold hidden sm:inline-flex">
                              {selectedIssue.assignedTo.charAt(0)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-500">
                              <User size={20} />
                            </span>
                          )}
                        </div>
                        <div className="flex-grow ">
                          <p className="text-[10px] font-medium text-gray-500 uppercase">Assigned To</p>
                          <p className="text-sm font-semibold text-gray-800">{selectedIssue?.assignedTo || "Unassigned"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2 pl-2">
                    <div className="g-white p-4 rounded-lg shadow-md border border-gray-200">
                      <div className="flex-grow">
                        <p className="text-[10px] font-medium text-gray-500 uppercase">Related To</p>
                        <p className="text-sm font-semibold text-gray-800">{selectedIssue?.relatedTo || "Unassigned"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex mb-4 shadow-md border border-gray-100 rounded-sm'>
                  <div className="w-1/2 pl-3 flex justify-start items-center">
                    <div className="text-sm font-medium text-gray-600">Current Status:</div>
                  </div>
                  <div className="w-1/2 pl-2">
                    <div className="bg-white p-2 rounded"> <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(selectedIssue?.issueStatus)}`}>
                      {selectedIssue?.issueStatus}
                    </span></div>
                  </div>
                </div>
                <div className='flex shadow-md border border-gray-100 rounded-lg overflow-hidden'>
                  <div className="w-1/2 bg-gray-50 p-3">
                    <p className="text-sm font-medium text-gray-600">Problem Status:</p>
                  </div>
                  <div className="w-1/2 bg-white p-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getProblemStatusColor(selectedIssue?.problemStatus)}`}>
                      {selectedIssue?.problemStatus}
                    </span>
                  </div>
                </div>
              </div>
              <ScrollArea className=" h-[250px] max-w-[100%]  ">
              {/* {selectedIssue?.mainIssue === "batteryIssue" && <CustomIssueForm data={selectedIssue}/>} */}
              {/* {selectedIssue?.mainIssue === "driverIssue" && <DriverIssueForm data={selectedIssue}/> } */}
              {/* {selectedIssue?.mainIssue === "shortAdvance" && <CustomIssueForm data={selectedIssue}/> } */}
              {/* {selectedIssue?.mainIssue === "empty challan" && <EmptyChallanForm data={selectedIssue}/> } */}
              {/* {selectedIssue?.mainIssue === "driverIssue" &&  } */}
              <CustomIssueForm data={selectedIssue}/>
              </ScrollArea>

            </div>

            <div className='w-[50%] h-[100%] border rounded-xl'>
              {/* { issueTitle, messages, currentUserId } */}
              <div className="flex flex-col sm:h-[520px] h-[600px]  overflow-hidden relative">
              {/* <div className="bg-gray-100 p-4 border-b">
                <h2 className="text-lg font-semibold">{selectedIssue?.issueTitle}</h2>
              </div> */}
              <div className=" flex flex-row">
                  <div className={`w-1/2 border  text-center p-1 cursor-pointer text-gray-400 font-bold   ${selectedArea?" border-b-4 border-b-orange-300  text-gray-950":""}`}  onClick={()=>setSelectedArea(!selectedArea)}>Activity Logs</div>
                  <div className={`w-1/2 border  text-center p-1 cursor-pointer text-gray-400 font-bold  ${!selectedArea?" border-b-4 border-b-orange-300  text-gray-950":""}`} onClick={()=>setSelectedArea(!selectedArea)}>Chat Area</div>
              </div>
              {
                selectedArea ?(
                  <IssueLogArea issueTitle={selectedIssue?.issueTitle} issueId = {selectedIssue?._id} />
                ):(
                  <IssueChatArea issueTitle={selectedIssue?.issueTitle} messages={selectedIssue?.chats} currentUserId={selectedIssue?._id} issueId={selectedIssue?._id} />

                )
              }
            
            </div>
            </div>
          </div>
          {/* <DialogFooter>
            <Button className='w-[100%] bg-orange-300 hover:bg-orange-200' onClick={() => { console.log(selectedIssue) }}>Close</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IssuePopUp
