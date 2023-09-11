import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {FaTrash} from 'react-icons/fa'
import { Navigate, useNavigate } from 'react-router-dom';
import bgImg from '../assets/background.jpg'

const TableContainer = styled.div`
 
  display: flex; 
  flex-direction: column; 
  align-items: center;
  background-image: url('https://wallpaperaccess.com/full/449903.jpg'); 
  background-size: cover;
  background-position: center;
  min-height: 100vh;
`;

const Table = styled.table`
  width: 70%;
  border-collapse: collapse;
  align-items:center;
  text-align:center;
`;

const TableHead = styled.th`
  padding: 12px;
  border: 1px solid black;
  background-color: grey;
`;

const TableRow = styled.tr`
   {
    background-color: grey;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border: 1px solid black;
`;
const EditButtonContainer = styled.div`
  display: flex;
  align-items: center;
  text-align:center;
`;

const EditIcon = styled(FaTrash)`
  margin-right: 5px;
  margin-top:7px;
`;

const EditButton = styled.button`
  background-color: red;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right:7px;
`;

const Button = styled.button`
width: 120px;
padding: 8px 16px;
font-size: 16px;
background-color: black;
color: #fff;
border: none;
cursor: pointer;
border-radius: 25px;
border: 2px solid black;
margin-top:30px;
margin-left: 150px;

`;


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error', error);
      }
    };
    fetchUsers();
  }, []);

  const handledeleteUsers = async (userId) => {
    try{
      const token = localStorage.getItem('jwt');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUsers((previousUser) => previousUser.filter((user) => user._id != userId ))
    }
    catch(error){
      console.log(error)
    }
  }
  
  const handleLogout = () => { 
    localStorage.removeItem('jwt');
    localStorage.removeItem('userid');
   
    navigate("/")
  }

  return (
    
    <TableContainer>
      
    <div>
      <h2>Welcome to the Admin Dashboard</h2>
      <h3>All Users:</h3>
      
        <Table>
            <thead>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>NAME</TableHead>
                    <TableHead>EMAIL</TableHead>
                    <TableHead>MOBILE NUMBER</TableHead>
                    <TableHead>ADDRESS</TableHead>
                    <TableHead>DELETE</TableHead>
                </TableRow> 
            </thead>
            <tbody>
                    {users.map((item, index) => (
                    <TableRow key={item._id}>
                        <TableCell>{index +1}</TableCell>
                        <TableCell>{item.username}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.mobileNumber}</TableCell>
                        <TableCell>{item.address}</TableCell>
                        <TableCell> 
                           <EditButtonContainer>
                           <EditButton onClick={() => handledeleteUsers(item._id)}>
                         DELETE
                        </EditButton>
                        <EditIcon/>
                           </EditButtonContainer>
                        </TableCell>
                    </TableRow>
                       
                    ))}
            </tbody>
        </Table>
     
     <Button onClick={handleLogout}>Logout</Button>
    </div>
    </TableContainer>
  );
};

export default AdminDashboard;