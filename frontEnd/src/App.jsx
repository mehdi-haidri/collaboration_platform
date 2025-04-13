import { useState ,useRef} from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './App.css'



function App() {
  const [socket, setSocket] = useState(null);
  const [docId, setDocId] = useState('');
  const [value, setValue] = useState('');
  const editorRef = useRef(null);
  
  const testConnection = async () => {
    const temp = new WebSocket('ws://localhost:8080/ws/documents?docId='+docId);
  setSocket(temp);
temp.onopen = () => {
  console.log('WebSocket connected');
  
};

    temp.onmessage = (event) => {
   
      const editor = editorRef.current.getEditor();
      const data = JSON.parse(event.data);
      editor.updateContents(data.delta, 'api');
   };

  }

  const sendMessage = async (message) => {
    
  

      socket.send(message);
 
  
  }

  const sendToOtherUser = (content, delta, source, editor) => {
    setValue(content);
    if (source === 'user') {
      const ops = delta.ops;
      const currentSelection = editor.getSelection();
      
      const changePayload = {
        delta,
        selection: currentSelection,
        timestamp: Date.now(), // optional but helpful
      };
      sendMessage(JSON.stringify(changePayload));
    }
  }


  const saveData = async () => {


    try { 
      const respense = await fetch('http://localhost:8080/saveDocs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id :docId, content: value }),
      })

      if(!respense.ok){
        throw new Error(respense.statusText)
      }
      console.log(respense.json());
    }catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div>
        <input onChange={(e) => setDocId(e.target.value)}  value = {docId} type="text" />
        <button onClick={testConnection}>
          test
        </button>
        <button onClick={sendMessage}> send message </button>
        <button onClick={saveData}> save </button>
      </div>
      <div>
        <ReactQuill ref={editorRef} theme="snow" value={value}
          onChange={sendToOtherUser}
          style={{ backgroundColor: 'white', color: 'black' }} />
      
    </div>
    </>
  )
}

export default App
