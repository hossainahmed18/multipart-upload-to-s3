import { useState } from 'react';

const App=() => {
  const [file, setFile] = useState();
  const chunkSize = 5*1024*1024;

  const chunkFile = () => {
    let startPointer = 0;
    let endPointer = file.size;
    let chunks = [];

    while (startPointer < endPointer) {
      let newStartPointer = startPointer + chunkSize;
      chunks.push(file.slice(startPointer, newStartPointer));
      startPointer = newStartPointer;
    }
  }
  return (
    <div className="App" style={{ padding: '5%' }}>
      <input type="file" onChange={(event)=> setFile(event.target.files[0])}></input>
      <button onClick={chunkFile}>check</button>
    </div>
  );
}

export default App;
