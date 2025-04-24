

export const ConnectToDoc =  (url = 'ws://localhost:8080/ws/documents?docId=', docId , update , setSocket) => {
    const temp = new WebSocket(url + docId);
    setSocket(temp);
    temp.onopen = () => {
        console.log('WebSocket connected');
    }


    // temp.onmessage = (event) => {
   
    //     const data = JSON.parse(event.data);
    //     update(data);
    //     // const editor = editorRef.current.getEditor();
    //     // editor.updateContents(data.delta, 'api');
    // };
    return temp
};


export const sendMessage = async (socket, payLoad) => {

    const message = JSON.stringify(payLoad);
    
    socket.send(message);
}
