import React from 'react';
import Modal from '../components/ModalComponent/';
const points = require('../../Global_Values');

class PLGThemeLite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <div>
                <Modal open={this.props.open} closeModal={this.props.closeModal} session={this.props.session} title={"Buy PLG Theme Lite"}>
                    <div className="column column_12_12">
                        <div className="signUp authForm">
                            <h1 className="dark_headline">
                                Buy PLG Theme Lite
                            </h1>
                            <div className="form_wrap updateAccountEmailForm">
                                <h3>Use {points.plg_theme_lite_price} points to buy PLG Theme Lite?</h3>
                                <p>You have: {this.props.session.getCurrentUser.total_points}</p>
                                <div className="float-right form_buttons" style={{width: 'auto'}}>
                                    <button className="btn" type="submit">Use Points</button>
                                </div>
                                <div className="form_buttons">
                                    <button className="btn" type="submit" style={{backgroundColor: 'red', borderColor: 'red'}} onClick={this.props.closeModal}>Not Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default PLGThemeLite;