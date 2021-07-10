import axios from 'axios';
 
const service = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});
export default service;

function signup(username, password) {
    return service.post('/signup', {username, password}).then(response => response.data)
  }
  export {signup}