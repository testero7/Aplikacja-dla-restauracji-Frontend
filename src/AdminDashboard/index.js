import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Table, Button,Badge,Image, Card, ListGroup, ButtonGroup, ToggleButton,Container,Row, Col, Form } from 'react-bootstrap';
const AdminDashboard = () => {

  const [radioValue, setRadioValue] = useState('USER');

  const radios = [
    { name: 'USER', value: 'USER' },
    { name: 'CHEF', value: 'CHEF' },
    { name: 'DELIVERY', value: 'DELIVERY' },
    { name: 'ADMIN', value: 'ADMIN' },
  ];
  const handleSubmit = (event) => {
    event.preventDefault();

    // Walidacja pól
    if (
      !imagePath ||
      !productName ||
      !price ||
      !specification ||
      !quantity ||
      !categoryName
    ) {
      alert('Proszę wypełnić wszystkie pola.');
      return;
    }

    handleAddNewProduct();
  };

  const [radioStatusValue, setRadioStatusValue] = useState('ZATWIERDZONE');

  const radioOrder = [
    { name: 'ZATWIERDZONE', value: 'ZATWIERDZONE' },
    { name: 'PRZYGOTOWYWANE', value: 'PRZYGOTOWYWANE' },
    { name: 'OCZEKIWANIE NA DOSTAWE', value: 'OCZEKIWANIE NA DOSTAWE' },
    { name: 'W DOSTAWIE', value: 'W DOSTAWIE' },
    { name: 'DOSTARCZONE', value: 'DOSTARCZONE' },
  ];



  const [selectedProduct, setSelectedProduct] = useState("");
  const [currentProduct, setCurrentProduct] = useState("");
  
  const [selectedUser, setSelectedUser] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  const [selectedOrder, setSelectedOrder] = useState("");
  const [currentOrder, setCurrentOrder] = useState("");

  const [imagePath, setImagePath] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [specification, setSpecification] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");



  const [productId, setProductId] = useState('');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loggedInUsers, setLoggedInUsers] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const jwt = JSON.parse(localStorage.getItem(`jwt`));


  useEffect(() => {
    if (selectedProduct) {
      setImagePath(selectedProduct.imagePath);
      setProductName(selectedProduct.productName);
      setPrice(selectedProduct.price);
      setSpecification(selectedProduct.specification);
      setQuantity(selectedProduct.quantity);
      setCategoryName(selectedProduct.categoryName);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedUser) {
      setUsername(selectedUser.username);
      setMobileNumber(selectedUser.mobileNumber);
      setPassword(selectedUser.password);
      setEmail(selectedUser.email);
      setRole(selectedUser.role);

    }
  }, [selectedUser]);

  useEffect(() => {
    const jwt = localStorage.getItem(`jwt`);
    fetch('User/getAllProduct')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
  }
  const handleEditUserClick = (user) => {
    setSelectedUser(user);
  }
  const handleChangeUserRoleClick = (user) => {
    setSelectedUser(user);
    setRadioValue(user.role);
  }
  const handleDeleteUserClick = (user) => {
    setSelectedUser(user);
    handleDeleteUser(user.userId);
  }
  
  const handleDeleteProductClick = (product) => {
    setSelectedProduct(product);
    handleDeleteProduct(product.productId);
  }
  const handleViewProductClick = (product) => {
    setSelectedProduct(product);
    handleViewProduct(product.productId);
  }

  const handleViewUserClick = (user) => {
    setSelectedUser(user);
    handleViewUser(user.userId);
  }

  const handleDeleteOrderClick = (order) => {
    setSelectedOrder(order);
    handleDeleteOrder(order.orderId);
  }
  const handleChangeOrderStatusClick = (order) => {
    setSelectedOrder(order);
    setRadioStatusValue(order.orderStatus);
  }
  const handleViewOrderClick = (order) => {
    setSelectedOrder(order);
    handleViewOrder(order.orderId);
  }

  const handleViewOrder = (orderId) => {
    fetch(`order/getOrderById/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          setSelectedTable('showOrderData');
          setCurrentOrder(data);
          
      })
      .catch((error) => console.error(error));
  }


  const handleOrderChangeStatus = (orderId) => {
    
    fetch(`order/changeOrderStatus/${orderId}`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify
        ({
          orderStatus:radioStatusValue
        })
    })
      .then((response) => response.json())
      .then((data) => {
        
          console.log(data)
         window.location.href = "admindashboard";
      })
      .catch((error) => console.error(error));
  }


  const handleDeleteOrder = (orderId) => {
    fetch(`User/cancelOrder/${orderId}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
     
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
          window.location.href = "/admindashboard";
          console.log("test");
      })
      .catch((error) => {
        console.error(error)
        window.location.href = "/admindashboard";
      });
  }
  const handleViewUser = (userId) => {
    fetch(`admin/viewById/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          setSelectedTable('showUserData');
          setCurrentUser(data);
          
      })
      .catch((error) => console.error(error));
  }


  //console.log(selectedUser);
  const handleUserChangeRole = (userId) => {
    fetch(`admin/changeUserRole/${userId}`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify
        ({
          role:radioValue
        }),
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
         window.location.href = "admindashboard";
      })
      .catch((error) => console.error(error));
  }

  const handleDeleteUser = (userId) => {
    fetch(`User/delete/${userId}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
     
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          window.location.href = "admindashboard";
      })
      .catch((error) => {
        console.error(error)
        window.location.href = "admindashboard";
      });
  }


  const handleEditUser = (userId) => {
    userId = selectedUser.userId;
      
    fetch(`User/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify
        ({
          username:username,
          mobileNumber:mobileNumber,
          password:password,
          email:email,
          role:role
        }),
      })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            window.location.href = "admindashboard";
        })
        .catch((error) => console.error(error));
    };

  const handleViewProduct = (productId) => {
    //productId = selectedProduct.productId;
    fetch(`admin/getProductById/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          setSelectedTable('showData');
          setCurrentProduct(data);
          
      })
      .catch((error) => console.error(error));
  }
  const handleAddNewProduct= () => {
    
      fetch(`product/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify
          ({
            imagePath:imagePath,
            productName:productName,
            price:price,
            specification:specification,
            quantity:quantity,
            categoryName:categoryName
          }),
          
        })
          .then((response) => response.json())
          .then((data) => {
              console.log(data)
              window.location.href = "admindashboard";
          })
          .catch((error) => console.error(error));
      };


  const handleButtonClick = (tableName) => {
    setSelectedTable(tableName);
    console.log(selectedTable);
    if(tableName==='users')
      fetch('admin/viewAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
          
        },

      })
        .then((response) => response.json())
        .then((data) => {
          setUsers(data);
          setSelectedTable(tableName);
        })
        .catch((error) => console.error(error));
        
    
     
    
    else if(tableName==='orders'){
      fetch('admin/getAllOrders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },

      })
        .then((response) => response.json())
        .then((data) => {
          setOrders(data);
          setSelectedTable(tableName);
        })
        .catch((error) => console.error(error));
    }
    else if(tableName==='products'){
      fetch('User/getAllProduct', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },

      })
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          setSelectedTable(tableName);
        })
        .catch((error) => console.error(error));
    }
    };

    const handleDeleteProduct = (productId) => {
      fetch(`admin/removeProduct/${productId}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
       
      })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            window.location.href = "admindashboard";
        })
        .catch((error) => {
          console.error(error)
          window.location.href = "admindashboard";
        });
    }
    
    const handleEditProduct= (productId) => {
      productId = selectedProduct.productId;
      
      fetch(`product/updateProduct/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify
          ({
            imagePath:imagePath,
            productName:productName,
            price:price,
            specification:specification,
            quantity:quantity,
            categoryName:categoryName
          }),
        })
          .then((response) => response.json())
          .then((data) => {
              console.log(data)

              window.location.href = "admindashboard";
          })
          .catch((error) => console.error(error));
      };
  

  const renderTable = () => {
    switch (selectedTable) {
      case 'orders':
        return (
          <div class="h-100 d-flex align-items-center justify-content-center">
            <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Data</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.orderId}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.orderStatus}</td>
                  <td>
                    <Button variant="outline-danger" size="sm" onClick={() => {
                    handleDeleteOrderClick(order);
                    console.log(order.orderId);
                  }}>Anuluj</Button>{' '}
                    <Button variant="outline-warning" size="sm" 
                    onClick={() => 
                      {
                      handleButtonClick('orderStatusChanger');
                      handleChangeOrderStatusClick(order);
                      }
                    }>Zmień status</Button>{' '}
                    <Button variant="outline-info" size="sm" onClick={() =>  handleViewOrderClick(order)}>Wyświetl</Button>
                  </td>
                </tr>
              ))) : (
                <p>Brak zamówień</p>
              )}
            </tbody>
          </Table>
          </div>
        );
        case 'showData':
  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <Card bg="dark" text="white" style={{ width: '18rem' }}>
        <Card.Img variant="top" src={currentProduct.imagePath} />
        <Card.Body>
          <Card.Title>{currentProduct.productName}</Card.Title>
          <Card.Text>{currentProduct.specification}</Card.Text>
        </Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>Cena: ${currentProduct.price}</ListGroup.Item>
          <ListGroup.Item>Ilość: {currentProduct.quantity}</ListGroup.Item>
          <ListGroup.Item>Kategoria: {currentProduct.category ? currentProduct.category.categoryName : "Brak kategorii"}</ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
          case 'showUserData':
            console.log(currentUser);
            return (
              <div className="h-100 d-flex align-items-center justify-content-center">
                <Card style={{ width: '18rem' }} bg="dark" text="white">
                  <Card.Img variant="top" src="https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Free-Download.png" />
                  <Card.Body>
                    <Card.Title>{currentUser.username}</Card.Title>
                    <Card.Text>{currentUser.role}</Card.Text>
                  </Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Email: {currentUser.email}</ListGroup.Item>
                    <ListGroup.Item>Telefon: {currentUser.mobileNumber}</ListGroup.Item>
                    <ListGroup.Item className="text-center" variant="secondary">Adres</ListGroup.Item>
                    <ListGroup variant="flush" className="bg-dark">
                      {currentUser.address ? (
                        <>
                          <ListGroup.Item>Miasto: {currentUser.address.city}</ListGroup.Item>
                          <ListGroup.Item>Państwo: {currentUser.address.country}</ListGroup.Item>
                          <ListGroup.Item>Numer budynku: {currentUser.address.buildingNo}</ListGroup.Item>
                          <ListGroup.Item>Kod pocztowy: {currentUser.address.pincode}</ListGroup.Item>
                          <ListGroup.Item>Ulica: {currentUser.address.street}</ListGroup.Item>
                        </>
                      ) : (
                        <ListGroup.Item>Brak adresu</ListGroup.Item>
                      )}
                    </ListGroup>
                  </ListGroup>
                </Card>
              </div>
            );
            case 'showOrderData':
              console.log(currentOrder);
            
              // Obliczanie ceny całego zamówienia
              const totalPrice = currentOrder.products.reduce((total, product) => {
                return total + product.price * product.quantity;
              }, 0);
            
              return (
                <Container fluid>
                  <h1 className="text-center mb-4">Dane zamówienia</h1>
                  <Table striped bordered variant="dark" className="mt-4">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Data zamówienia</th>
                        <th>Status</th>
                        <th>Zamówione produkty</th>
                        <th>Dane użytkownika</th>
                        <th>Adres</th>
                        <th>Cena całego zamówienia</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{currentOrder.orderId}</td>
                        <td>{currentOrder.orderDate}</td>
                        <td>
                          <Badge variant="primary">{currentOrder.orderStatus}</Badge>
                        </td>
                        
                        <td>
                        {currentOrder.products.length > 0 ? (
  <ul className="list-unstyled">
    {currentOrder.products.map((product, index) => (
      <React.Fragment key={product.productId}>
        <li className="d-flex align-items-center">
          <Image src={product.imagePath} alt={product.productName} thumbnail className="mr-2" style={{ maxWidth: "80px" }} />
          <div className="product-details" style={{ marginLeft: "10px" }}>
            <div>ProduktId: {product.productId}</div>
            <div>Nazwa produktu: {product.productName}</div>
            <div>Cena: ${product.price}</div>
            <div>Ilość: {product.quantity}</div>
          </div>
        </li>
        {index !== currentOrder.products.length - 1 && (
          <li className="product-divider"></li>
        )}
      </React.Fragment>
    ))}
  </ul>
) : (
  <p>Brak zamówionych produktów</p>
)}
                        </td>
                        <td>
                          {currentOrder.user ? (
                            <ul className="list-unstyled">
                              <li>E-mail: {currentOrder.user.email}</li>
                              <li>Telefon: {currentOrder.user.mobileNumber}</li>
                              <li>Nazwa użytkownika: {currentOrder.user.username}</li>
                            </ul>
                          ) : (
                            <p>Brak danych użytkownika</p>
                          )}
                        </td>
                        
                        <td>
                          {currentOrder.address && currentOrder.address.country !== null ? (
                            <ul className="list-unstyled">
                              <li>Miasto: {currentOrder.address.city}</li>
                              <li>Państwo: {currentOrder.address.country}</li>
                              <li>Numer budynku: {currentOrder.address.buildingNo}</li>
                              <li>Kod pocztowy: {currentOrder.address.pincode}</li>
                              <li>Ulica: {currentOrder.address.street}</li>
                            </ul>
                          ) : (
                            <p>Brak adresu</p>
                          )}
                        </td>
                        <td>${totalPrice}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Container>
              );
        case 'addProductForm':
          
          return (
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="imagePath">
              <Form.Label>Scieżka do obrazka</Form.Label>
              <Form.Control
                type="text"
                required
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
              />
              <br></br>
              {imagePath && (
          <img
            src={imagePath}
            alt="Podgląd obrazka"
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
        )}
            </Form.Group>
      
            <Form.Group controlId="productName">
              <Form.Label>Nazwa produktu</Form.Label>
              <Form.Control
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Form.Group>
      
            <Form.Group controlId="price">
              <Form.Label>Cena</Form.Label>
              <Form.Control
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
      
            <Form.Group controlId="specification">
              <Form.Label>Opis</Form.Label>
              <Form.Control
                type="text"
                required
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
              />
            </Form.Group>
      
            <Form.Group controlId="quantity">
              <Form.Label>Ilość</Form.Label>
              <Form.Control
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
      
            <Form.Group controlId="categoryName">
              <Form.Label>Kategoria</Form.Label>
              <Form.Control
                type="text"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Group>
      
            <Button variant="success mt-3" type="submit">
              Dodaj nowy produkt
            </Button>
          </Form>
        );
        case 'products':
        return (
       
          <div>
            <Button variant="outline-success" size="sm" onClick={() => {
              handleButtonClick('addProductForm')
              setImagePath("https://biggardenfurniture.com.au/wp-content/uploads/2018/08/img-placeholder.png");
              setProductName("");
              setPrice(null);
              setSpecification("");
              setQuantity(null);
              setCategoryName("");
              
              }}>Dodaj nowy produkt</Button>
          <Table>

            <thead>
              <tr>
                <th>#</th>
                <th>Zdjecie</th>
                <th>Cena</th>
                <th>Nazwa produktu</th>
                <th>Ilość</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={index}>
                  <td>{product.productId}</td>
                  <td><img src={product.imagePath} alt={product.productName} className="img-fluid" width="150" />
                  </td>
                  <td>{product.price}</td>
                  <td>{product.productName}</td>
                  <td>{product.quantity}</td>
                  <td>
                  <Button variant="outline-primary" size="sm"
                   onClick={() => 
                    {
                    handleButtonClick('editProductForm');
                    handleEditClick(product);
                    }
                  }>Edytuj</Button>{' '}
                  <Button variant="outline-danger" size="sm" onClick={() => {
                    handleDeleteProductClick(product);
                    console.log(product.productId);
                  }}>Usuń</Button>{' '}
                  <Button variant="outline-info"size="sm"onClick={() => handleViewProductClick(product)}>Wyswietl</Button>{' '}
                  </td>
                </tr>
              ))) : (
                <p>Brak produktów</p>
              )}
            </tbody>
            
          </Table>
          </div>
        );
        case 'editProductForm':
         console.log(selectedProduct);
          return (
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="imagePath">
              <Form.Label>Ścieżka do obrazka</Form.Label>
              <Form.Control
                type="text"
                required
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
              />
              {imagePath && (
                <img
                  src={imagePath}
                  alt="Podgląd obrazka"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              )}
            </Form.Group>
      
            <Form.Group controlId="productName">
              <Form.Label>Nazwa produktu</Form.Label>
              <Form.Control
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Form.Group>
      
            <Form.Group controlId="price">
              <Form.Label>Cena</Form.Label>
              <Form.Control
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
      
            <Form.Group controlId="specification">
              <Form.Label>Opis</Form.Label>
              <Form.Control
                type="text"
                required
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
              />
            </Form.Group>
      
            <Form.Group controlId="quantity">
              <Form.Label>Ilość</Form.Label>
              <Form.Control
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
      
            <Form.Group controlId="categoryName">
              <Form.Label>Kategoria</Form.Label>
              <Form.Control
                type="text"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Group>
      
            <Button variant="success mt-3" type="submit" onClick={() => handleEditProduct(products.productId)}>
              Edytuj produkt
            </Button>
          </Form>
        );
      case 'users':
        return (
            <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nazwa użytkownika</th>
                <th>Rola</th>
                <th>Email</th>
                <th>Akcje</th> {}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.userId}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" 
                    onClick={() =>{
                      handleButtonClick('editUserForm');
                      handleEditUserClick(user);
                      }}>
                        
                        Edytuj
                      </Button>{' '}
                    <Button variant="outline-danger" size="sm"
                    onClick={() =>{
                      handleDeleteUserClick(user);
                    console.log(user.userId);
                    }}>Usuń</Button>{' '}
                    <Button variant="outline-warning" size="sm" 
                    onClick={() => 
                      {
                      handleButtonClick('userRoleChanger');
                      handleChangeUserRoleClick(user);
                      }
                    }
                    >Zmień rolę</Button>{' '}
                    <Button variant="outline-info" size="sm" onClick={() =>  handleViewUserClick(user)}>Wyświetl</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
        );
        case 'editUserForm':
  console.log(selectedUser);
  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Numer telefonu</Form.Label>
          <Form.Control
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            required
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Hasło</Form.Label>
          <Form.Control
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Rola</Form.Label>
          <Form.Control
            type="text"
            id="role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </Form.Group>

        <Button variant="success mt-3" onClick={() => handleEditUser(users.userId)}>
          Edytuj użytkownika
        </Button>
      </Form>
    </div>
  );
         case 'userRoleChanger':
         console.log(selectedUser);
         
         console.log(radioValue);
         
         return (
          
          <Container>
      <Row className="justify-content-center align-items-center mt-5">
        <Card className="p-4" style={{ background:  'rgba(0, 0, 0, 0.2)', color: 'white' }}>
          <Card.Title className="text-center" style={{color: 'black' }}>Wybierz rolę dla użytkownika: {selectedUser.username}</Card.Title>
          <ButtonGroup className="d-flex justify-content-center">
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                name="radio"
                value={radio.value}
                checked={radioValue === radio.value}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <Button className="mt-4 btn-outline-secondary w-100 mb-2 bg-dark" onClick={() => handleUserChangeRole(selectedUser.userId)}>
            Zatwierdź wybór
          </Button>
        </Card>
      </Row>
    </Container>
        );
        case 'orderStatusChanger':
  console.log(selectedOrder.orderStatus);
  //setRadioStatusValue(selectedOrder.orderStatus);
  console.log(radioOrder);
  
  return (
    <Container>
      <Row className="justify-content-center align-items-center mt-5">
        <Card className="p-4" style={{ background:  'rgba(0, 0, 0, 0.2)', color: 'white' }}>
          <Card.Title className="text-center" style={{color: 'black' }}>Zmień status zamówienia dla id: {selectedOrder.orderId}</Card.Title>
          <ButtonGroup className="d-flex justify-content-center">
            {radioOrder.map((radioOrder, idx) => (
              <ToggleButton
                key={idx}
                id={`radioOrder-${idx}`}
                type="radio"
                variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                name="radioOrder"
                value={radioOrder.value}
                checked={radioStatusValue === radioOrder.value}
                onChange={(e) => setRadioStatusValue(e.currentTarget.value)}
              >
                {radioOrder.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <Button className="mt-4 btn-outline-secondary w-100 mb-2 bg-dark" onClick={() => handleOrderChangeStatus(selectedOrder.orderId)}>
            Zatwierdź wybór
          </Button>
        </Card>
      </Row>
    </Container>
  );
default:
  return null;
}};
return (
  <Container className="mt-4">
    <Row>
      <Col xs={12} md={8} lg={6} className=" mb-3 ">
        <h1>Admin Dashboard</h1>
      </Col>
      <Col xs={12} md={8} lg={6} className="text-end mb-3">
        <Link to="/" className="btn btn-outline-secondary bg-dark">
          <i className="bi bi-house-fill me-2"></i>Powrót
        </Link>
      </Col>
      <ButtonGroup className="d-flex btn-outline-secondary">
      
        <Button className="btn-outline-secondary w-100 mb-2 bg-dark" onClick={() => handleButtonClick('orders')}>
          Zamówienia
        </Button>
        <Button className="btn-outline-secondary w-100 mb-2 bg-dark" onClick={() => handleButtonClick('users')}>
          Użytkownicy
        </Button>
        <Button className="btn-outline-secondary w-100 mb-2 bg-dark" onClick={() => handleButtonClick('products')}>
          Produkty
        </Button>
        
      
      </ButtonGroup>
    </Row>
    {renderTable()}
  </Container>
);
};

export default AdminDashboard;