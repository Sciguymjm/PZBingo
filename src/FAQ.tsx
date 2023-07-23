import React from 'react';
import faqData from './data/faq.json';
import Accordion from 'react-bootstrap/Accordion';
import { Col } from "react-bootstrap";

export const FAQ = () => {
  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      <Col xs={12} md={6}>
        <Accordion key={"accordion"}>
          {faqData.map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={index.toString()}>
              <Accordion.Header>{item.question}</Accordion.Header>
              <Accordion.Body>{item.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Col>
    </div>
  );
};
