import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from 'axios';

interface ProcessArea {
  id: string;
  name: string;
}

// const processAreas: ProcessArea[] = [
//   { id: "1", name: "Software Development" },
//   { id: "2", name: "Quality Assurance" },
//   { id: "3", name: "Project Management" },
//   { id: "4", name: "DevOps" },
//   { id: "5", name: "Customer Support" },
// ];
interface ProcessAreaInputProps{
  selectedArea:string,
  setSelectedArea:(v:string)=>void
}
const ProcessAreaInput: React.FC<ProcessAreaInputProps> = ({selectedArea,setSelectedArea}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [processAreas,setProcessAreas] =useState(null)

  const handleSelection = (value: string) => {
    setSelectedArea(value);
    setIsOpen(false);
  };

  useEffect(()=>{
    async function fetchProcessAreas() {
      try {
        const response = await axios(`/api/getAllProcessAreas`);
        console.log(response.data.data)
        setProcessAreas(response.data.data);
      } catch (err) {
        console.error("Error fetching form metadata:", err);
      } 
    }
    fetchProcessAreas();
  },[])

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Enter or select process area"
        value={selectedArea}
        onChange={(e) => setSelectedArea(e.target.value)}
        className="flex-grow"
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
        <Button className="bg-accent" onClick={() => setIsOpen(true)}>Existing Process Areas</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] z-[60]">
          <DialogHeader>
            <DialogTitle>Select a Process Area</DialogTitle>
          </DialogHeader>
          <RadioGroup onValueChange={handleSelection} value={selectedArea}>
            {processAreas?.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <RadioGroupItem value={area.label} id={area.id} />
                <Label htmlFor={area.id}>{area.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessAreaInput;