import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Card_C from './Card_C';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {Stack, Spinner, Container, Row, Button, Form, Col} from 'react-bootstrap';
import Menu from './Menu';
import AddBookForm from './AddBookForm';

function ListCards() {
  
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const id_rol = sessionStorage.getItem("id_rol");
  
  const [bookData, setBookData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editorialFilter, setEditorialFilter] = useState('');
  const [editionFilter, setEditionFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('')
  useEffect(()=>{
    if (!token) {
      navigate("/Proyecto_biblioteca/public/login");
      return; 
    }

    const getBooks = async() =>{
      await axios.get("http://localhost/Proyecto_biblioteca/public/api/book_index")
      .then(function (response) {
        // manejar respuesta exitosa
        console.log(bookData);
        setBookData(response.data);
      })
      .catch(function (error) {
        // manejar error
        console.log(error);
      })
      .finally(function () {
        // siempre sera executado
      }); 
    }
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost/Proyecto_biblioteca/public/api/category_index');
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
    getBooks()
  },[token, navigate])

  const handleAddBookClick = () => {
    navigate('/Proyecto_biblioteca/public/AddBook');
  };

  if (!bookData.length) return (
    <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      )
  const filteredBooks = bookData.filter((book) => {
    return (
      (categoryFilter === '' || book.id_category.toString() === categoryFilter) &&
      (editorialFilter === '' || book.editorial.toLowerCase().includes(editorialFilter.toLowerCase())) &&
      (editionFilter === '' || book.edition.toLowerCase().includes(editionFilter.toLowerCase())) &&
      (titleFilter === '' || book.title.toLowerCase().includes(titleFilter.toLowerCase()))
    );
  });
  return (
    <>
    <Container >
    <Form className="form-inline">
          <Row>
            <Col md={3} className="mb-2">
              <Form.Group controlId="formCategoryFilter">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" size="sm" onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="">All</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

            <Col md={3} className="mb-2">
              <Form.Group controlId="formEditorialFilter">
                <Form.Label>Editorial</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter editorial"
                  size="sm"
                  onChange={(e) => setEditorialFilter(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={3} className="mb-2">
              <Form.Group controlId="formEditionFilter">
                <Form.Label>Edition</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter edition"
                  size="sm"
                  onChange={(e) => setEditionFilter(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={3} className="mb-2">
              <Form.Group controlId="formTitleFilter">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  size="sm"
                  onChange={(e) => setTitleFilter(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <hr/>
        {id_rol === '1' && (
        <Button variant="primary" style={{ backgroundColor: 'green', color: 'white' }} onClick={handleAddBookClick}>
          Add Book
        </Button>
      )}
      <Row>
      {filteredBooks.map((book) => (
        <Card_C key={book.id}
          id={book.id}
          title={book.title} 
          author={book.author}
          isbn={book.isbn}
          publication_year= {book.publication_year}
          available_copies= {book.available_copies}
          id_category= {book.id_category}
          editorial= {book.editorial}
          edition= {book.edition}
        />
      ))}
      </Row>
    </Container>
    </>
    
  );
  
}


export default ListCards;
