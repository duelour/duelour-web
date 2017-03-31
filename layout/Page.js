import Header from './Header'

export default ({ children }) => (
  <div>
    <Header />
    { children }
    <style jsx>{`
      div {
        height: 100%;
      }
    `}</style>
  </div>
)
