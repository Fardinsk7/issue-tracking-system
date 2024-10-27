import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { MoreVertical, Upload, Eye, Trash2, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { uploadFile } from '@/utils/uploadFile';

interface ImageGalleryProps {
  images: string[];
  title: string;
  onUpload: (url:string,fieldName:string, title:string, file?:File) => void;
  onDelete: (index: number,fieldName:string, title:string) => void;
  fieldName:string;
  uploadPermission?:boolean
}

const IssueImageGallery: React.FC<ImageGalleryProps> = ({ images, title, onUpload, onDelete,fieldName,uploadPermission=true }) => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading,setLoading] = useState(false)
  const roleOfCurrentUser = localStorage.getItem("role")

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const file = event.target.files?.[0];
    if (file) {
      // onUpload(file);
      console.log(file)
      const url = uploadPermission? await uploadFile(file):""
      onUpload(url,fieldName,title,file)
    }
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLoading(false)
  };

  return (
    <div className="space-y-4 m-2">
    <h2 className="text-sm">{title}</h2>
    {loading && <Loader2 className='animate-spin'/>}
    <div className="flex gap-2 flex-row">
      {
        (roleOfCurrentUser=== "admin" || roleOfCurrentUser === "control room")&&(
          <>
            <div onClick={handleUploadClick} className="h-16 w-16 flex flex-col items-center justify-center border border-black text-white bg-black rounded-md cursor-pointer">
        <Upload className="h-6 w-1/2 mb-2" />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
          </>
        )
      }
      

      {images?.map((url:any, index) => {
        console.log(url)
       return <div key={index} className="relative group h-16 w-16">
          {!imageErrors[index] ? (
            <img
              src={url instanceof File?URL.createObjectURL(url):url}
              alt={`Image ${index + 1}`}
              className="h-full w-full object-cover rounded-lg"
              onError={() => handleImageError(index)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded-lg">
              Error loading image
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='z-auto'>
              <MoreVertical className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-md z-10" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-3xl overflow-scroll">
                  {!imageErrors[index] ? (
                    <div className="relative h-[600px]">
                      <img
                        src={url instanceof File?URL.createObjectURL(url):url }
                        alt={`Preview of image ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-[600px] flex items-center justify-center bg-gray-200">
                      Error loading image preview
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <DropdownMenuItem onClick={() => onDelete(index,fieldName,title)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
})}
    </div>
  </div>
  );
};

export default IssueImageGallery;