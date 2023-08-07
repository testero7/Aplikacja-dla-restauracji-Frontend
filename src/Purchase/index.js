import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Card, Container, Row, Col } from 'react-bootstrap';

function Purchase() {
  const [products, setProducts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const jwt = JSON.parse(localStorage.getItem('jwt'));

  const [city, setCity] = useState('');
  const [street, setState] = useState('');
  const [building_no, setBuilding_no] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState({});

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setLoggedIn(true);
      getCurrentUser(jwt);
    }
    fetch('User/getAllProduct')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  }, []);

  const handlePlaceOrder = () => {
    const userId = currentUser.userId;
    console.log(userId);

    if (!city || !street || !building_no || !country || !zipCode) {
      alert('Proszę wypełnić wszystkie pola');
      return;
    }

    fetch(`order/orderProduct/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        city: city,
        street: street,
        buildingNo: building_no,
        country: country,
        pincode: zipCode,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.href = 'dashboard';
      })
      .catch((error) => console.error(error));
  };

  const getCurrentUser = () => {
    fetch('current-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: jwt }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data);
        if (data.userId) {
          getCartProducts(data.userId);
        }
      })
      .catch((error) => console.error(error));
  };

  const getCartProducts = (userId) => {
    fetch(`User/getAllProductAddedInCart/${userId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching cart products');
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          console.log('Cart is empty');
        }
        setCartProducts(data);
      })
      .catch((error) => {
        console.error(error);
        console.log('Cart is empty');
        console.log(cartProducts.length);
        setCartProducts([]);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
  setShowModal(true);
  };
  
  const handleGoBack = () => {
  window.location.href = '/';
  };
  
  const calculateTotalPrice = () => {
  let totalPrice = 0;
  cartProducts.forEach((product) => {
  totalPrice += product.price * product.quantity;
  });
  return totalPrice;
  };

    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
  <Card style={{ width: '500px', backgroundColor: 'gray', color: 'white', padding: '20px' }}>
    <Card.Body>
      <h2>Twoje zamówienie</h2>
      <hr></hr>
      {cartProducts.length > 0 ? (
        <div>
          {cartProducts.map((product) => (
            <div key={product.id} style={{ marginBottom: '10px' }}>
              <Row>
                <Col xs={3}>
                  <img src={product.imagePath} alt={product.productName} width="50" />
                </Col>
                <Col xs={6}>
                  <div>
                    <h5>{product.productName}</h5>
                    <p>{product.quantity}</p>
                  </div>
                </Col>
                <Col xs={3}>
                  <p>{product.price * product.quantity} zł</p>
                </Col>
              </Row>
              <hr /> {/* Dodany separator produktów */}
            </div>
          ))}
          <p>Łączna cena zamówienia: {calculateTotalPrice()} zł</p>
        </div>
      ) : (
        <p>Koszyk jest pusty</p>
      )}

      <Button className="btn btn-outline-secondary mb-2 bg-dark" onClick={handleShowModal}>
        Zamów
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Formularz zamówienia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Miasto</Form.Label>
              <Form.Control
                type="text"
                id="city"
                name="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Ulica</Form.Label>
              <Form.Control
                type="text"
                id="street"
                name="street"
                required
                value={street}
                onChange={(e) => setState(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Nr budynku</Form.Label>
              <Form.Control
                type="number"
                id="building_no"
                name="building_no"
                required
                value={building_no}
                onChange={(e) => setBuilding_no(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Kraj</Form.Label>
              <Form.Control
                type="text"
                id="country"
                name="country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Kod pocztowy</Form.Label>
              <Form.Control
                type="text"
                id="zipCode"
                name="zipCode"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-danger mb-2" variant="danger" onClick={handleCloseModal}>
            Anuluj
          </Button>
          <Button variant="success" className="btn mb-2" onClick={handlePlaceOrder}>
Zamów
</Button>
</Modal.Footer>
</Modal>
<Button className="btn btn-outline-secondary mb-2 bg-dark" onClick={handleGoBack}>
Powrót
</Button>
</Card.Body>
</Card>
</Container>
    );
}
export default Purchase;