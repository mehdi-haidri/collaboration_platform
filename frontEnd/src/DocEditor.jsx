import { useState ,useRef} from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'highlight.js/styles/atom-one-dark.css';
import hljs from 'highlight.js/lib/core';

import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);

window.hljs = hljs; 


const modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,  // Auto syntax highlighting for code
  },
  toolbar: {
    container: [
      ['bold', 'italic', 'underline'],
      [{ header: [1, 2, false] }],
      ['code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  },
};

const formats = [
  'header', 'bold', 'italic', 'underline',
  'code-block', 'list', 'bullet'
];




export default function DocEditor () {
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

  const sendMessage = async (message ) => {
    
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
    
    const handleLanguageChange = (language) => {
        const editor = editorRef.current.getEditor();
        const selection = editor.getSelection();
        if (selection) {
          const [block, offset] = editor.getLine(selection.index);
          if (block && block.domNode) {
            // Set the selected language to the code block
            block.domNode.setAttribute('data-language', language);
            block.domNode.classList.add(`language-${language}`);
            hljs.highlightElement(block.domNode); // Apply highlight.js syntax
          }
        }
      };
  return (
    <>
      <div>
            <h2>Quill v2 with Syntax Highlighting and Language Selection</h2>
      
            {/* Language Selection Dropdown */}
            <div>
              <button onClick={() => handleLanguageChange('javascript')}>JavaScript</button>
              <button onClick={() => handleLanguageChange('python')}>Python</button>
              <button onClick={() => handleLanguageChange('java')}>Java</button>
            </div>
      
            <ReactQuill
              ref={editorRef}
              theme="snow"
              value={value}
              onChange={setValue}
              modules={modules}
              formats={formats}
              style={{ height: '400px', backgroundColor: 'white', color: 'black' }}
            />
          </div>
    </>
  )
}

