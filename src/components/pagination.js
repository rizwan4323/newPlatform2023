import React from 'react';

class Pagination extends React.Component {
    constructor() {
        super();
        this.state = {
            pageNumber: 1
        }
    }

    componentDidMount(){
        if(this.props.pageNumber){
            this.setState({ pageNumber: this.props.pageNumber })
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.currentPage && nextProps.currentPage !== this.state.pageNumber){
            this.setState({ pageNumber: nextProps.currentPage })
        }
    }

    changePageNumber(event, isNext){
        if(event){
            this.setState({
                pageNumber: parseInt(event.target.innerHTML)
            }, () => {
                this.props.action(this.state.pageNumber);
            })
        } else {
            if(isNext || this.state.pageNumber != 1){
                this.setState({
                    pageNumber: isNext ? this.state.pageNumber+1 : this.state.pageNumber-1
                }, () => {
                    this.props.action(this.state.pageNumber);
                })
            }
        }
    }

    pagination(c, m) {
        var current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;
    
        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }
        
        for (let i of range) {
            if (l) {
                if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(<button onClick={event => this.changePageNumber(event)} className={c == i ? "pagination-number-active" : "pagination-number"} key={i}>{i}</button>);
            l = i;
        }
    
        return rangeWithDots;
    }

    render() {
        var totalPage = this.props.totalPage || 1;
        var displayPageCount = this.props.displayPageCount ? this.props.displayPageCount : 20;
        var totalPagination = Math.ceil(totalPage / displayPageCount);
        const extraClassName = this.props.className ? this.props.className+" " : "";

        return (
            <div className={extraClassName+"china-fulfillment-pagination float-right"} style={this.props.style}>
                {this.props.showInputPage &&
                    <input type="number" value={this.state.pageNumber} onChange={event => {
                        this.setState({pageNumber: parseInt(event.target.value)}, () => {
                            this.props.action(this.state.pageNumber);
                        })
                    }} style={{width: 70, textAlign: 'center'}} />
                }
                <button className="pagination-arrow" onClick={() => this.changePageNumber(null, false)}><span className="fas fa-angle-left"></span></button>
                {this.pagination(this.state.pageNumber, totalPagination)}
                <button className="pagination-arrow" onClick={() => {
                    if(this.state.pageNumber < totalPagination){
                        this.changePageNumber(null, true)
                    }
                }}><span className="fas fa-angle-right"></span></button>
            </div>
        );
    }
}
export default Pagination;