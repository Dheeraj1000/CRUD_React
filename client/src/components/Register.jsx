import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';


const MainContainer = styled.div`
  min-height: 100vh;
  background-image: url('https://w.forfun.com/fetch/e4/e4897e8c45c8d34f22ff176660a1ae58.jpeg');
  background-size: cover;
  background-position: center;

`;

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
 
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  margin: 0 auto;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.p`
  color: green;
  margin-top: 10px;
`;

const Btn = styled(Link)`
  width: 120px;
  padding: 8px 16px;
  font-size: 16px;
  background-color: black;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 25px;
  border: 2px solid black;
  text-decoration: none;
  text-align: center;
  margin: 20px auto 0;
`;

const AlreadyLogin = styled.span`
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  margin-left: 40px;
`;

const Register = () => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [email, setemail] = useState('');
  const [mobileNumber, setmobileNumber] = useState('');
  const [address, setaddress] = useState('');
  const [registerSuccess, setregisterSuccess] = useState(false);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('mobileNumber', mobileNumber);
    formData.append('address', address);
    formData.append('profileImage', profileImage);
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData, {
        headers : {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log(response.data.message);
      setusername('');
      setemail('');
      setpassword('');
      setmobileNumber('');
      setaddress('');
      setProfileImage(null);
      setregisterSuccess(true);
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainContainer>
    <RegisterContainer>
      <Title>Register</Title>
      <Form onSubmit={handleRegister}>
        <Input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <Input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setmobileNumber(e.target.value)}
        />
        <Input
          type="text"
          placeholder="address"
          value={address}
          onChange={(e) => setaddress(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*" onChange={handleImageChange}
        />
        <Button type="submit">Register</Button>
      </Form>
      {registerSuccess && <SuccessMessage>Register Success</SuccessMessage>}
      <AlreadyLogin>
        Already a user? <Btn to="/login">Login!</Btn>
      </AlreadyLogin>
    </RegisterContainer>
    </MainContainer>
  );
};

export default Register;
