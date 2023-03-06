import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Mutation } from 'react-apollo';
import { EDIT_PROFILE, ADD_STORE_TOKEN, GET_ALL_USERS, GET_USER_PROFILE, GET_CURRENT_USER, SET_PROFILE_IMAGE } from './../../queries';
import { withRouter } from 'react-router-dom';
import CKEditor from 'react-ckeditor-wrapper';
import axios from 'axios';
import toastr from 'toastr';
import webConfig from './../../../webConfig';
const points = require('../../../Global_Values')

const initialState = {
    bio: '',
    selectedFile: {},
    newFile: '',
    error: ''
}

class EditProfileMutations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
    }

    componentDidMount() {
        if (this.props.profile) {
            this.setState({
                bio: this.props.profile.bio
            });
        }
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":1000,
            "extendedTimeOut":3000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    handleEditorChange(bio) {
        this.setState({
            bio
        });
    }

    handleSaveBio(event, editProfile) {
        event.preventDefault();
        editProfile().then(async ({ data }) => {
            toastr.clear();
            toastr.success('We have updated your profile!', 'Saved!');
        }).catch(error => {
            this.setState({
                error: error.graphQLErrors.map(x => x.message)
            })
            console.error("ERR =>", error.graphQLErrors.map(x => x.message));
        });
    }

    selectedFile(e) {
        e.preventDefault();
        let selectedFile = e.target.files[0]
        this.setState({
            selectedFile
        });
        
        var temporaryImage = URL.createObjectURL(selectedFile);
        document.querySelector(".image > img").src = temporaryImage;
    }

    fileUPload(e, selectedFile) {
        e.preventDefault();
        const data = new FormData();
        const file = this.state.selectedFile;
        data.append('selectedFile', file);

        axios.post('/upload', data).then(({ data: { newFileName } }) => {

            this.setState({
                newFile: newFileName
            })

            selectedFile(newFileName).then(async ({ data }) => {

                this.props.history.push('/edit-profile');
                toastr.clear();
                toastr.success('We have updated your profile image!', 'Saved!');

            }).catch(err => console.log(err));

        }).catch(err => {

            console.log(err)

        });
    }

    togglePointsAnimation(pts){
        var rewardPoints = document.getElementById('rewardPoints');
        rewardPoints.innerHTML = `+${pts} points`;
        rewardPoints.classList.add("points-anim")
        setTimeout(function() {
            rewardPoints.classList.toggle("points-anim")
        }.bind(), 4000);
    }

    render() {
        const { bio, newFile } = this.state
        // may [BUG] dito pag nauna lagyan ung bio at huli ung image ndi natunog pero may points naman
        if(this.props.session.getCurrentUser.one_time_missions.length > 0){
            // kapag may mission n one time offer then false pa ang complete profile
            if(!this.props.session.getCurrentUser.one_time_missions.includes("complete_profile")){
                // kapag complete n image at bio
                if(this.props.profile.bio && this.props.profile.profileImage){
                    points.playSoundEffect();
                    this.togglePointsAnimation(points.points_complete_profile)
                    this.props.refetch();
                }
            }
        } else {
            // pag wla pang complete ni isang mission
            if(this.props.profile.bio && this.props.profile.profileImage){
                // kapag complete n image at bio
                points.playSoundEffect();
                this.togglePointsAnimation(points.points_complete_profile);
                this.props.refetch();
            }
        }

        return (
            <Fragment>
                <Mutation mutation={SET_PROFILE_IMAGE}
                    variables={{ id: this.props.session.getCurrentUser.id, profileImage: newFile }}
                    refetchQueries={() => [
                        { query: GET_CURRENT_USER },
                        { query: GET_ALL_USERS }
                    ]}
                    update={(cache, { data: { setProfileIMG } }) => {

                        const { getCurrentUser } = cache.readQuery({
                            query: GET_CURRENT_USER
                        });

                        cache.writeQuery({
                            query: GET_CURRENT_USER,
                            data: {
                                getCurrentUser: { ...getCurrentUser, profileImage: setProfileIMG.profileImage }
                            }
                        });

                    }}>

                    {(setProfileIMG, { data, loading, error }) => {

                        return (
                            <div className="setProfileImage">
                                <form onSubmit={event => this.fileUPload(event, setProfileIMG)}>

                                    <div className="grid">

                                        <div className="column column_2_12 image">
                                            {!this.props.session.getCurrentUser.profileImage &&
                                                <img src={`${webConfig.siteURL}/assets/graphics/abstract_patterns/texture.jpg`} />
                                            }
                                            {this.props.session.getCurrentUser.profileImage &&
                                                <img src={`${webConfig.siteURL}/user-uploads/${this.props.session.getCurrentUser.profileImage}`} />
                                            }
                                        </div>

                                        <div className="column column_10_12">
                                            <h3>Profile image: </h3>
                                            <div className="file_input">

                                                <input type="file" accept=".jpg, .png" name="profilePic" onChange={e => this.selectedFile(e)} />

                                            </div>

                                            <div className="form_buttons">
                                                <button type="submit" className="btn">
                                                    Upload</button>
                                            </div>

                                        </div>

                                    </div>

                                </form>
                            </div>
                        )

                    }}

                </Mutation>

                <Mutation
                    mutation={EDIT_PROFILE}
                    variables={{ id: this.props.session.getCurrentUser.id, bio }}
                    refetchQueries={() => [
                        { query: GET_USER_PROFILE }
                    ]}>

                    {(editProfile, { data, loading, error }) => {

                        return (

                            <form className="form" onSubmit={event => this.handleSaveBio(event, editProfile)}>

                                <div className="form_wrap editBioForm">

                                    <div className={classNames({ 'error-label': this.state.error != '' })}>
                                        {this.state.error}
                                    </div>

                                    <div className="form_row">

                                        <CKEditor
                                            value={bio}
                                            onChange={this.handleEditorChange.bind(this)}
                                            config={{ extraAllowedContent: 'div(*); p(*); strong(*);', toolbarGroups: [ { name: 'document',	groups: [ 'mode', 'document' ] }, { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] }] }}
                                        />

                                    </div>

                                    <div className="form_buttons">
                                        <button type="submit" className="btn"
                                            disabled={loading}>
                                            Save changes</button>
                                    </div>

                                </div>

                            </form>

                        );
                    }}

                </Mutation>
            </Fragment>
        )
    }
}

export default withRouter(EditProfileMutations);