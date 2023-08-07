import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../logo.svg';
import { Link } from 'react-router-dom';
import { Popover, OverlayTrigger, Button, Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon, FaUser,  } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser,faSignOutAlt, faTrashAlt, faPlus, faMinus, faShieldHalved,faTruck,faUtensils  } from "@fortawesome/free-solid-svg-icons";
import AboutUs from '../AboutUs';
import Reviews from '../Reviews';
import Location from '../Location';
function Homepage() {
  const [products, setProducts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [cartProducts, setCartProducts] = useState([]);
  const totalPrice = cartProducts.reduce((acc, cur) => acc + cur.price * cur.quantity, 0).toFixed(2);
  const google = window.google = window.google ? window.google : {}
  const popover = (
    <Popover className="bg-dark bg-gradient text-white" style={{ width: "400px" }}>
      <Popover.Header className="text-white" style={{ background: "#A9A9A9" , display: "flex", justifyContent: "space-between" }}>
        <span>Koszyk</span>
        <span style={{ fontWeight: "bold" }}>{totalPrice} zł</span>
      </Popover.Header>
      <Popover.Body className="text-white">
        {cartProducts.map((product) => (
          <div key={product.id} style={{ display: "flex", alignItems: "center" }}>
            <img src={product.imagePath} alt={product.productName} width="50" />
            <div style={{ marginLeft: "10px" }}>
              <div>{product.productName} ({product.quantity})</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", marginRight: "10px" }}>{product.price * product.quantity} zł</span>
                <Button className="text-white" variant="outline-secondary" size="sm" style={{ width: "25px", borderRadius: "50%", padding: "0" }} onClick={() => handleQuantityChange(product, product.quantity + 1)}><FontAwesomeIcon icon={faPlus} /></Button>
                
                <Button className="text-white" variant="outline-secondary" size="sm" style={{ width: "25px", borderRadius: "50%", padding: "0" }} onClick={() => handleQuantityChange(product, product.quantity - 1)}><FontAwesomeIcon icon={faMinus} /></Button>
              
                <Button variant="outline-danger" size="sm" style={{ width: "25px", borderRadius: "50%", padding: "0", marginLeft: "10px" }} onClick={() => handleRemoveFromCart(product)}><FontAwesomeIcon icon={faTrashAlt} /></Button>
              </div>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
  <Button variant="success" size="sm" style={{ width: "100%", marginRight: "5px" }} disabled={cartProducts.length === 0} onClick={() => {window.location.href = "purchase"}}>
    <FontAwesomeIcon icon={faShoppingCart} />
    <span style={{ marginLeft: "10px" }}>Zamówienie</span>
  </Button>
  <Button variant="outline-secondary" size="sm" style={{ width: "100%", marginLeft: "5px" }} disabled={cartProducts.length === 0} onClick={() => handleClearCart()}>
    <FontAwesomeIcon icon={faTrashAlt} />
    <span style={{ marginLeft: "10px" }} >Wyczyść koszyk</span>
  </Button>
</div>
      </Popover.Body>
    </Popover>
  );
          
 
  const jwt = JSON.parse(localStorage.getItem(`jwt`));

  useEffect(() => {
    //const jwt = localStorage.getItem(`jwt`);
    if (jwt) {
      setLoggedIn(true);
      getCurrentUser(jwt);
    }
    fetch('User/getAllProduct')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setCurrentUser(null);
    window.location.reload()
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

  console.log(currentUser);
  //console.log(product.productId);
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
        console.log(cartProducts.length)
        setCartProducts([]);
      });
  };
  const handleClearCart = () => {
    if (!currentUser) {
      return;
    }

    const userId = currentUser.userId;
  
    fetch(`User/removeAllProductfromCart/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error clearing cart');
        }
        console.log('Cart cleared');
        setCartProducts([]);
      })
      .catch((error) => console.error(error));
  };

  const handleAddToCart = (productId) => {
    if (!currentUser) {
      displayLoginPopup();
      return;
    }
  
    const userId = currentUser.userId;
    const quantity = 1;
    console.log(userId);
    fetch(`User/cart/${userId}/${quantity}/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error adding product to cart');
        }
        console.log('Product added to cart');
        getCartProducts(userId);
      })
      .catch((error) => console.error(error));
  };
  
  const displayLoginPopup = () => {
    const popup = document.createElement('div');
    popup.innerText = 'Zaloguj się, aby dodać produkty do koszyka.';
    popup.style.position = 'fixed';
    popup.style.bottom = '10px';
    popup.style.right = '10px';
    popup.style.padding = '10px';
    popup.style.backgroundColor = '#fff';
    popup.style.border = '1px solid #000';
  
    document.body.appendChild(popup);
  
    setTimeout(() => {
      popup.remove();
    }, 3000);
  };

  const handleQuantityChange = (product, newQuantity) => {
    const userId = currentUser.userId;
    const productId = product.productId;
    console.log(product);
    console.log(productId);
    fetch(`User/updatingQuantity/${productId}/${newQuantity}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error updating product quantity');
        }
        console.log('Product quantity updated');
        getCartProducts(userId);
      })
      .catch((error) => console.error(error));
  };
  console.log(products);
  const handleRemoveFromCart = (product) => {
    const userId = currentUser.userId;
    const productId = product.productId;
    console.log(product);
    console.log(productId);
    fetch(`User/removeProductFromCart/${productId}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error removing product from cart');
        }
        console.log('Product removed from cart');
        getCartProducts(userId);
      })
      .catch((error) => console.error(error));
  };
  function toDashboard() {
    window.location.href = "/dashboard";
  }
  function toAdminDashboard() {
    window.location.href = "/admindashboard";
  }
  function toChefDashboard() {
    window.location.href = "/chefdashboard";
  }
  function toDeliveryDashboard() {
    window.location.href = "/deliverydashboard";
  }
  const [isNavCollapsed, setIsNavCollapsed] = React.useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const [activeComponent, setActiveComponent] = React.useState('products');
  const handleNavButtonClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div>
      <Container>
    <header className="d-flex justify-content-between align-items-center py-3 px-4">
      <img src={logo} alt="React logo" height="30" />
      <div>
        {loggedIn ? (
          <button className="btn btn-outline-secondary bg-dark me-2" onClick={toDashboard}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        ) : (
          <div hidden></div>
        )}
        {loggedIn && currentUser.role === 'ADMIN' ? (
          <button className="btn btn-outline-secondary bg-dark me-2" onClick={toAdminDashboard}>
            <FontAwesomeIcon icon={faShieldHalved} beat />
          </button>
        ) : (
          <div hidden></div>
        )}
        {loggedIn && currentUser.role === 'CHEF' ? (
          <button className="btn btn-outline-secondary bg-dark me-2" onClick={toChefDashboard}>
            <FontAwesomeIcon icon={faUtensils} beat />
          </button>
        ) : (
          <div hidden></div>
        )}
        {loggedIn && currentUser.role === 'DELIVERY' ? (
          <button className="btn btn-outline-secondary bg-dark me-2" onClick={toDeliveryDashboard}>
            <FontAwesomeIcon icon={faTruck} beat />
          </button>
        ) : (
          <div hidden></div>
        )}
        {loggedIn ? (
          <button className="btn btn-outline-secondary bg-dark me-2" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        ) : (
          <button className="btn btn-outline-secondary bg-dark me-2">
            <Link to="/login" className="text-decoration-none text-reset">
              Login
            </Link>
          </button>
        )}
        <button className="btn btn-outline-secondary bg-dark me-2" style={{ position: 'relative' }}>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <span>
              <FontAwesomeIcon icon={faShoppingCart} />({cartProducts.length})
            </span>
          </OverlayTrigger>
        </button>
      </div>
    </header>
    <nav className="navbar navbar-expand-lg navbar-light bg-gradient ">
      <div className="container-fluid text-white">
        <button className="navbar-toggler" type="button" onClick={handleNavCollapse}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`}>
          <ul className="navbar-nav w-100">
            <li className="nav-item w-25">
              <Button
                className="btn-outline-secondary w-100 mb-2 bg-dark"
                onClick={() => handleNavButtonClick('about')}
              >
                O nas
              </Button>
            </li>
            <li className="nav-item w-25">
              <Button
                className="btn-outline-secondary w-100 mb-2 bg-dark"
                onClick={() => handleNavButtonClick('products')}
              >
                Menu
              </Button>
            </li>
            <li className="nav-item w-25">
              <Button className="btn-outline-secondary w-100 mb-2 bg-dark"
onClick={() => handleNavButtonClick('reviews')}
>
Recenzje
</Button>
</li>
<li className="nav-item w-25">
  <Button
    className="btn-outline-secondary w-100 mb-2 bg-dark"
    onClick={() => handleNavButtonClick('location')}
  >
    Lokalizacja
  </Button>
</li>
</ul>
</div>
</div>
</nav>
<div className="container py-5">
  {activeComponent === 'products' ? (
    <>
      {products.length > 0 ? (
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4" key={product.productId}>
              <Card className="bg-dark bg-gradient text-white">
                <Card.Img
                  variant="top"
                  src={product.imagePath}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text>{product.specification}</Card.Text>
                  <Card.Text>Cena: {product.price} zł</Card.Text>
                  <Button
                    className="btn btn-success mb-2 w-50"
                    onClick={() => handleAddToCart(product.productId, 1)}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </Button>
                </Card.Body>
              </Card>
              <br></br>
            </div>
          ))}
        </div>
      ) : (
        <p>Brak produktów</p>
      )}
    </>
  ) : null}
  {activeComponent === 'about' ? (
    <div><AboutUs></AboutUs></div>
  ) : null}
  {activeComponent === 'products' ? (
    <div></div>
  ) : null}
  {activeComponent === 'reviews' ? (
    <div><Reviews></Reviews></div>
  ) : null}
  {activeComponent === 'location' ? (
    <div><Location></Location></div>
  ) : null}
</div>
</Container>
</div>
);
}


export default Homepage;
