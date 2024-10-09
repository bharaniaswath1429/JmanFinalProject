import React from 'react';
import styled from 'styled-components';

// Styled component for the stat item
const StatItemContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 20px;
  margin: 10px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  color: #6c757d;
`;

const Count = styled.p`
  font-size: 2rem;
  font-weight: bold;
  margin: 5px 0 0;
  color: #343a40;
`;

const SmallStatItem = ({ title, count }) => {
  return (
    <StatItemContainer>
      <Title>{title}</Title>
      <Count>{count}</Count>
    </StatItemContainer>
  );
};

export default SmallStatItem;
