import { BrowserRouter } from 'react-router-dom';
import Router from './config/route';
import TextEditor from './TextEditor';
import { useState , useEffect } from 'react';
import Folder from './FolderTree';


export default function App() {

  const [message, setMessage] = useState(null);

  useEffect(() => {

    if (message) { 
      console.log(message);
    }
   
  }, [message]);
  
  return (
    // <BrowserRouter>
    //   <Router></Router>
    //  </BrowserRouter>

    <div style={{backgroundColor : "black"}}>
      <Folder>

      </Folder>
    </div>
  
  );
}
