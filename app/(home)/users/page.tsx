"use client"
import { fetchUsersData } from '@/redux/features/usersDataSlice'
import { AppDispatch, RootState, useAppSelector } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Loading from '../loading'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import RadioEditPopUp from '@/components/RadioEditPopUp'

const Users = () => {
  const {usersData, usersDataStatus, usersDataError} = useAppSelector((state:RootState)=>state.usersData)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=>{
    if(usersDataStatus === "idle"){
      dispatch(fetchUsersData())
    }
  },[usersDataStatus,dispatch])
  return (
    <div>
     <div className='text-xl font-bold'>Users Data:</div>  
      {
        usersDataStatus === "loading" && <Loading/>
      }
      {
        usersDataStatus === "failed" && usersDataError && (
          <div className='flex justify-center items-center'>
            Error:{usersDataError}
          </div>
        )
      }
      {usersDataStatus === "success" &&
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact No</TableHead>
              <TableHead className='text-center'>Role</TableHead>
              <TableHead className='text-center'>User Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              usersData.map((user,i)=>{
                return <TableRow key={i}>
                  <TableCell>{i+1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <span className='flex flex-col justify-center items-center'>
                    {user.role === undefined?"NA":user.role}
                    <RadioEditPopUp 
                    id={user._id}
                    title='role' 
                    dataArr={["admin","gaadi malik","vehicle audit","tripsheet","control room","vehicle erop","vehicle document","branch"]} 
                     defaultData={user.role === undefined?"NA":user.role} 
                    fieldToUpdate='role'
                    />
                    </span>
                  </TableCell>
                  <TableCell>
                  <span className='flex flex-col justify-center items-center'>
                    {user.userVerificationStatus === undefined?"NA":user.userVerificationStatus}
                    <RadioEditPopUp 
                    id={user._id}
                    title='User Status' 
                    dataArr={["approve","pending","reject"]}  
                    defaultData={user.userVerificationStatus === undefined?"NA":user.userVerificationStatus} fieldToUpdate='userVerificationStatus'
                    />
                    </span>
                    </TableCell>
                </TableRow>
              })
            }
          </TableBody>
        </Table>
      }

    </div>
  )
}

export default Users
