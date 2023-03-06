import React from 'react';
import { Helmet } from 'react-helmet';

const head = () => {
    return (
        <Helmet bodyAttributes={{class: "notFound404ErrorPage"}}>
            <title>404 Not Found - Product List Genie</title>
        </Helmet>
    );
}

const NotFound = (props) => (
    <section className="content_block notFound">
        {head()}
        <div className="center-vertical-parent" style={{height: '80vh'}}>
            <div className="center-vertical">
                <img src="/assets/graphics/no-result.svg" style={{height: '50vh'}} />
                <h4 className="title" style={{fontSize: '2.5em'}}>OOPS! THAT'S AN ERROR!</h4> <br/>
                <label className="font-roboto-bold" style={{fontSize: '0.875em'}}> 
                    {/* The request URL <u style={{color: '#28c686', fontSize: '1em'}}>"{props.location.pathname}"</u> was not found on this server. */}
                    The request URL was not found on this server.
                </label>
            </div>
        </div>
    </section>
);

export default NotFound;