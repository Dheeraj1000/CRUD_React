import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {FaEdit} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('https://png.pngtree.com/thumb_back/fh260/background/20200710/pngtree-soft-cool-and-warm-contrast-gradient-background-image_351658.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
`;


const DashboardContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid black;
  border-radius: 4px;
  margin-top:10px;
  
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const UserDataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const UserDataItem = styled.tr`
  border: 1.5px solid black;
`;

const UserDataHeader = styled.th`
  padding: 10px;
`;

const UserDataCell = styled.td`
  padding: 10px;
  
`;

const EditButtonContainer = styled.div`
  display: flex;
  align-items: center;
  text-align:center;
`;

const EditButton = styled.button`
  background-color: red;
  border: 2px solid black;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  padding: 8px 16px;
  color: black;
  width : 50px;
  height:30px;
  display: flex; 
  justify-content: center;
  align-items: center;
`;

const EditIcon = styled(FaEdit)`
  margin-right: 5px;
  font-size: 18px;
  margin-left: 5px;
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
margin-top:20px;
margin-left:120px;

`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  border: 1px solid black;
  border-radius: 5px;
  max-width: 300px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const Btn = styled.button`
padding: 8px 16px;
font-size: 16px;
background-color: black;
color: #fff;
border: none;
border-radius: 25px;
cursor: pointer;
margin-right: 10px;

&:last-child {
  margin-right: 0;
}
`
const ProfileImage = styled.img`
  height: 100px;
  width: 70px;
  border-radius: 10%;
`;



const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [logout,setLogout] = useState(false);
  const [editMode,seteditMode]=useState(false);
  const [editedUsername,seteditedUsername]=useState(false);
  const [editedEmail,seteditedEmail]=useState(false);
  const [editedmobileNumber,seteditedmobileNumber]=useState(false);
  const [editedAddress,seteditedAddress]=useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const userId = localStorage.getItem('userid');

    if (!token || !userId) {
      console.error('No token');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        console.log(response.data)
        seteditedUsername(response.data.username);
        seteditedEmail(response.data.email);
        seteditedmobileNumber(response.data.mobileNumber);
        seteditedAddress(response.data.address);
        setNewProfileImage(response.data.profileImage)
        //console.log(response)
      
      } catch (error) {
        console.error('Error', error);
      }
    };


    fetchUserData();
  }, []);

  const handleSaveEdit = async () => {

      try{
        const userId = localStorage.getItem('userid');
        const token = localStorage.getItem('jwt');
        const formData = new FormData();
        formData.append('username', editedUsername);
        formData.append('email', editedEmail);
        formData.append('mobileNumber', editedmobileNumber);
        formData.append('address', editedAddress);
        formData.append('newProfileImage', newProfileImage);
    
        await axios.put(`http://localhost:5000/api/users/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', 
          },
        });

        setUserData({
          ...userData,
          username: editedUsername,
          email: editedEmail,
          mobileNumber: editedmobileNumber,
          address: editedAddress,
          profileImage: newProfileImage
        });
        seteditMode(false);
      }
      catch(error){
        console.log(error)
      }

  }

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setNewProfileImage(imageFile);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userid');
    setLogout(true)
    
    navigate("/")
  }

  const handleCancel = () => {
    seteditMode(false);
    seteditedUsername(userData.username);
    seteditedEmail(userData.email);
    seteditedmobileNumber(userData.mobileNumber);
    seteditedAddress(userData.address);
  }


  return (
    <MainContainer>
    <DashboardContainer>
      {editMode ? (<>
        <Form>
      <FormGroup>
        <Label>Username:</Label>
        <Input type='text' value={editedUsername} onChange={(e) => seteditedUsername(e.target.value)} />
      </FormGroup>
      <FormGroup>
        <Label>Email:</Label>
        <Input type='email' value={editedEmail} onChange={(e) => seteditedEmail(e.target.value)} />
      </FormGroup>
      <FormGroup>
        <Label>Mobile Number:</Label>
        <Input type='text' value={editedmobileNumber} onChange={(e) => seteditedmobileNumber(e.target.value)} />
      </FormGroup>
      <FormGroup>
        <Label>Address:</Label>
        <Input type='text' value={editedAddress} onChange={(e) => seteditedAddress(e.target.value)} />
      </FormGroup>
      <FormGroup>
                <Label>Profile Image:</Label>
                <Input type="file" accept='image/*' onChange={handleImageChange} />
      </FormGroup>
      <div>
        <Btn onClick={handleSaveEdit}>Update</Btn>
        <Btn onClick={handleCancel}>Cancel</Btn>
      </div>
    </Form>
      </>
           
      ): (
      <>
        <Title>Dashboard   Hello: "{userData.username}"</Title>
           <UserDataTable>
             <UserDataItem>
               <UserDataHeader>Username</UserDataHeader>
               <UserDataCell>{userData.username}</UserDataCell>
               <UserDataCell>
                <EditButtonContainer>
                <EditButton onClick={() => seteditMode(true)}>
                 Edit
                 </EditButton>
                 <EditIcon /> 
                </EditButtonContainer>
                 
               </UserDataCell>
             </UserDataItem>
             <UserDataItem>
               <UserDataHeader>Email</UserDataHeader>
               <UserDataCell>{userData.email}</UserDataCell>
               <UserDataCell>
               <EditButtonContainer>
               <EditButton onClick={() => seteditMode(true)}>
                 Edit
                 </EditButton>
                 <EditIcon/>
               </EditButtonContainer>
               </UserDataCell>
             </UserDataItem>
             <UserDataItem>
               <UserDataHeader>Mobile Number</UserDataHeader>
               <UserDataCell>{userData.mobileNumber}</UserDataCell>
               <UserDataCell>
               <EditButtonContainer>
               <EditButton onClick={() => seteditMode(true)}>
                 Edit
                 </EditButton>
                 <EditIcon/>
               </EditButtonContainer>
                
               </UserDataCell>
             </UserDataItem>
             <UserDataItem>
               <UserDataHeader>Address</UserDataHeader>
               <UserDataCell>{userData.address}</UserDataCell>
               <UserDataCell>
               <EditButtonContainer>
               <EditButton onClick={() => seteditMode(true)}>
                 Edit
                 </EditButton>
                 <EditIcon/>
               </EditButtonContainer>
               </UserDataCell>
             </UserDataItem>
             <UserDataItem>
               <UserDataHeader>Profile</UserDataHeader>
               
               <UserDataCell>
               <ProfileImage
  src={`http://localhost:5000/uploads/${userData.profileImage}?${Date.now()}`}
  alt={userData.username}
/>
            </UserDataCell>
    
               <UserDataCell>
               <EditButtonContainer>
               <EditButton onClick={() => seteditMode(true)}>
                 Edit
                 </EditButton>
                 <EditIcon/>
               </EditButtonContainer>
               </UserDataCell>
             </UserDataItem>
           </UserDataTable>

      </>)}
   
      <Button onClick={handleLogout}>Logout</Button>
    </DashboardContainer>
    </MainContainer>
  );
};

export default Dashboard;
