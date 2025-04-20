import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import 'highlight.js/styles/atom-one-dark.css';
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";

// import { io } from "socket.io-client";
hljs.registerLanguage("javascript", javascript);

import Quill from "quill";
import "quill/dist/quill.snow.css";


// const BlockEmbed = Quill.import("blots/block/embed");

// class PageBreak extends BlockEmbed {
//   static blotName = "pageBreak";
//   static tagName = "div";
//   static className = "page-break";
// }

// Quill.register(PageBreak);



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
  ["clean"] // remove formatting button
];

const toolbarContainer = document.createElement("div");
    toolbarContainer.id = "toolbar";
   
    

const TextEditor = () => {
  const [quill, setQuill] = useState([]);
  const [socket, setSocket] = useState(null);
  const editorRef = useRef();
  const wrapper = useRef();
  // getting the ID of the document from the route params
  const { id: documentId } = useParams();
  /* 
    this function will check if there are changes on the editor and if the changes are made by the current user,
    then send those changes to the server via the socket
    */
  const sendUserChangesToServer = (delta, oldDelta, source , i) => {
    /* 
        API changes means that the server sent some changes to the client. This happens when someone else is typing
        something on the same editor instance. Since this function is for sending current user's changes back to the
        server, we will ignore this event.


    */
      console.log(delta , i);
    if (source === "api") return;

    // if the user itself made changes on the editor, send the changes to the server via socket event
     // ### socket.emit("send-change", delta);
  };

  // everytime we receive some changes by other users, update the contents of the editor
  const updateEditor = delta => {
    quill.updateContents(delta);
  };

  const loadDocumentFromUser = document => {
    quill.setContents(document);
    quill.enable();
  };

  // this useEffect will run once on mount only
  useEffect(() => {

  
  
    

   
    
    // creates an editor containersdsa for placing the quil editor inside including the toolbar
   addPage();

    // connecting to socket from the server
    // const sock = io("http://localhost:5000");
    // const sock = io("https://google-docs-plus-api.herokuapp.com/");
    // // setting the socket to the local state
    // setSocket(sock);

    // before unmount
    return () => {
      // remove the quill editor
      wrapper.current.innerHTML = "";
      // disconnect from the socket
      //   sock.disconnect();
    };
  }, []);

  useEffect(
    () => {
      // if quill or the socket is not present on mount, just return
      if (quill === null && socket === null) return;
      
      
      // if user changes something on the editor, send it to the server
      quill.forEach((q , i) => q.on("text-change", (delta, oldDelta, source) => sendUserChangesToServer(delta, oldDelta, source , i)));
      quill.forEach((q, i) => {
        console.log('q', q);
        
        q.on('selection-change', (range) =>SetSelection(range , q))
      })
          console.log('quill');

      // if some other user has made changes to the editor, update the current editor with the changes
    //   socket.on("receive-changes", updateEditor);

      // remove the event handler on unmount
      return () => {
        quill.forEach(q => q.off("text-change", sendUserChangesToServer));
        quill.forEach(q => q.off("selection-change"));
        // socket.off("receive-changes", updateEditor);
      };
    },
    // whenever the socket or the quill itself changes
    [ quill]
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
    console.log('range', range);
    if (!range) {
      setTimeout(() => {
        const visibleToolbars = Array.from(document.querySelectorAll(".ql-toolbar"))
        .filter(toolbar => {
          const style = window.getComputedStyle(toolbar);
          return style.display === "flex";
        });
        console.log('removed');
        if (!(visibleToolbars.length == 1)) {

          console.log(visibleToolbars);
          q.getModule('toolbar').container.style.display = "none";
        }
      }, 0)
    } else {
      console.log('aadded');
      q.getModule('toolbar').container.style.display = "flex";
    }

  }

  const addPage = () => { 
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
    
    newQ.getModule('toolbar').container.style.display = "none";
    setQuill([...quill, newQ]);
  }

  return <div className='container' ref={wrapper}>
    <button onClick={addPage}>add</button>
  </div>;
};

export default TextEditor;