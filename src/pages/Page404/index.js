import React from 'react';
import { Link } from "react-router-dom";
import './css.css';

const Page404 = () => {
  return (
    <div id="notfound">
        <div className="notfound-bg">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="notfound">
          <div className="notfound-404">
            <h1>404</h1>
          </div>
          <h2>Page Not Found</h2>
          <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
          <a href="/">Homepage</a>
          <div className="notfound-social">
            <a href="#"><i className="fa fa-facebook" /></a>
            <a href="#"><i className="fa fa-twitter" /></a>
            <a href="#"><i className="fa fa-pinterest" /></a>
            <a href="#"><i className="fa fa-google-plus" /></a>
          </div>
        </div>
      </div>
  );
};

export default Page404;
