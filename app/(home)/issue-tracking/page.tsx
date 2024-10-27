"use client"
import React, { useEffect, useState } from 'react'

import IssuesHeader from '@/components/issues/IssuesHeader'
import IssueTable from '@/components/issues/IssuesTable'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchIssueData } from '@/redux/features/issue-data';

function IssueTracking() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const {issueDataStatus,issueData} = useSelector((state:RootState)=>state.issueData)

  const handleSearch = (searchTerm) => {
    const filtered = issueData.filter(issue =>{
      if(issue.issueTitle){
        return issue?.issueTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      }
    });
    setFilteredIssues(filtered);
  };

  useEffect(()=>{
    if(issueDataStatus === 'idle'){
      dispatch(fetchIssueData())
    }
    setFilteredIssues(issueData)
  },[dispatch])
  useEffect(() => {
    setFilteredIssues(issueData);
  }, [issueData]);
  return (
    <div>
      <IssuesHeader onSearch={handleSearch}/>
      <IssueTable issues={filteredIssues}/>
    </div>
  )
}

export default IssueTracking