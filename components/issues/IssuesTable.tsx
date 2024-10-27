"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import IssuePopUp from './IssuePopUp'
import { Loader2, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { fetchIssueData } from '@/redux/features/issue-data'
import Loader from '../loaders/Loader'

interface chat{
  _id:string,
  message:string
  senderName:string
  senderId:string 
  documentUrl:string
  createdAt:string
}

interface Issue {
  _id: string;
  issueTitle?: string;
  [key: string]: any; // This allows for any additional properties
}





const IssueTable:React.FC<{issues:Issue[]}> =({issues}) =>{
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const[selectedIssueId,setSelectedIssueId] = useState<string>();
  const dispatch = useDispatch<AppDispatch>();
  const {issueData,issueDataStatus,issueDataError} = useSelector((state:RootState)=>state.issueData)

  const openDialog = (issue: Issue) => {
    setSelectedIssue(issue)
    setSelectedIssueId(issue?._id)
  }

  const closeDialog = () => {
    setSelectedIssue(null)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'todo':
        return 'bg-yellow-200 text-yellow-800';
      case 'in review':
        return 'bg-purple-200 text-purple-800';
      case 'in progress':
        return 'bg-blue-200 text-blue-800';
      case 'done':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getProblemStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'high':
        return 'bg-orange-500 text-white';
      case 'critical':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  useEffect(()=>{
    if(issueDataStatus === 'idle'){
      dispatch(fetchIssueData())
    }
  },[dispatch])

  if(issueDataStatus === 'loading'){
    return <>
    <div className='flex justify-center items-center h-[50vh] w-[100%]'>
    <Loader/>
    </div>
    </>
  }
  if(issueDataError){
    return<>
    <div>{issueDataError}</div>
    </>
  }

  return (
    <div className="mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Issue No</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Related To</TableHead>
            <TableHead>Current Status</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue,i) => (
            <TableRow key={issue._id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDialog(issue)}>
              <TableCell className="font-medium">{i+1}</TableCell>
              <TableCell>{issue.issueTitle}</TableCell>
              <TableCell>{issue.assignedTo}</TableCell>
              <TableCell>{issue.relatedTo}</TableCell>
              <TableCell>{issue.issueStatus}</TableCell>
              <TableCell>{issue.problemStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <IssuePopUp Issue={selectedIssue} closeDialog={closeDialog} selectedIssueId={selectedIssueId}/>

    </div>
  )
}

export default  IssueTable;