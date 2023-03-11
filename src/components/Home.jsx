import jwt_decode from "jwt-decode"
import { useRef, useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "./common/client";
import { useNavigate } from "react-router-dom";
import styles from "./css/Home.module.css"

import {AiOutlineUserAdd} from "react-icons/ai"
import {FiUserPlus} from "react-icons/fi"
import {IoMdNotificationsOutline} from "react-icons/io"

import io from "socket.io-client";
const socket=io.connect("https://quick-chat-socket5.onrender.com",{
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
});

export const Home=()=>{
    const token=localStorage.getItem("token");
    const decodedToken=jwt_decode(token).existingUser;
    const userId=decodedToken._id;
    const [avatarImg,setAvatarImg]=useState();
    const navigate=useNavigate();
    const [friends,setFriends]=useState([]);
    const [selectedFriend,setSelectedFriend]=useState();
    const messageInput=useRef();

    const [selectedRoom,setSelectedRoom]=useState();

    const [messageList,setMessageList]=useState([]);
    // console.log(decodedToken);

    useEffect(()=>{
        setAvatarImg(decodedToken.avatarImageUrl);
    },[])


    function Logout(){
        localStorage.removeItem("token");
        navigate("/login")
    }

    useEffect(()=>{
        client.get("/getUserData/"+userId)
            .then(async(res)=>{
                // console.log(res.data);
                setFriends(res.data)
            }).catch((err)=>{
                console.log(err);
            })
    },[])

    // console.log(friends)

    async function currentChat(user){
        setSelectedFriend(user)

        let roomId;

        if(decodedToken.usernumber <= user.usernumber){
            roomId=decodedToken.usercode+user.usercode;
        }else{
            roomId=user.usercode+decodedToken.usercode;
        }

        await client.post("/findByRoomId",{roomId:roomId})
            .then(async(res)=>{
                // console.log("room:",res.data)
                setSelectedRoom(res.data)
            })
    }

    useEffect(()=>{
        if(selectedRoom!=undefined){
            socket.emit("join_room",({room:selectedRoom[0].roomId}))
        }
    },[selectedRoom])


    console.log("selected room:",selectedRoom)  
    
    async function SendMessage(){
        const message=messageInput.current.value;

        if(selectedRoom!=undefined){
            const _id=selectedRoom[0]._id

            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1;
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();

            const newdate = year + "/" + month + "/" + day;

            await client.put("/pushTextToRoom/"+_id, {Text:{message:message , name:decodedToken.username  , imageUrl:decodedToken.avatarImageUrl , date:newdate , userId:userId}})

            socket.emit("send_messages",{room:selectedRoom[0].roomId , message:message , name:decodedToken.username ,imageUrl:decodedToken.avatarImageUrl , date:newdate , userId:userId})

            setMessageList((list)=>[...list , {room:selectedRoom[0].roomId , message:message , name:decodedToken.username , imageUrl:decodedToken.avatarImageUrl , date:newdate , userId:userId}])

            messageInput.current.value="";
        }
    }

    // console.log("user:",selectedFriend)

    useEffect(()=>{
        if(selectedRoom!=undefined){
            const _id=selectedRoom[0]._id

            client.get("/getRoomTexts/"+_id)
                .then(async(res)=>{
                    // console.log("prev chats:",res.data)
                    setMessageList(res.data)
                })
        }
    },[selectedRoom])

    useEffect(()=>{
        socket.on("received_messages",(data)=>{
            console.log("sentMessage:",data);
            setMessageList((list)=>[...list , data])
        })
    },[socket])

    return(
        <div className={styles.container}>  

            <div className={styles.header}> 
                <img className={styles.avatarImg} src={avatarImg}/>

                <div className={styles.name}>{decodedToken.email}</div>

                <div className={styles.name}>{decodedToken.username}</div>

                <button className={styles.Button} onClick={Logout}>Log out</button>

                <div className={styles.headerEl}>
                    <AiOutlineUserAdd className={styles.icon}></AiOutlineUserAdd>

                    <Link to="/addfriend" className={styles.text}>Add Friend</Link>
                </div>

                <div className={styles.headerEl}>
                    <FiUserPlus className={styles.icon}></FiUserPlus>

                    <Link to="/incomefriendrequest" className={styles.text}>Incoming friend request</Link>
                </div>

                <div className={styles.headerEl}>
                    <IoMdNotificationsOutline className={styles.icon}></IoMdNotificationsOutline>

                    <div className={styles.text}>Notifications</div>

                    <div className={styles.notifContainer}>1</div>
                </div>

            </div>

            <div className={styles.body}>
                <div className={styles.friends}>
                    {
                        friends && friends.map((item,i)=>{
                            return(
                                <div key={i} className={styles.friendContainer} onClick={()=>currentChat(item)}>
                                    <img className={styles.avatarImg} src={item.avatarImageUrl}/>

                                    <div>
                                        <div className={styles.text}>{item.username}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className={styles.currentChat}>
                    <div className={styles.currentChatHeader}>
                        <img className={styles.avatarImg} src={selectedFriend!=undefined && selectedFriend.avatarImageUrl}/>
                        <div className={styles.text}>{selectedFriend!=undefined && selectedFriend.username}</div>
                    </div>

                    <div className={styles.currentChatBody}>
                        <div className={styles.insideCurrentChatBody}>
                            {
                                messageList && messageList.map((item,i)=>{
                                    console.log(item)
                                    return(
                                        <div className={styles.messageContainer} key={i}>
                                            <div className={item.userId==userId ? styles.messageContainerMe : styles.messageContainerOther } key={i}>
                                                <img className={styles.avatarImg} src={item.imageUrl}/>
                                                <div className={styles.messageName}>{item.name}</div>
                                                <div className={styles.messageText}>{item.message}</div>
                                                <div className={styles.messageDate}>{item.date}</div>
                                            </div>

                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className={styles.currentChatFooter}>
                        <input placeholder="Enter message..." className={styles.Input} ref={messageInput}/>

                        <button onClick={SendMessage} className={styles.Button1}>Send</button>
                    </div>
                </div>

            </div>

        </div>
    )
}