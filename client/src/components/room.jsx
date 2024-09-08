import { useEffect, useCallback, useState } from "react"
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/socket";

export default function Room() {

    const [remoteSocketId,setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null);
    const socket = useSocket();

    const handleUserRoomJoin = useCallback((data) => {
        console.log("User joined room");
        setRemoteSocketId(socket.id)
        console.log(data);
    }, []);


    const handleIncomingCall = useCallback(async (data) => {
 
        const {from,offer} = data;
        setRemoteSocketId(from)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMyStream(stream);
        console.log("Incoming call",from,offer);

        const answer = peer.getAnswer(offer);
        socket.emit("answer",{from,answer});

    },[])


    const  callAccepted = useCallback(async (data) => {
        const {from,answer} = data;
        console.log("Answer",from,answer);
        await peer.setLocalDescription(answer);
    })

    useEffect(() => {
        socket.on("join", handleUserRoomJoin);
        socket.on("incoming:call",handleIncomingCall);
        socket.on("answer",callAccepted)

        return () => {
            socket.off("join", handleUserRoomJoin);
            socket.off("incoming:call",handleIncomingCall);
            socket.off("answer",callAccepted)
        };
    }, [socket, handleUserRoomJoin,handleIncomingCall,callAccepted]);

    const call = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        const offer = await peer.getOffer();
        console.log(remoteSocketId)
        socket.emit("call",{to:remoteSocketId,offer});

        setMyStream(stream);
    },[remoteSocketId])








    return (
        <div>
            <h1>Room</h1>
            {remoteSocketId ? "connected" : "not connected"}
            <div>
                {
                    remoteSocketId && (
                        <button onClick={call}>Call</button>
                    )
                }
            </div>
            <div>
                {
                    myStream && (
                        <ReactPlayer 
                            url={myStream}
                            height="300px"
                            width="300px"
                            playing
                        />
                    )
                }
            </div>
        </div>
    );
}
