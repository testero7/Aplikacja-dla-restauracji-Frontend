import React, { useState, useEffect } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";

import { Table, Badge,Button, Col, Row, Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
const Dashboard = () => {
  console.log('Udało się zalogować!');
  const [products, setProducts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const jwt = JSON.parse(localStorage.getItem('jwt'));

  //console.log(currentUser.address);

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

  useEffect(() => {
    const userId = currentUser?.userId;
  
    if (userId) {
      fetch(`User/getAllOrdersByUser/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setOrders(data))
        .catch((error) => console.error(error));
    }
  }, [currentUser]);

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
      })
      .catch((error) => console.error(error));
  };

  const sortedOrders = Array.isArray(orders)
    ? orders.sort((a, b) => {
        // Sortowanie według daty zamówienia (od najnowszych)
        const dateComparison = new Date(b.orderDate) - new Date(a.orderDate);
        if (dateComparison !== 0) {
          return dateComparison;
        }

        // Jeśli daty są takie same, sortowanie według statusu zamówienia
        if (a.orderStatus === 'ANULOWANE' && b.orderStatus !== 'ANULOWANE') {
          return 1;
        } else if (a.orderStatus !== 'ANULOWANE' && b.orderStatus === 'ANULOWANE') {
          return -1;
        } else {
          return 0;
        }
      })
    : [];

  return (
    <div className="App">
      <Container className="App">
        <Row className="mt-4">
          <Col>
            <h1>Dashboard</h1>
          </Col>
          <Col className="text-end">
            <Link to="/" className="btn btn-outline-secondary mb-2 bg-dark">
              <i className="bi bi-house-fill me-2"></i>Powrót
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Twoje zamówienia:</h2>
            {sortedOrders.length > 0 && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Numer zamówienia</th>
                    <th>Data zamówienia</th>
                    <th>Status zamówienia</th>
                    <th>Produkty</th>
                    <th>Cena całkowita</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.orderDate}</td>
                      <td>
                        <Badge
                          variant={
                            order.orderStatus === 'ANULOWANE' ? 'danger' : order.orderStatus === 'DOSTARCZONE' ? 'success' : 'primary'
                          }
                        >
                          {order.orderStatus}
                        </Badge>
                      </td>
                      <td>
                        <Table striped bordered>
                          <thead>
                            <tr>
                              <th>Nazwa produktu</th>
                              <th>Cena</th>
                              <th>Ilość</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products.map((product) => (
                              <tr key={product.productId}>
                                <td>{product.productName}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </td>
                      <td>
                        {order.products.reduce((acc, product) => acc + product.price * product.quantity, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            {sortedOrders.length === 0 && <p>Brak zamówień</p>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;