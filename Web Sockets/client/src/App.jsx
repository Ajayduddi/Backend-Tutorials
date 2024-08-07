import { io } from 'socket.io-client';
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './App.css'

function App() {
  const [score, setScore] = useState([]);
  const [socket, setSocket] = useState(null);
  const [editData, setEditData] = useState({});
  const [isEdit, setIsEdit] = useState(false);


  useEffect(() => {
    const newSocket = io('http://localhost:3000');

    newSocket.on('connect', () => {
      console.log('connected to server');
    });

    setSocket(newSocket);
    newSocket.emit('send-data');

    setInterval(() => {
      console.log('fetch data');
      newSocket.emit('send-data');
    }, 5000);

    newSocket.on('send-message-response', (data) => {
        console.log('gettiing data');
        setScore(data);
    });
    
    return () => newSocket.disconnect();
  }, []);
  

  const sendScore = (e) => {
    e.preventDefault();
    const { name, score } = e.target.elements;
    const data = { name: name.value, score: score.value };
    
    if (socket) {
      socket.emit('send-message', { ...data, id: uuidv4() });
      setEditData({});
    } else {
      alert('socke connection not established')
    }
  }

  const editScore = (item) => { 
    setEditData(item);
    setIsEdit(true);
  }

  const updateScore = (e) => {
    e.preventDefault();
    const { name, score } = e.target.elements;
    setEditData((prev) => ({ ...prev, name: name.value, score: score.value }));
    
    if (socket) {
      socket.emit('update-message', editData);
      setIsEdit(false);
    } else {
      alert('socke connection not established')
    }
  }

  const deleteScore = (item) => {
    if (socket) {
       socket.emit('delete-message', item);
    } else {
      alert('socke connection not established')
    }
  }

  return (
    <>
      <div className='demo'>
        <h1>Web Sockets</h1>
        <form action="" onSubmit={e=> isEdit ? updateScore(e) : sendScore(e)}>
          <input type="text" placeholder='Enter Name' name='name' value={editData.name} required />
          <input type="number" placeholder='Enter Score' name='score' value={editData.score} required />
          <button type="submit">{isEdit ? 'Update' : 'Submit'}</button>
        </form>
      </div>

      <div>
        <table>
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          {score.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.score}</td>
              <td><button onClick={() => editScore(item)}>Edit</button></td>
              <td><button onClick={() => deleteScore(item)}>Delete</button></td>
            </tr>
          ))}
        </table>
      </div>
    </>
  )
}

export default App

