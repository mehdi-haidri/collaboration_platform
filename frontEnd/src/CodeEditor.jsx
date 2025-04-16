import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useParams } from 'react-router-dom';
const log = console.log;
import { Transaction } from '@codemirror/state';
import {sendMessage  , ConnectToDoc} from "./utils/Socket"


const CodeEditor = () => {
  const [code, setCode] = useState("");
  const EditroRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const { id } = useParams();
  const [save, setSave] = useState(false);
  const saveRef = useRef(save);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  useEffect(() => {
    if (socket != null) {
      socket.close();
    }
    if (socket == null) {
      ConnectToDoc('ws://localhost:8080/ws/documents?docId=', id , applyRemoteChange,setSocket);
    }

    const interval = setInterval(() => {
      log(saveRef.current);
      if (saveRef.current) {
        saveDoc();
        setSave(false);
      }
    }, 5000);
  
    return () => clearInterval(interval); // cleanup on unmount
    

  }, []);

  const handleChange = (value, viewUpdate) => {
 
    const isRemote = viewUpdate.transactions.some(tr => tr.annotation(Transaction.remote));
    console.log('isRemote', isRemote);
    if (isRemote) {
      return;
    }
    setSave(true);
      viewUpdate.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
      const insertedText = inserted.toJSON().join('\n');
  
      console.log('📝 Change Info:');
      console.log('Deleted Range:', fromA, toA);
      console.log('Inserted Range:', fromB, toB);
      console.log('Inserted Text:', JSON.stringify(insertedText));
  
      // ✉️ You can send this as an object to other users
      if (fromA < toA) {
        const changePayload = {
          from: fromA,
          to: toA,
          insert: insertedText,
        };
        sendMessage(socket , changePayload);
      }

      const docLength = EditroRef.current.view.state.doc.length;
      if (fromB > docLength || toB > docLength) {
        const changePayload = {
          from: fromB,
          insert: insertedText,
        };
          sendMessage(socket ,changePayload);

       
        }else {
          const changePayload = {
            from: fromB,
            insert: insertedText,
          };
            sendMessage(socket,changePayload);
      }
            
    });
    setCode(value);
    const cursor = viewUpdate.state.selection.main.head;
    log('Cursor Position:', cursor);
  };




  const applyRemoteChange = (data) => { 
    if (data.type == 'lastSave') { 
      
      EditroRef.current.view.dispatch({
        changes: {
          from: 0,
          to: EditroRef.current.view.state.doc.length,
          insert: data.value,
        },
        annotations: Transaction.remote.of(true),
      });
      
    } else {
      const changes = JSON.parse(data.value);
      
      if (changes?.to) {
        EditroRef.current.view.dispatch({
          changes: {
            from: changes.from,
            to: changes.to,
          },
          annotations: Transaction.remote.of(true),
        });
      } else {
        EditroRef.current.view.dispatch({
          changes,
          annotations: Transaction.remote.of(true),
        });
      }

    }
     
   
   
  }



  // const applyOn1 = (value, viewUpdate) => { 
  //   islocal1.current = false;
  //   viewUpdate.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
  //     const insertedText = inserted.toJSON().join('\n');

  //     if (fromA < toA) {
  //       EditroRef.current.view.dispatch({
  //         changes: {
  //           from: fromA,
  //           to: toA,
        
  //         }
  //         , annotations: Transaction.remote.of(true),
  //       })
  //     }


  //     const docLength = EditroRef.current.view.state.doc.length;
  //     if (fromB > docLength || toB > docLength) {
  //       EditroRef.current.view.dispatch({
  //         changes: {
  //           from: fromB,
  //           insert: insertedText
  //         },
  //         annotations: Transaction.remote.of(true),
  //       })
       
  //       }else {
  //         EditroRef.current.view.dispatch({
  //           changes: {
  //             from: fromB,
  //             insert: insertedText
  //           }
  //           , annotations: Transaction.remote.of(true),
  //         });
  //     }

  //     setTimeout(() => {
  //       islocal1.current = true;
  //     }, 0);
        
  



  //   })

   
  // }

  // const handleChange2 = (value, viewUpdate) => {
  //   const isRemote = viewUpdate.transactions.some(tr => tr.annotation(Transaction.remote));
  //   console.log('isRemote', isRemote);
  //   if (
  //     isRemote
  //   ) {
  //     return;
  //   }
    

   
  //   viewUpdate.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
  //     const insertedText = inserted.toJSON().join('\n');
  
  //     console.log('📝 Change Info 2 222222222222222222222:');
  //     console.log('Deleted Range:', fromA, toA);
  //     console.log('Inserted Range:', fromB, toB);
  //     console.log('Inserted Text:', JSON.stringify(insertedText));

  //     // const changePayload = {
  //     //   from: fromB,
  //     //   to: toB,
  //     //   text: insertedText,
  //     // };

  //     applyOn1(value, viewUpdate);
  
  //   })
  // }


  const saveDoc = async () => { 
    const value = EditroRef.current.view.state.doc.toString();
    try { 
      const respense = await fetch('http://localhost:8080/api/v1/documents/saveDocs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id :id, content: value }),
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
    <CodeMirror
      width='50vw'
      theme="dark"
        height="400px"
      extensions={[javascript()]}
        onChange={(value ,arg) => {
         
          handleChange(value,arg)
        }}
        value={code}
        ref={EditroRef}
      
    />

      {/* <CodeMirror
        
        ref={newEditroRef}
        width='50vw'
        theme="dark"
        height="400px"
        extensions={[javascript()]}
        onChange={(value, arg) => {
          handleChange2(value, arg)
        }}
      /> */}
    </>
  );
};

export default CodeEditor;
