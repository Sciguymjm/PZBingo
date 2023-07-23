import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const Footer = () => {
  return (
    <footer className="mt-auto py-3">
      <Container>
        <Row>
          <Col className="d-flex justify-content-end">
            <a href="https://github.com/Sciguymjm/pzbingo" target="_blank" rel="noopener noreferrer">
              Github
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
