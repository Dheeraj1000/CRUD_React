import { GoogleLogin, GoogleOAuthProvider, googleLogout} from '@react-oauth/google';
import React from 'react';
import { Link , useNavigate} from 'react-router-dom';
import Google from './Google';
import styled, { keyframes } from 'styled-components';


const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('https://wallpaper-house.com/data/out/4/wallpaper2you_29656.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled(Link)`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  margin: 300px;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  animation: ${fadeIn} 0.5s ease;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Main = () => {
  const navigate = useNavigate();
  return (
    <MainContainer>
      <ButtonContainer>
        <Button to="/login">LOGIN</Button>
        <Button to="/register">REGISTER</Button>
        
      </ButtonContainer>
      <GoogleOAuthProvider clientId='254887378744-brdkvj2peunkqi15ve0bj5nevpmh9mjc.apps.googleusercontent.com'>
        <GoogleLogin
            onSuccess={credentialResponse => {
              <Google/>
              navigate('/homepage')
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
          </GoogleOAuthProvider>
          
    </MainContainer>
    
  );
};

export default Main;
