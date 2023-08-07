import React, { useState } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { Container, Card } from 'react-bootstrap';
const google = window.google;
const containerStyle = {
  width: '100%',
  height: '400px'
};

const position = {
  lat: 51.24565182542882,
  lng: 22.540842010872662
};

const Location = () => {
  const [selectedPlace, setSelectedPlace] = useState({
    name: 'Uniwersytet Marii Curie Skłodowskiej',
    address: 'ul. Marii Curie-Skłodowskiej 5 20-400 Lublin Polska'
  });

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
  };

  return (
    
    <Container>
      <LoadScript googleMapsApiKey="AIzaSyAR-vT-pexKiQU09UDdzY1v-moe_3Ws55o">
        <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={15}>
          <Marker position={position} onClick={() => handleMarkerClick(selectedPlace)} />
        </GoogleMap>
      </LoadScript>

      {selectedPlace && (
        <Card>
          <Card.Body>
            <Card.Title>Informacje o miejscu</Card.Title>
            <Card.Text>
              Nazwa: {selectedPlace.name}
              <br />
              Adres: {selectedPlace.address}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Location;
