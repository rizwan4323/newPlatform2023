import React from 'react';
// import { Redirect } from 'react-router-dom'
import Modal from '../components/ModalComponent';

class UserPrivilege extends React.Component {
    constructor() {
        super();
        this.state = {
            openPrivilegeModal: false
        }
        this.openPrivilegeModal = this.openPrivilegeModal.bind(this);
        this.closePrivilegeModal = this.closePrivilegeModal.bind(this);
    }

    openPrivilegeModal(){
        this.setState({openPrivilegeModal: true})
    }
    closePrivilegeModal(){
        this.setState({openPrivilegeModal: false}, () => {
            this.props.getCurrentUser.history.push('/dashboard')
        })
    }

    componentDidMount(){
        if(this.props.getCurrentUser.session.getCurrentUser.privilege && this.props.getCurrentUser.session.getCurrentUser.privilege <= 1){
            this.openPrivilegeModal();
        }
    }

    render() {
        return (
            <div>
                {(() => {
                    if(this.state.openPrivilegeModal){
                        return (<Modal open={this.state.openPrivilegeModal} closeModal={this.closePrivilegeModal}>
                            <div className="center-vertical">
                                This is out of your privilege
                            </div>
                        </Modal>);
                    } else {
                        return null;
                    }
                })()}
            </div>
        );
    }
}
export default UserPrivilege;