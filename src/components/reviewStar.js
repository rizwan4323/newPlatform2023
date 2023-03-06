import React from 'react';

class ReviewStar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            rating : null,
            temp_rating: null
        }
    }

    componentDidMount(){
        this.setState({
            rating: this.props.rating,
        })
    }
    
    rate(rating) {
        this.setState({
            rating: rating,
            temp_rating: rating
        });
    }

    star_over(rating) {
        var self = this;
        self.setState({
            temp_rating: self.state.rating
        }, () => {
            self.setState({
                rating: rating
            }, () => {
                self.setState({
                    rating: self.state.rating,
                    temp_rating: self.state.temp_rating
                });
            })
        })
    }

    star_out() {
        var self = this;
        self.setState({
            rating: self.state.temp_rating
        }, () => {
            self.setState({
                rating: self.state.rating
            });
        })
    }

    render() {
        var stars = [];
        
        for(var i = 1; i <= 5; i++) {
            var klass = 'star-rating__star';
            
            if (this.state.rating >= i && this.state.rating != null) {
                klass += ' is-selected';
            }

            stars.push(
                <label key={i}
                    className={klass}
                    onClick={this.rate.bind(this, i)}
                    onMouseOver={this.star_over.bind(this, i)}
                    onMouseOut={this.star_out.bind(this)} title={i+" Star"}>
                    ★
                </label>
            );
        }

        return (
            <div className="star-rating">
              {stars}
            </div>
        );
    }
}

export default ReviewStar;