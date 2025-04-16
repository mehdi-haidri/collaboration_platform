
import {  useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {

    const [type, setType] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();
  
  const handleDocCreation = async () => {
    if (type) {
      try {
        let response = await fetch('http://localhost:8080/api/v1/documents/create/' + type, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
         
        })

        if(!response.ok){
          throw new Error(response.statusText)
        }
       

        response = await response.json();
        console.log(response);
        navigate(`/codeEditor/${response.data.id}`);
          
        
      }catch (error) {
        console.log(error);
      }
     
         
      
      
    }
  }


  return (
      <div>
          
          <input value={type} onChange={(e) => setType(e.target.value)} type="text" />
          <button onClick={handleDocCreation}>ceate</button>
          <input value={id} onChange={(e) => setId(e.target.value)} type="text" />
          <button onClick={() => navigate(`/codeEditor/${id}`)}>connect</button>


    </div>
  )
}

export default Dashboard

