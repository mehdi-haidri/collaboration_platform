import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import 'highlight.js/styles/atom-one-dark.css';
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import {sendMessage  , ConnectToDoc} from "./utils/Socket"


// import { io } from "socket.io-client";
hljs.registerLanguage("javascript", javascript);
const PAGE_HEIGHT = 1076;
import Quill from "quill";
import "quill/dist/quill.snow.css";


const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown

  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ list: "ordered" }, { list: "bullet" }],
  [{ direction: "rtl" }], // text direction

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["image", "blockquote", "code-block" , "link"],
  ["clean"]// remove formatting button
];


   


const TextEditor = () => {
  const [save, setSave] = useState(false);
  const saveRef = useRef(save);
  const [quill, setQuill] = useState([]);
  const quillRef = useRef(quill);
  const [socket, setSocket] = useState(null);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const wrapper = useRef();
  // getting the ID of the document from the route params
  const { id: documentId } = useParams();
  /* 
    this function will check if there are changes on the editor and if the changes are made by the current user,
    then send those changes to the server via the socket
    */
  const sendUserChangesToServer = (delta, oldDelta, source, i) => {
    if (source === "user") {
      setSave(true);
      sendMessage(socket,{delta , addPage : false , page : i});
      // console.log('delta', delta);
      // console.log('page', i);
     }

    
    
  };

  // everytime we receive some changes by other users, update the contents of the editor
  const updateEditor = (data ) => {
    console.log(data);
    if (data.type === 'change') { 
      const value = JSON.parse(data.value);
      if(value.addPage){
        addPage("api");
        return
      } else {
        console.log(quillRef.current.length)
        quillRef.current[value.page].updateContents(value.delta ,"api");
      }
    } else if (data.type == "notification") { 
      console.log(data.value);
    }
  };

  const loadDocumentFromUser = async () => {
    try { 

      const response = await fetch("http://localhost:8080/api/v1/documents/" + documentId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(!response.ok){
          throw new Error(response.statusText);
      }
    
      const data = await response.json();
      const pages = JSON.parse(data.data)
      console.log(pages);
      if(pages.length === 0){
        addPage();

        setDocumentLoaded(true);
        return
      }
      let docs = [];
      pages.forEach((page, i) => {
        const Q = addPage();
        docs.push(Q);
        setTimeout(() => {
          Q.updateContents(page, "api");
        } , 100)
      })
     setQuill(docs);
     setDocumentLoaded(true);
    }catch (error) {
      console.log(error);
    }

    
  };

useEffect(() => {
      saveRef.current = save;
}, [save]);

  useEffect(() => {
  loadDocumentFromUser();
  }, []);

  useEffect(() => {
    let interval
    if (documentLoaded) {
     ConnectToDoc('ws://localhost:8080/ws/documents?docId=', documentId, updateEditor, setSocket);
      
       
      interval = setInterval(() => {
        
        if (saveRef.current) {
          saveDoc();
          setSave(false);
        }
      }, 20000);
    }
    return () => {
      clearInterval(interval);
      
    };
  }, [documentLoaded]);

  // useEffect(() => {
  //   if (message) updateEditor(message.value);
  // }, [message]);

  useEffect(
    () => {
      console.log(socket);
      quillRef.current = quill;
      // if quill or the socket is not present on mount, just return
      if (quill.length == 0  || socket === null) return;
      
      console.log(quill.length)
      // if user changes something on the editor, send it to the server
      quill.forEach((q, i) => {
        q.on("text-change", (delta, oldDelta, source) => {
          if(source === 'api') return
          const range = q.getSelection();
          if (range) {
            const bounds = q.getBounds(range.index);
            const position = bounds.top + bounds.height;
            if (position > PAGE_HEIGHT) {
              const length = q.getLength();
              q.deleteText(length - 2, 2);
              let newQ;
              if (i == quill.length - 1) {
                 newQ = addPage()
                q.blur()
                setTimeout(() => {
                  newQ.focus();
                  newQ.setSelection(0, 0);
                }, 50);

              } else {
                 newQ = quill[i + 1];
                q.blur()
                setTimeout(() => {
                  newQ.focus();
                  newQ.setSelection(0, 0);
                }, 50);
              }
              return
            }
            
          }
          sendUserChangesToServer(delta, oldDelta, source, i)
        })
        q.on('selection-change', (range) => {
          SetSelection(range, q)
        });
        AddPageButton(q);
        
      });
       
    

     


      // remove the event handler on unmount
      return () => {
        quill.forEach(q => {
          q.off("text-change")
          q.off("selection-change")
        });
     
        // socket.off("receive-changes", updateEditor);
      };
    },
    // whenever the socket or the quill itself changes
    [ quill , socket]
  );

//   useEffect(() => {
//     // if we don't have socket or the quill, don't proceed
//     if (socket === null || quill === null) return;

//     // sends the documentID to the server
//     socket.emit("get-document", documentId);

//     // 'once' will ensure that the handler runs once and then gets garbage collected
//     // this will run once to load the document from the server
//     socket.once("load-document", loadDocumentFromUser);
//   }, [socket, quill, documentId]);

  // this useEffect is used to save the document every 2.5 seconds
//   useEffect(() => {
//     let interval = setInterval(() => {
//       socket.emit("save-document", {
//         data: quill.getContents(),
//         documentId
//       });
//     }, 2500);

//     return () => {
//       clearInterval(interval);
//     };
  //   }, [socket, quill]);
  const SetSelection = (range ,q) => {
    if (!range) {
      setTimeout(() => {
        const visibleToolbars = Array.from(wrapper.current.querySelectorAll(".ql-toolbar"))
        .filter(toolbar => {
          const style = window.getComputedStyle(toolbar);
          return style.display === "flex";
        });
        if (!(visibleToolbars.length == 1)) {
          console.log(visibleToolbars);
          q.getModule('toolbar').container.style.display = "none";
        }
      }, 0)
    } else {
      q.getModule('toolbar').container.style.display = "flex";
    }

  }

  const addPage = (type) => { 
    const newPage = document.createElement("div");
    newPage.className = "page"
    wrapper.current.appendChild(newPage);
    const newQ = new Quill(newPage, {
      
      theme: "snow",
      modules: {
        syntax: { hljs },
        toolbar: toolbarOptions
        
      }
    });

    if (quill.length > 0) {
      newQ.getModule('toolbar').container.style.display = "none"
      console.log(type);
      if (type != "api") sendMessage(socket,{addPage : true });
    }
    
    quillRef.current = [...quill, newQ];
    setQuill([...quill, newQ]);
    return newQ
  }
  
  const AddPageButton = (q) => { 
    const toolbar = q.getModule('toolbar');
    if (toolbar.container.querySelector('.ql-addPage')) return;
    const ql_formats = document.createElement('span');
    ql_formats.className = 'ql-formats ';
    const AddPageButton = document.createElement("button");
    AddPageButton.innerHTML = "➕Page";
    AddPageButton.className = "ql-addPage";
    AddPageButton.addEventListener("click", addPage);
    ql_formats.appendChild(AddPageButton);
    toolbar.container.appendChild(ql_formats);
  }


  const saveDoc = async () => { 
      
    const value = quillRef.current.map(q => q.getContents());

    console.log(value);

    try { 
      const respense = await fetch('http://localhost:8080/api/v1/documents/saveDocs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id :documentId, content: JSON.stringify(value) }),
      })

      if(!respense.ok){
        throw new Error(respense.statusText)
      }
      console.log(await respense.json());
    }catch (error) {
      console.log(error);
    }

  }

  return <div className='container' ref={wrapper}>
    <button onClick={saveDoc}>Save</button>
    
  </div>;
};

export default TextEditor;