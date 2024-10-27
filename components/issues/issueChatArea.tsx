import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Send, Paperclip, PaperclipIcon, Loader2, RefreshCcw } from 'lucide-react';
import { chat } from '@/redux/features/issue-data';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ScrollArea } from '../ui/scroll-area';
import { Toaster } from '../ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/utils/uploadFile';
import ViewIssueDocs from './ViewIssueDocs';


interface ChatMessage {
  _id: string;
  message: string;
  senderName: string;
  senderId: string;
  documentUrl: string;
  createdAt: string;
}

interface IssueChatAreaProps {
  issueTitle: string;
  messages: chat[];
  currentUserId: string;
  issueId: string;
}

const ChatMessage: React.FC<{ message: ChatMessage; isCurrentUser: boolean }> = ({ message, isCurrentUser }) => {
  const formattedDate = new Date(message.createdAt).toLocaleString()


  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3`}>
        {!isCurrentUser && <p className="font-bold text-sm">{message.senderName}</p>}
        <p>{message.message}</p>
        {message.documentUrl && (
          <>
          {/* <a href={message.documentUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">
            Attached Document
          </a> */}
          <ViewIssueDocs url={message.documentUrl}/>
          </>
        )}
        <p className={isCurrentUser ? "text-xs text-white mt-1" : "text-xs text-gray-500 mt-1"}>{formattedDate}</p>
      </div>
    </div>
  );
};

const IssueChatArea: React.FC<IssueChatAreaProps> = ({ issueTitle, messages, currentUserId, issueId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [documentAttact, setDocumentAttact] = useState('');
  const [loading, setLoading] = useState(false)
  const [chatData, setChatData] = useState([])
  const [myFile, setMyFile] = useState(null)
  const [sendLoading, setSendLoading] = useState(false)
  // const { value } = useSelector((state: RootState) => state.user)
  const  number  = localStorage.getItem('number');
  const  name  = localStorage.getItem('name');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("File change event:", event);
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      setMyFile(file);
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current.click();
  }

  const getChats = async (id) => {
    setLoading(true)
    try {
      const response = await fetch('/api/issues/getIssueChat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ id })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json()
      console.log(response)
      console.log(result.data.chats)
      setChatData(result.data.chats)
      console.log("Chat data: ", chatData)
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false)
    }

  }



  const handleSendMessage = async () => {
    // Implement send message logic here
    setSendLoading(true)
    let documentUrl2 = '';

    if (!newMessage && !myFile) {
      toast({
        title: "Please Add Message to Send",
        variant: "destructive"
      })
      setSendLoading(false)
      return
    }
    if (myFile) {
      documentUrl2 = await uploadFile(myFile);
      setDocumentAttact(documentUrl2)
    }
    else {
      console.log("No File", myFile)
    }
    let newData = {
      message: newMessage,
      senderNumber: number.toString(),
      senderName: localStorage.getItem('name'),
      documentUrl: documentUrl2,
      createdAt: new Date().toISOString(),
    }

    const response = await fetch('/api/issues/addIssueMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: issueId,
        newMessage: newData
      }),
    });

    const data = await response.json();
    console.log(data)
    setSendLoading(false)
    setMyFile(null)
    setDocumentAttact(null)
    setChatData([...chatData, newData])
    setNewMessage('');
    scrollToBottom()
  };

  useEffect(() => {
    getChats(issueId)
    console.log(number)
    console.log(name)
  }, [])
  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when chatData changes
  }, [chatData]);

  return (
    <div className="flex flex-col sm:h-[490px] h-[550px]  overflow-hidden relative">
      {/* <div className="bg-gray-100 p-4 border-b">
        <h2 className="text-lg font-semibold">{issueTitle}</h2>
      </div> */}
      <ScrollArea className="flex-grow overflow-y-auto p-4 ">
        {!loading && chatData?.map((message) => (
          <ChatMessage
            key={message._id}
            message={message}
            isCurrentUser={message.senderNumber === number.toString()}
          />
        ))}
        {
          loading && <div className='flex justify-center items-center h-[300px] '>
            <Loader2 className='animate-spin' />
          </div>
        }
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="border-t p-4">
        {
          sendLoading && <>
            <div className='flex flex-row mb-3'>Sending message <Loader2 className='animate-spin ml-2' /></div>
          </>
        }
        {
          myFile && <>
            <div className='flex flex-row mb-3'>Attached File: {myFile.name}</div>
          </>
        }
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden'
          onClick={(e) => { console.log("File input clicked", e); }}
        />
        {
          (localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "control room") && (
            <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow border rounded-l-lg p-2 focus:outline-none  focus:ring-gray-500"
          />
          <button
            className="bg-gray-200 p-3 rounded-none hover:bg-gray-300 focus:outline-none"
            title="Attach file"
            onClick={(e) => {
              triggerFileInput();
            }}
          >
            <Paperclip size={20} />
          </button>
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 focus:outline-none"
          >
            <Send size={20} />
          </button>
        </div>
          )
        }
        
      </div>
      <RefreshCcw className='absolute right-0 sm:m-5 mt-10 mr-2 cursor-pointer bg-white rounded-full h-8 w-8 p-[5px]' onClick={() => getChats(issueId)} />
      <Toaster />
    </div>
  );
};

export default IssueChatArea;
