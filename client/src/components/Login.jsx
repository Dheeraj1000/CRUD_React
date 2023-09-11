import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate} from 'react-router-dom';
import styled from 'styled-components'
import Dashboard from './Dashboard';



const MainContainer = styled.div`
  min-height: 100vh;
  background-image: url('https://w.forfun.com/fetch/e4/e4897e8c45c8d34f22ff176660a1ae58.jpeg');
  background-size: cover;
  background-position: center;

`;


const LoginContainer = styled.div `
  max-width: 400px;
  margin:  auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`
const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-bottom: 30px;
  margin-top: 10px;
`;


const SuccessMessage = styled.p`
  color: green;
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
  margin: 50px auto 0;
`;

const AlreadyLogin = styled.span`
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  margin-left: 40px;
`;



const Login = ({onLoginSuccess}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userError, setuserError] = useState('');
  const [passwordError, setpasswordError] = useState('');
  const [loginSuccess, setloginSuccess] = useState(false);
  const [loginError,setLoginError]=useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      console.log(response.data);
      localStorage.setItem('jwt', response.data.token);
      localStorage.setItem('userid', response.data.userId)
      localStorage.setItem('role', response.data.role)
      const role = response.data.role
      setloginSuccess(true);
      onLoginSuccess = true;
      if(role===1){
        navigate("/admin/dashboard")
      }
      else{
        navigate("/homepage")
      }

    } catch (error) {
      console.error(error);
      setLoginError('Invalid username or password');
    }

    let isValid = true;
    if(!username){
      isValid=false;
      setuserError('User Name is required')
    }
    
    if (!password) {
      setpasswordError('Password is required');
      isValid = false;
    } else {
      setpasswordError('');
    }

    if (!isValid) {
      return;
    }
  };

  return (
    <MainContainer>
    <LoginContainer>
      <Title>Login</Title>
      <Form onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
                  {userError && <span>{userError}</span>}
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
            {passwordError && <span>{passwordError}</span>}
        <Button type="submit">Login</Button>
      </Form>
      {loginSuccess && <SuccessMessage>Login successful!</SuccessMessage>}
      {loginError && <div style={{ color: 'red', textAlign:'center', marginBottom: 19 }}>{loginError}</div>}
      <AlreadyLogin>
        Not a user? <Btn to="/register">Register Now!</Btn>
      </AlreadyLogin>
    </LoginContainer>
    </MainContainer>
  );
};

export default Login;