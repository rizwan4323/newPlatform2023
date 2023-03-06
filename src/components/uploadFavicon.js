import React from 'react';
import withSession from './../hoc/withSession';
const points = require('../../Global_Values');

class UploadFavicon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount(){
        var script = document.createElement("script");
        script.id = "croppperJS";
        script.src = "/assets/graphics/js/cropper.js";
        document.body.append(script)
        const file = this.props.file;
        const self = this;
        setTimeout(function() {
            self.readURL(file)
        }, 500);
    }

    componentWillUnmount(){
        document.getElementById("croppperJS").remove();
    }

    readURL(input) {
        const callback = this.props.callback;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            // const formData = new FormData();
            var base64Value = "";
            reader.onload = function (e) {
                document.getElementById('blah').style.display = 'block'
                document.getElementById('blah').setAttribute('src', e.target.result)
                document.getElementById('blah').style.width = '100%'
                const image = document.getElementById('blah');
                const cropper = new Cropper(image, {
                    aspectRatio: 1 / 1,
                    guides: true,
                    crop(event) {
                        cropper.getCroppedCanvas().toBlob((blob) => {
                            var fr = new FileReader();
                            fr.readAsDataURL(blob);
                            fr.onloadend = function () {
                                var base64data = fr.result;
                                // formData.append('image', base64data);
                                base64Value = base64data;
                            }
                        })
                    },
                });
            };
            reader.readAsDataURL(input.files[0]);
            function uploadFavicon(){
                // fetch('/v1/editor/1234/images', {
                //     method: "POST",
                //     headers: {
                //         'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryH7x8gwrHL1cOE0da'
                //     },
                //     body: formData
                // })
                callback(base64Value);
            }
            document.getElementById('sendfav').addEventListener('click', function (e) {
                uploadFavicon();
            });
        }
    }

    render() {
        return(
            <div className="favicon-uploader" style={{marginTop: 10}}>
                <div id="thecanvas"></div>
                <div style={{maxHeight: 500, width: '50%', margin: '0 auto'}}>
                    <img id="blah" src="#" style={{display: 'none'}} />
                </div>
                <button id="sendfav" className="btn-success stretch-width" style={{margin: '10px 0'}}>Save Favicon</button>
            </div>
        );
    }
}


export default withSession(UploadFavicon);