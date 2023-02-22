
import styles from "./css/AddFriend.module.css"
import { useRef } from "react";
import { client } from "./common/client";
import jwt_decode from "jwt-decode"
import { useState } from "react";
import { useEffect } from "react";
import {BsFillPlusSquareFill} from "react-icons/bs"


export const AddFriend=()=>{
    const friendCode=useRef();
    const decodedToken=jwt_decode(localStorage.getItem("token")).existingUser;
    const userId=decodedToken._id;

    const [decodedFriendToken,setDecodedFriendToken]=useState();

    async function FindByCode(){
        if(friendCode.current.value!=""){
            await client.post("/findFriends",{usercode:friendCode.current.value})
                .then(async(res)=>{
                    // console.log(res.data)
                    setDecodedFriendToken(jwt_decode(res.data).user)
                }).catch((err)=>{
                    console.log(err)
                })
        }
    }

    async function FindByUsername(){
        if(friendCode.current.value){
            await client.post("/findFriendsUsername" , {name:friendCode.current.value})
                .then(async(res)=>{
                    // console.log(res.data)
                    setDecodedFriendToken(jwt_decode(res.data).user)
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
    }

    async function SendFriendRequest(item){
        console.log(item)
        await client.put("/incomeFriendRequest/"+item._id , {myId:userId})
            .then(async(res)=>{
                console.log(res.data);
            })
    }

    console.log(decodedFriendToken)

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <input ref={friendCode} placeholder="Enter friend's  code or email..." className={styles.Input}/>

                <button className={styles.Button} onClick={FindByCode}>Find By Code</button>

                <button className={styles.Button} onClick={FindByUsername}>Find By Username</button>
            </div>

            <div className={styles.users}>
                {
                    decodedFriendToken && decodedFriendToken.map((item,i)=>{
                        return(
                            <div key={i} className={styles.user}>

                                <img className={styles.avatarImg} src={item.avatarImageUrl}/>

                                <div className={styles.userInfo}>
                                    <p className={styles.name}>{item.email}</p>
                                    <p className={styles.text}>{item.username}</p>
                                </div>

                                <div className={styles.addAndDelete}>
                                    <BsFillPlusSquareFill className={styles.iconPlus} onClick={()=>SendFriendRequest(item)}></BsFillPlusSquareFill>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}