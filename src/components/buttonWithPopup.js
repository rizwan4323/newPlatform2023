import React from 'react';
import Popup from 'reactjs-popup';

const ButtonWithPopup = (props) => (
    <Popup
        trigger={props.data.triggerDOM}
        position={props.data.popupPosition}
        on={props.data.onAction ? props.data.onAction : "click"} className="points-tooltip" arrow={props.data.arrow || false} contentStyle={props.data.style} onOpen={() => props.data.onOpen ? props.data.onOpen() : {}} onClose={() => props.data.onClose ? props.data.onClose() : {}}>
        <div className="text-center" style={{lineHeight: 1.5 }}>
            {props.data.onAction == "hover" &&
                <style dangerouslySetInnerHTML={{__html:`.points-tooltip{min-width: fit-content !important;}`}} />
            }
            <div style={{padding: props.data.padding, margin: '-5px'}}>
                {props.data.title ? <h3 style={{ margin: 0 }}>{props.data.title}</h3> : void 0}
                {props.data.text}
            </div>
            {props.data.checkORtimesButton == null || props.data.checkORtimesButton ?
                <div style={{padding: '5px 10px', backgroundColor: '#f5f4f4', margin: '-5px', borderRadius: '0 0 5px 5px'}}>
                    <style dangerouslySetInnerHTML={{__html: `button:hover{color:#28c686}`}} />
                    <button style={{ textDecoration: 'underline' }} onClick={() => {
                        document.getElementById(props.data.triggerID).click();
                        props.data.action();
                    }} disabled={props.data.loading}>
                        YES
                    </button>
                    &nbsp;
                    <button style={{ textDecoration: 'underline' }} onClick={() => {
                        document.getElementById(props.data.triggerID).click();
                    }}>
                        NO
                    </button>
                </div>
            : void 0}
        </div>
    </Popup>
);

export default ButtonWithPopup;