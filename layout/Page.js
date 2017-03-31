import Header from './Header'
import styled from 'styled-components'

const PageWrapper = styled.div`
  height: 100%
`;

export default ({ children }) => (
  <PageWrapper>
    <Header />
    { children }
  </PageWrapper>
)
