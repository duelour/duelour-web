import React, { PropTypes } from 'react';
import Header from './header';

const Page = ({ children }) => (
  <div>
    <Header/>
    { children }
    <style jsx>{`
      div {
        height: 100%;
      }
    `}</style>
  </div>
);

Page.propTypes = {
  children: PropTypes.node.isRequired
};

export default Page;
