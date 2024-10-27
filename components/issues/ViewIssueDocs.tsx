import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { downloadAndSaveDocument, parseGoogleCloudUrl } from '@/helper/helper';

interface IViewIssueDocsProps {
    url: string;
}

const ViewIssueDocs: React.FC<IViewIssueDocsProps> = ({ url }) => {
    const { name, type } = parseGoogleCloudUrl(url)

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'm4v'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];

    const isImage = imageExtensions.includes(type.toLowerCase());
    const isVideo = videoExtensions.includes(type.toLowerCase());
    const isAudio = audioExtensions.includes(type.toLowerCase());

    const renderThumbnail = () => {
        if (isImage) {
            return <img src={url} alt="thumbnail" className='h-[50px] w-[50px] object-cover' />;
        } else if (isVideo) {
            return <video src={url} className='h-[100px] w-[100px] object-cover' />;
        } else if (isAudio) {
            return <audio src={url} className='h-[50px] w-[200px]' controls />;
        } else {
            return (
                <Button>
                    Attached Document ({type})
                </Button>
            );
        }
    }

    const renderFullContent = () => {
        if (isImage) {
            return <img src={url} alt="document" className='max-h-[80vh] max-w-full object-contain' />;
        } else if (isVideo) {
            return <video src={url} className='max-h-[80vh] max-w-full' controls />;
        } else if (isAudio) {
            return <audio src={url} className='w-full' controls />;
        } else {
            return (
                <div className="text-center">
                    <p>This file type cannot be previewed.</p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                        Attached Document
                    </a>
                </div>
            );
        }
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div>{renderThumbnail()}</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90vw]">
                <DialogHeader>
                    <DialogTitle>{name}</DialogTitle>
                </DialogHeader>
                <div className='flex justify-center items-center'>
                    {renderFullContent()}
                </div>
                <DialogFooter className="sm:justify-between">
                    <Button onClick={()=>downloadAndSaveDocument(url)} type="button" variant="secondary">
                        Download
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewIssueDocs