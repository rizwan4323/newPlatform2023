import React from 'react';
import { Helmet } from 'react-helmet';

const head = () => {
    return (
        <Helmet>
            <title>Cancellation Policy - Product List Genie</title>
        </Helmet>
    );
}

const CookiePolicy = () => (
    <section className="content_block cookiePolicy">
        {head()}
    
        <div className="grid">
            
            <div className="column column_12_12">
                <div className="content_wrap noBoarder">
                    <div className="title">Cancellation Policy</div>
                    <div className="desc">
                        <h2>(Refunds &amp; Cancellations)</h2>
                        <p>There are no commitments for your Product List Genie subscription. You can cancel your membership easily from the settings menu inside your account. If you need help you can always reach out to us via chat or you can submit a ticket for any billing questions.</p>
                        <p>30-day money back guarantee. If you are not completely satisfied with our software and community within the first 30 days you will receive a full refund of your purchase.</p>
                    </div>
                </div>
            </div>

        </div>

    </section>
);

export default CookiePolicy;