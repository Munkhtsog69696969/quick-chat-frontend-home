import styles from "./css/UserInfo.module.css"
import { client } from "./common/client"
import { useEffect, useState } from "react"

export const UserInfo=(userData)=>{

    console.log(userData.close)

    const [userFriends,setUserFriends]=useState([]);
    const [close,setClose]=useState(true);

    useEffect(()=>{
        if(userData.data!=undefined){
            client.get("/getUserData/"+userData.data._id)
            .then(async(res)=>{
                console.log(res.data)
                setUserFriends(res.data.friends);
            }).catch((err)=>{
                console.log(err)
            })
        }
    },[userData.data])

    useEffect(()=>{
        if(userData.close==false){
            setClose(false)
        }
    },[userData.close])

    function Close(){
        setClose(true)
    }

    return(
        <div className={close ? styles.containerClose : styles.containerOpen}>
            <div className={styles.cross} onClick={Close}>X</div>

            <div className={styles.bigText}>User info:</div>

            <div className={styles.user}>
                <div className={styles.text}>Username: {userData.data!=undefined && userData.data.username}</div>

                <div className={styles.text}>Email: { userData.data!=undefined && userData.data.email}</div>

                <div>
                    {
                        userFriends && userFriends.map((item,i)=>{
                            return(
                                <div>
                                    a
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}