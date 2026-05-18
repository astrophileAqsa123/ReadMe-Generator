import axios from "axios";

const instance = axios.create({
  baseURL: "https://readme-generator-j37b.onrender.com",
  withCredentials: true
});

export default instance;
