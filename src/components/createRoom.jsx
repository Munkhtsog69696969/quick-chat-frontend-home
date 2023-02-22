import { useRef } from "react"
import { client } from "./common/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import jwt_decode from "jwt-decode"

export const CreateRoom=()=>{
    const name=useRef();
    const check=useRef(false);
    const navigate=useNavigate();
    const [createdRoomId,setCreatedRoomId]=useState(null);
    const currentUserId=jwt_decode(localStorage.getItem("token")).existingUser._id;

    function Switch(){
        check.current=!check.current;
    }

    async function CreateRoom(){
        const nameInput=name.current.value;
        const checkInput=check.current;

        await client.post("/createRoom" , {name:nameInput , isPrivite:checkInput})
            .then(async(res)=>{
                // console.log(res.data);
                setCreatedRoomId(res.data._id);
            }).catch((err)=>{
                console.log(err)
            })
    }

    useEffect(()=>{
        if(createdRoomId!=null){
            client.put("/makeAdmin/"+createdRoomId , {userId:currentUserId})

            client.put("/pushRoomId/"+currentUserId , {roomId:createdRoomId})
            .then(async(res)=>{
                console.log(res.data);
                navigate("/home")
            }).catch((err)=>{
                console.log(err)
            })
        }
    },[createdRoomId])

    return(
        <div>
            <div>Room name:</div>
            <input placeholder="Enter room name..." ref={name}/>
            <div>Private?</div>
            <input type="checkbox" onClick={()=>Switch()}/>

            <div>
                <button onClick={CreateRoom}>Create Room</button>
            </div>
        </div>
    )
}