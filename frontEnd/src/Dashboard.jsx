
import {  useState } from 'react';

function Dashboard() {

    const [type, setType] = useState('');
    const [id, setId] = useState('');


  return (
      <div>
          
          <input value={type} onChange={(e) => setType(e.target.value)} type="text" />
          <button>ceate</button>
          <input value={id} onChange={(e) => setId(e.target.value)} type="text" />
          <button>connect</button>


    </div>
  )
}

export default Dashboard

