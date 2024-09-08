import { createContext,useMemo,useContext} from "react";
import {io} from "socket.io-client"

const SocketContext = createContext(null);

// We have created this function so that we dont to have to use useContext in every component
export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export default function SocketProvider({children}){

    const socket = useMemo(() => io("http://localhost:9000"),[]) // we use usememo to prevent the socket from being created multiple times

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}