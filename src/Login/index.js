import React, { useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import { Form, Button, Card, Tab, Tabs } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [jwt, setJwt] = useLocalState('', 'jwt');
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = () => {
    console.log("Request sent");
    const requestBody = {
      username: mobileNumber,
      password: password,
    };
    fetch('login', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Nie udało się zalogować!");
        }
      })
      .then(data => {
        setJwt(data.token);
        window.location.href = "dashboard";
        console.log("Udało się zalogować!");
      })
      .catch(error => {
        alert(error.message);
      });
  }

  const handleRegister = () => {
    console.log("Request sent");
    const requestBody = {
      username: username,
      mobileNumber: mobileNumber,
      password: password,
      email: email
    };
    fetch('User/create', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Nie udało się zarejestrować!");
        }
      })
      .then(data => {
        window.location.href = "/login";
        console.log("Udało się zarejestrować!");
      })
      .catch(error => {
        alert(error.message);
      });
  }

  const handleBack = () => {
    window.location.href = "/";
  }

  return (
    <div className="container mt-5">
      <Tabs

        defaultActiveKey="home"
        transition={true}
        id="noanim-tab-example"
        className="mb-3"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k) }
        //variant="pills"
        style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '7px',color: 'white'}}
        fill
      >
        <Tab eventKey="login" title="Logowanie">
          <Card className="mt-3" style={{ background: 'rgba(0, 0, 0, 0.2)', color: 'white' }}>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Number Telefonu</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Wprowadź e-mail"
                    value={mobileNumber}
                    onChange={(event) => setMobileNumber(event.target.value)}
                  />
                </Form.Group>
  
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Hasło</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Wprowadź hasło"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Group>
  
                <Button variant="dark" onClick={handleLogin}>
                  Zaloguj
                </Button>
                <Button variant="secondary" onClick={handleBack} style={{ marginLeft: '10px' }}>
                  Powrót
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="register" title="Rejestracja">
          <Card className="mt-3" style={{ background: 'rgba(0, 0, 0, 0.2)', color: 'white' }}>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Wprowadź e-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Form.Group>
  
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Hasło</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Wprowadź hasło"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Group>
  
                <Form.Group className="mb-3" controlId="formBasicFirstName">
                  <Form.Label>Imię</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Wprowadź imię"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </Form.Group>
  
                <Form.Group className="mb-3" controlId="formBasicPhone">
                  <Form.Label>Numer telefonu</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Wprowadź numer telefonu"
                    value={mobileNumber}
                    onChange={(event) => setMobileNumber(event.target.value)}
                  />
                </Form.Group>
  
                <Button variant="dark" onClick={handleRegister}>
                  Zarejestruj
                </Button>
                <Button variant="secondary" onClick={handleBack} style={{ marginLeft: '10px' }}>
                  Powrót
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
  
};

export default Login;