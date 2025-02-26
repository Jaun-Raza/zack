import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 4px solidrgba(234, 30, 190, 0.55); 
  border-radius: 50%;
  border-top: 4px solid #ea1ebd;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin: auto;
  margin-top: 15rem;
`;

const Loader = () => {
  return (
    <Wrapper>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Spinner />
        <p style={{ color: '#ea1ebd', marginTop: '10px' }}>Loading...</p>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin: auto;
`;

export default Loader;
