import styled from 'styled-components'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -50px;
`
const SubTitle = styled.div`
  font-size: 30px;
  margin-top: 30px;
  color: #cc4b46;
`;
const Title = styled.div`
  font-weight: bold;
  font-size: 60px;
  color: #cc4b46;
`
const TitleWrapper = styled.div`
  margin-top: -15px;
`

export default () => (
  <Wrapper>
    <img src="/static/boxing.png" width="300px" />
    <TitleWrapper>
      <Title>Duelour</Title>
    </TitleWrapper>
    <SubTitle>Coming Soon...</SubTitle>
  </Wrapper>
)
