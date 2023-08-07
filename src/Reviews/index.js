import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, ListGroup, Modal } from 'react-bootstrap';

const Reviews = () => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState({});
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [newReview, setNewReview] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [reviewAdded, setReviewAdded] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/User/getAllProduct');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Error fetching products:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch('/reviews/showAllReviews');
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
          const defaultPages = {};
          data.forEach((review) => {
            if (!defaultPages.hasOwnProperty(review.productId)) {
              defaultPages[review.productId] = 1;
            }
          });
          setCurrentPage(defaultPages);
        } else {
          console.error('Error fetching reviews:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const jwt = JSON.parse(localStorage.getItem('jwt'));

        if (jwt) {
          const response = await fetch('/current-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: jwt }),
          });

          if (response.ok) {
            const data = await response.json();
            setCurrentUser(data);
          } else {
            console.error('Error fetching current user:', response.statusText);
          }
        } else {
          console.error('JWT token not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchProducts();
    fetchReviews();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (reviewAdded) {
      const fetchReviews = async () => {
        try {
          const response = await fetch('/reviews/showAllReviews');
          if (response.ok) {
            const data = await response.json();
            setReviews(data);
          } else {
            console.error('Error fetching reviews:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };

      fetchReviews();
      setReviewAdded(false);
    }
  }, [reviewAdded]);

  const toggleProduct = (productId) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };

  const isProductExpanded = (productId) => {
    return expandedProduct === productId;
  };

  const getReviewsForProduct = (productId) => {
    return reviews.filter((review) => review.productId === productId);
  };

  const paginate = (productId, pageNumber) => {
    setCurrentPage((prevPages) => ({
      ...prevPages,
      [productId]: pageNumber,
    }));
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setModalCurrentPage(1);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const paginateModal = (pageNumber) => {
    setModalCurrentPage(pageNumber);
  };

  const handleReviewChange = (event) => {
    setNewReview(event.target.value);
  };

  const addReview = async () => {
    if (!currentUser) {
      return;
    }
  
    const { productId } = selectedProduct;
    const userId = currentUser.userId;
    const description = newReview;
  
    try {
      const response = await fetch('/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
        },
        body: JSON.stringify({ productId, userId, description }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setReviews([...reviews, data]);
        setShowModal(false);
        setNewReview('');
        setReviewAdded(true); // Ustawienie flagi, że recenzja została dodana
        window.location.href = '/'; // Przekierowanie do strony głównej
      } else {
        window.location.href = '/';
        console.error('Error adding review:', response.statusText);
      }
    } catch (error) {
      window.location.href = '/';
      console.error('Error adding review:', error);
    }
  };
  

  const reviewsInModal = selectedProduct
    ? getReviewsForProduct(selectedProduct.productId).slice(
        (modalCurrentPage - 1) * 3,
        modalCurrentPage * 3
      )
    : [];

  const isReviewValid = newReview.length >= 3;

  return (
    <Container>
      <h1>Recenzje</h1>
      <Row>
        {products.map((product) => (
          <Col md={4} key={product.productId}>
            <div className="mb-4">
              <img
                className="w-100"
                src={product.imagePath}
                alt={product.productName}
                onClick={() => openModal(product)}
                style={{ maxHeight: '250px', minHeight: '250px' }}
              />
              {isProductExpanded(product.productId) && (
                <div className="px-3 py-2">
                  <h4>{product.productName}</h4>
                  <p>{product.specification}</p>
                  <p>Cena: {product.price} zł</p>
                  <h6>Recenzje</h6>
                  {getReviewsForProduct(product.productId).length > 0 ? (
                    getReviewsForProduct(product.productId)
                      .slice(
                        (currentPage[product.productId] - 1) * 3,
                        currentPage[product.productId] * 3
                      )
                      .map((review) => (
                        <div key={review.reviewId}>
                          <p>{review.description}</p>
                          <hr />
                        </div>
                      ))
                  ) : (
                    <p>Brak recenzji</p>
                  )}
                  {getReviewsForProduct(product.productId).length > 3 && (
                    <div className="text-center">
                      <ListGroup horizontal>
                        {Array.from(
                          {
                            length: Math.ceil(
                              getReviewsForProduct(product.productId).length / 3
                            ),
                          },
                          (_, index) => (
                            <ListGroup.Item
                              key={index + 1}
                              className={`mx-1 ${
                                index + 1 === currentPage[product.productId] ? 'active' : ''
                              }`}
                              onClick={() => paginate(product.productId, index + 1)}
                            >
                              {index + 1}
                            </ListGroup.Item>
                          )
                        )}
                      </ListGroup>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={closeModal}>
  {selectedProduct && (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{selectedProduct.productName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{selectedProduct.specification}</p>
        <p>Cena: {selectedProduct.price} zł</p>
        <h6>Recenzje</h6>
        {reviewsInModal.length > 0 ? (
          <>
            {reviewsInModal.map((review, index) => (
              <div key={review.reviewId}>
                <p>{review.description}</p>
                <hr />
              </div>
            ))}
            <div className="text-center">
              <ListGroup horizontal>
                {Array.from(
                  {
                    length: Math.min(
                      Math.ceil(getReviewsForProduct(selectedProduct.productId).length / 3),
                      8
                    ),
                  },
                  (_, index) => (
                    <ListGroup.Item
                      key={index + 1}
                      className={`mx-1 ${index + 1 === modalCurrentPage ? 'active' : ''}`}
                      onClick={() => paginateModal(index + 1)}
                    >
                      {index + 1}
                    </ListGroup.Item>
                  )
                )}
              </ListGroup>
            </div>
            {getReviewsForProduct(selectedProduct.productId).length > 24 && (
              <div className="text-center mt-3">
                <ListGroup horizontal>
                  {Array.from(
                    {
                      length: Math.ceil(
                        (getReviewsForProduct(selectedProduct.productId).length - 24) / 3
                      ),
                    },
                    (_, index) => (
                      <ListGroup.Item
                        key={index + 9}
                        className={`mx-1 ${index + 9 === modalCurrentPage ? 'active' : ''}`}
                        onClick={() => paginateModal(index + 9)}
                      >
                        {index + 9}
                      </ListGroup.Item>
                    )
                  )}
                </ListGroup>
              </div>
            )}
          </>
        ) : (
          <p>Brak recenzji</p>
        )}
        {currentUser ? (
          <div>
            <h6>Dodaj recenzję</h6>
            <textarea
              rows={3}
              value={newReview}
              onChange={handleReviewChange}
              className="form-control mb-3"
            ></textarea>
            <Button variant="primary" onClick={addReview} disabled={!isReviewValid}>
              Dodaj recenzję
            </Button>
          </div>
        ) : (
          <p>Zaloguj się, aby dodać recenzję</p>
        )}
        {reviewAdded && <p>Twoja recenzja została dodana.</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Zamknij
        </Button>
      </Modal.Footer>
    </>
  )}
</Modal>
    </Container>
  );
};

export default Reviews;
