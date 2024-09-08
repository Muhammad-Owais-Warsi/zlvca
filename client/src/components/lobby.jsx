import { useState,useEffect,useCallback } from "react"
import { useSocket } from "../context/socket"
import { useNavigate } from "react-router-dom"


export default function Lobby () {

    const [email,setEmail] = useState('')
    const [code,setCode] = useState('')

    const navigate = useNavigate();

    const socket = useSocket();
    
    const enter = useCallback(() => {
  
        socket.emit("enter", ({email,code}))
    },[email,code,socket])

    const handleJoinRoom = useCallback((data) => {
        const {email,code} = data;
        navigate(`/room/${code}`);
    })


    useEffect(() => {
        socket.on("enter",handleJoinRoom);

        return () => {
            socket.off("enter");
        }

    },[socket,handleJoinRoom])

    return (
        <div>
            <div>
                <input type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <div>
                <input type="text" placeholder="Enter code" onChange={(e) => setCode(e.target.value)}></input>
            </div>
            <div>
                <button onClick={enter}>Enter</button>
            </div>
        </div>
    )
}