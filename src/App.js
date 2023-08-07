import { useEffect } from 'react';
import './App.css';
import { useLocalState } from './util/useLocalStorage';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Homepage from './Homepage';
import Login from './Login';
import Privateroute from './Privateroute';
import Purchase from './Purchase';
import AdminDashboard from './AdminDashboard';
import ChefDashboard from './ChefDashboard';
import DeliveryDashboard from './DeliveryDashboard';
function App() {
  
  const [jwt, setJwt] = useLocalState("","jwt");
  
  

  // useEffect(()=>{
  //   console.log(`Otrzymalismy JWT: ${jwt}`)
  // },[jwt]);

  return (
    <Routes>
      <Route path="/dashboard" element={
        <Privateroute><Dashboard/></Privateroute>
      } 
      />
      <Route path="/purchase" element={
        <Privateroute><Purchase/></Privateroute>
      } 
      />
      <Route path="/admindashboard" element={
        <Privateroute><AdminDashboard/></Privateroute>
      } 
      
      />
      <Route path="/chefdashboard" element={
        <Privateroute><ChefDashboard/></Privateroute>
      } 
      
      />
      <Route path="/deliverydashboard" element={
        <Privateroute><DeliveryDashboard/></Privateroute>
      } 
      
      />
      <Route
       path="/" 
       element={<Homepage></Homepage>}
      />
      <Route
       path="/login" 
       element={<Login></Login>}
      />
    </Routes>
  );
}

export default App;
