import React from 'react';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ServiceTab = ({ services }) => {
  return (
    <>
      <form id="mappingPaymentServices" method="post">
        <ul className="service-list">
          {services.slice().reverse().map((service, index) => (
            <li key={index}>
              <FontAwesomeIcon icon={faCheckCircle} /> {service.services.service_code}
            </li>
          ))}
        </ul>
      </form>
    </>
  );
};

export default ServiceTab;
