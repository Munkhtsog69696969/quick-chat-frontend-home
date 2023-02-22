import { useEffect, useState } from "react";
import styles from "./css/IncomeFriendRequest.module.css";
import { client } from "./common/client";
import jwt_decode from "jwt-decode";
import {BsFillCheckSquareFill} from "react-icons/bs"
import {BsFillTrashFill} from "react-icons/bs"
import {AiFillInfoCircle} from "react-icons/ai"
import {UserInfo} from "./UserInfo.jsx"

export const IncomeFriendRequest=()=>{
    const token=localStorage.getItem("token");

    const decodedToken=jwt_decode(token).existingUser;

    const userId=decodedToken._id;

    const [incomeFriendRequests,setIncomeFriendRequests]=useState([]);

    const [userInfo,setUserInfo]=useState();

    const [close,setClose]=useState(true);

    useEffect(()=>{
        client.get("/getIncomeFriendRequest/"+userId)
            .then(async(res)=>{
                // console.log(res.data);
                if(res.data.incomeFriendRequest!=""){
                    setIncomeFriendRequests(res.data.incomeFriendRequest)
                }
            }).catch((err)=>{
                console.log(err);
            })
    },[]);

    // console.log(incomeFriendRequests)


    async function UserInformation(user){
        setUserInfo(user)
        setClose(prev=>!prev)
    }

    async function deleteRequest(user){
        await client.post("/deleteRequest/"+userId , {friendId:user._id})
    }

    async function AcceptRequest(user){
        console.log(user)
        
        let roomId;

        if(decodedToken.usernumber <= user.usernumber){
            roomId=decodedToken.usercode+user.usercode;
        }else{
            roomId=user.usercode+decodedToken.usercode;
        }
        await client.post("/createRoom",{roomId:roomId})

        await client.post("/acceptRequest/"+userId , {friendId:user._id})
    }

    console.log(decodedToken)

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.name}>Friend Request List:</div>
            </div>

            <div className={styles.users}>
                {
                    incomeFriendRequests && incomeFriendRequests.map((item,i)=>{
                        return(
                            <div key={i} className={styles.user}>

                                <img className={styles.avatarImg} src={item.avatarImageUrl}/>

                                <div className={styles.userInfo}>
                                    <p className={styles.name}>{item.email}</p>
                                    <p className={styles.text}>{item.username}</p>
                                </div>

                                <div className={styles.addAndDelete}>
                                    <BsFillCheckSquareFill className={styles.iconCheck} onClick={()=>AcceptRequest(item)}></BsFillCheckSquareFill>
                                    <BsFillTrashFill className={styles.iconDelete} onClick={()=>deleteRequest(item)}></BsFillTrashFill>
                                    <AiFillInfoCircle className={styles.iconInfo} onClick={()=>UserInformation(item)}></AiFillInfoCircle>
                                </div>               
                            </div>
                        )
                    })
                }
            </div>

            <UserInfo data={userInfo && userInfo} close={close}></UserInfo>
        </div>
    )
}