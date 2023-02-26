import axios from "axios";

export const client = axios.create({
    baseURL: "https://quick-chat-backend4.onrender.com",
    headers: {
        Accept: "application/json",
        // Authorization:localStorage.getItem("token")
    }
})