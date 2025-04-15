import React, { useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
const log = console.log;

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const newEditroRef = useRef(null);

  const handleChange = (value, viewUpdate) => {
    log("View Update: from ", viewUpdate.changedRanges[0].fromA + " to " + viewUpdate.changedRanges[0].toA);
    
    viewUpdate.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
      const insertedText = inserted.toJSON().join('\n');
  
      console.log('📝 Change Info:');
      console.log('Deleted Range:', fromA, toA);
      console.log('Inserted Range:', fromB, toB);
      console.log('Inserted Text:', JSON.stringify(insertedText));
  
      // ✉️ You can send this as an object to other users
      const changePayload = {
        from: fromB,
        to: toB,
        text: insertedText,
      };


      if (fromA < toA) {
        newEditroRef.current.view.dispatch({
          changes: {
            from: fromA,
            to: toA,
          
          }
        })
      }

      const docLength = newEditroRef.current.view.state.doc.length;
      if (fromB > docLength || toB > docLength) {
        newEditroRef.current.view.dispatch({
          changes: {
            from: fromB,
            insert: insertedText
          }
        })
       
        }else {
          newEditroRef.current.view.dispatch({
            changes: {
              from: fromB,
              insert: insertedText
            }
          });
      }
        

        

    

  
      // sendToSocket(changePayload)
    });
  
    setCode(value);

    // 🔁 Send this value to others (via socket for example)
    console.log('Current Code:', value);

    // To get cursor position
    const cursor = viewUpdate.state.selection.main.head;
    log('Cursor Position:', cursor);
  };
  const handleChange2 = (value, viewUpdate) => {
    viewUpdate.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
      const insertedText = inserted.toJSON().join('\n');
  
      console.log('📝 Change Info 2 222222222222222222222:');
      console.log('Deleted Range:', fromA, toA);
      console.log('Inserted Range:', fromB, toB);
      console.log('Inserted Text:', JSON.stringify(insertedText));
  
    })
  }

  return (
    <>
    <CodeMirror
      width='50vw'
      theme="dark"
      height="400px"
      extensions={[javascript()]}
      onChange={handleChange}
      value={code}
      
    />

      <CodeMirror
        
        ref={newEditroRef}
    width='50vw'
    theme="dark"
    height="400px"
        extensions={[javascript()]}
        onChange={handleChange2}
      />
    </>
  );
};

export default CodeEditor;
