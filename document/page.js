import React, { PropTypes } from "react";
import { Grid } from "react-bootstrap";
import Header from "./header";

const Page = ({ children }) => (
  <div>
    <Header />
    <Grid>
      {children}
    </Grid>
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
