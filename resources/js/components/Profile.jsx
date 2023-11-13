import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form } from 'react-bootstrap';

function Profile() {
  const userId = sessionStorage.getItem('id');
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost/Proyecto_biblioteca/public/api/user_show/${userId}`);
        setUserData(response.data);
        setEditedUserData(response.data);
      } catch (error) {
        console.error('Error obtaining user information:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setUserData(editedUserData);
      setIsEditing(false);

      await axios.post(
        `http://localhost/Proyecto_biblioteca/public/api/user_update/${userId}`,
        editedUserData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );

      console.log('User information updated successfully');
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  const handleCancel = () => {
    setEditedUserData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditedUserData({
      ...editedUserData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container>
      <h1>User Profile</h1>
      {userData && !isEditing ? (
        <Card>
          <Card.Body>
            <Card.Title>{userData.name}</Card.Title>
            <Card.Text>
              <strong>Email:</strong> {userData.email} <br/>
              <strong>Address:</strong> {userData.address}<br/>
              <strong>Phone Number:</strong> {userData.phone_number}
            </Card.Text>
            <Button variant="primary" onClick={handleEdit}>
              Edit
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={editedUserData ? editedUserData.name : ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={editedUserData ? editedUserData.email : ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Adrress</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={editedUserData ? editedUserData.address : ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="num"
              name="phone_number"
              value={editedUserData ? editedUserData.phone_number : ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Form>
      )}
    </Container>
  );
}

export default Profile;
