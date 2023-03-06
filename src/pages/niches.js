import React, { Fragment } from 'react';
import withAuth from '../hoc/withAuth';
import { Link } from 'react-router-dom';
import Loading from '../components/loading';
const points = require('../../Global_Values');

class Niches extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            exclude_handle: []
        }
    }

    componentDidMount(){
        const excluded = [], currentUser = this.props.session.getCurrentUser, cod_available_country = points.cod_available_country("no_country");
        cod_available_country.forEach(e => {
            if(!currentUser.access_tags.includes(e.name.toLowerCase()) && e.iso2 != "AE" && e.iso2 != "SA") {
                excluded.push("cod-"+e.name.toLowerCase());
            }
        });

        fetch('https://productlistgenie.io/collections.json')
        .then(res => res.json())
        .then(result => {
            this.setState({ data: result, exclude_handle: excluded });
        });
    }

    render() {
        if(this.state.data.length != 0){
            var collections = this.state.data.collections;
            collections = collections.filter(el => el.handle != "cpa-offers");
            return (
                <Fragment>
                    <div className="grid page-container">
                        {collections.map((data,i) => {
                            if(this.state.exclude_handle.includes(data.handle)) return null;
                            return (
                                <div className="column column_4_12" key={i}>
                                    <div className="product-card">
                                        <div className="product-details text-center" style={{padding:0}}>
                                            <Link to={{pathname: "/collection/"+data.handle}} className="stretch-width">
                                                {data.image != null &&
                                                    <div className="product-tumb" style={{backgroundImage: "url(" +  data.image.src  + ")", borderRadius: '10px 10px 0 0' }}>
                                                    </div>
                                                }
                                                <div className="ab-text">
                                                    {data.title}
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Fragment>
            );
        } else {
            return (
                <div className="center-vertical">
                    <Loading height={200} width={200} />
                </div>
            );
        }
    }
}

export default withAuth(session => session && session.getCurrentUser)(Niches);