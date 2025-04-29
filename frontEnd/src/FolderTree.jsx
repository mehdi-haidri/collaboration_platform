import { useEffect, useState } from 'react'
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';

export default function Folder() {
  const [treeState, setTreeState] = useState({});

  useEffect(() => {
    setTreeState(
      {
        name: 'root [half checked and opened]',
        checked: 0.5,   // half check: some children are checked
        isOpen: true,   // this folder is opened, we can see it's children
        children: [
          { name: 'children 1', checked: 0, id: 1 },
          {
            name: 'children 2',
            checked: 0.5,
            children: [
              { name: 'children 2-1', checked: 0 },
              { name: 'children 2-2', checked: 1 },
            ],
          },
        ],
      }

    )
        
  }, [
        
  ])

  const onTreeStateChange = (state, event) => {
    console.log(state, event);
  }

  const handeleOnclick = (event) => {
    console.log(event);
  }

  
  const insertNodeAtPath = () => {
    const newNode = { name: 'new node' , checked: 0 };
    const path = [1,2];
    const updatedTree = { ...treeState };
    if (path.length === 1) {
      // inserting at root level (rare case)
      updatedTree.children.splice(path[0],0, newNode);
      setTreeState(updatedTree);
      
      return;
    }
    
      
  // copy to avoid mutating original tree
      let current = updatedTree;
    
      for (let i = 0; i < path.length-1; i++) {
        const index = path[i];
        if (!current.children) {
          current.children = [];
        }
        current.children[index] = { ...current.children[index] };
        current = current.children[index];
      }
    
      if (!current.children) {
        current.children = [];
      }
      current.children[path[path.length - 1]] = newNode;
      console.log(updatedTree);
      setTreeState(updatedTree);
  };
  
    
  return (
    <>
          <FolderTree data={treeState} onNameClick={handeleOnclick} onTreeStateChange={onTreeStateChange} />
          <button onClick={insertNodeAtPath}>
              add
          </button>
    </>
  )
}
