import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Modal, Form, Card, ButtonGroup, ToggleButton, Container, Row, Col } from 'react-bootstrap';
import withAdminRole from '../Privateroute2';
import { Link } from 'react-router-dom';

const DeliveryDashboard = () => {
  const jwt = JSON.parse(localStorage.getItem('jwt'));
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);
  const [radioStatusValue, setRadioStatusValue] = useState('');

  useEffect(() => {
    // Pobranie zamówień
    fetch('admin/getAllOrders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Posortowanie zamówień po dacie (najnowsze na początku)
        const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        // Filtrowanie zamówień o wybranych statusach
        const filteredOrders = sortedOrders.filter((order) =>
          ['W DOSTAWIE', 'ANULOWANE', 'DOSTARCZONE', 'OCZEKIWANIE NA DOSTAWE'].includes(order.orderStatus)
        );
        setOrders(filteredOrders);
        console.log(filteredOrders);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleOpenModal = (order) => {
    setModalOrder(order);
    console.log(modalOrder);
    setRadioStatusValue(order.orderStatus);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOrderChangeStatus = (orderId) => {
    fetch(`order/changeOrderStatus/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        orderStatus: radioStatusValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.href = 'deliverydashboard';
      })
      .catch((error) => console.error(error));
  };
    
  return (
    
    <Container>
      <h1 className="text-center">Delivery Dashboard</h1>
      <div className="d-flex justify-content-center mb-3">
        <Link to="/" className="btn btn-outline-secondary w-10 mb-2 bg-dark">
          Powrót
        </Link>
      </div>
      <div>
        <br />
      </div>

      <Table striped bordered responsive>
        <thead>
          <tr>
            <th className="text-center">ID zamówienia</th>
            <th className="text-center">Nazwa użytkownika</th>
            <th className="text-center">Status</th>
            <th className="text-center">Data zamówienia</th>
            <th className="text-center">Akcja</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td className="text-center">{order.orderId}</td>
              <td className="text-center">{order.user.username}</td>
              <td className="text-center">
                <Badge variant="secondary">{order.orderStatus}</Badge>
              </td>
              <td className="text-center">{order.orderDate}</td>
              <td className="text-center">
                <Button className="text-center" variant="btn btn-outline-secondary w-30 mb-2 bg-dark" onClick={() => handleOpenModal(order)}>
                  Pokaż
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        
      </Table>
            
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Zmień status zamówienia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
        <p>
          Adres: {modalOrder && modalOrder.address ? modalOrder.address.city + ', '+ modalOrder.address.street + ', '+ modalOrder.address.buildingNo + ', '+ modalOrder.address.pincode
        : 'brak adresu'}
        </p>
          <Form.Group>
            <Form.Label>Status:</Form.Label>
            <Form.Control as="select" value={radioStatusValue} onChange={(e) => setRadioStatusValue(e.target.value)}>
              <option value="W DOSTAWIE">W Dostawie</option>
              <option value="ANULOWANE">Anulowane</option>
              <option value="DOSTARCZONE">Dostarczone</option>
              <option value="OCZEKIWANIE NA DOSTAWE">Oczekiwanie na dostawę</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Zamknij
          </Button>
          <Button variant="success" onClick={() => handleOrderChangeStatus(modalOrder.orderId)}>
            Zapisz zmiany
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeliveryDashboard;