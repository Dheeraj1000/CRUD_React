import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PostItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
`;

const Image = styled.img`
  height: 100px;
  width: 100px;
  object-fit: cover;
`;

const PostDeleteButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const HomePage = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [postedData, setPostedData] = useState([]);

  useEffect(() => {
    fetchPostedData();
  }, []);

  const fetchPostedData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPostedData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDescription('');
      setImage(null);
      fetchPostedData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (postId) => {
      try{
        await axios.delete(`http://localhost:5000/api/post/${postId}`);
        fetchPostedData();
      }
      catch(error){
        console.log(error);
      }
  }

  return (
    <Container>
      <Title>HomePage</Title>
      <Link to="/dashboard">
        <Button>Dashboard</Button>
      </Link>
      <FormContainer>
        <h2>Create Post</h2>
        <PostForm onSubmit={handleSubmit}>
          <Input
            type="text"
            value={description}
            onChange={handleDescription}
            placeholder="Enter description"
          />
          <Input type="file" accept="image/*" onChange={handleImage} />
          <Button type="submit">POST</Button>
        </PostForm>
      </FormContainer>
      <div>
        <h2>Posted Data</h2>
        <PostList>
          {postedData.map((item, index) => (
            <PostItem key={index}>
              <p>Description: {item.description}</p>
              <Image src={`http://localhost:5000/${item.imagePath}`} alt="/" />
              <PostDeleteButton onClick={() => handleDelete(item._id)}>Delete</PostDeleteButton>
            </PostItem>
          ))}
        </PostList>
      </div>
    </Container>
  );
};

export default HomePage;
