import React from 'react';
import Popup from 'reactjs-popup';

class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        if(this.props.onOpen) {
            this.props.onOpen();
        }
    }

    render(){
        let close = typeof this.props.closeOnDocumentClick != "undefined" ? this.props.closeOnDocumentClick : true;
        return(
            <div>
                <style dangerouslySetInnerHTML={{__html: `
                    #toast-container { top:140px; left: 40%; }
                    .container .sideBar{
                        overflow: visible !important;
                        z-index: 99 !important;
                    }
                `}} />
                <Popup open={this.props.open} closeOnDocumentClick={close} onClose={this.props.closeModal} contentStyle={this.props.style}>
                    <div className="modal">
                        <a className="close" onClick={this.props.closeModal}>
                            &times;
                        </a>
                        <div className="content">
                            {this.props.children}
                        </div>
                    </div>
                </Popup>
            </div>
        );
    }
}

export default Index;