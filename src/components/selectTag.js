import React from 'react';

class SelectTag extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.runScript();
    }

    componentDidUpdate(prevProps){
        if(prevProps.value !== this.props.value) {
            let selectTag = document.querySelector("." + this.props.name + " select");
            if (selectTag) {
                let value = selectTag.options[selectTag.selectedIndex].innerText;
                let icon = this.props.icon;
                if (icon) icon = `<span class="${icon}" style="margin-right: 5px;"></span>`;
                document.querySelector("." + this.props.name + " .select-selected").innerHTML = (icon ? icon + value : value);
            }
        }
    }

    runScript(){
        var icon = this.props.icon;
        if(icon) icon = `<span class="${icon}" style="margin-right: 5px;"></span>`;

        var x, i, j, selElmnt, a, b, c, self = this;
        /* look for any elements with the class "custom-select": */
        x = document.getElementsByClassName(this.props.name);
        for (i = 0; i < x.length; i++) {
            selElmnt = x[i].getElementsByTagName("select")[0];
            /* for each element, create a new DIV that will act as the selected item: */
            a = document.createElement("DIV");
            a.setAttribute("class", "select-selected");
            // start seting dropdown value
            a.innerHTML = ""; // reset first
            if(icon) a.innerHTML = icon; // add icon if has
            a.innerHTML += selElmnt.options[selElmnt.selectedIndex].innerHTML; // add normal innerhtml
            // end seting dropdown value
            x[i].appendChild(a);
            /* for each element, create a new DIV that will contain the option list: */
            b = document.createElement("DIV");
            b.setAttribute("class", "select-items select-hide");
            for (j = 0; j < selElmnt.length; j++) {
                /* for each option in the original select element, create a new DIV that will act as an option item: */
                c = document.createElement("DIV");
                c.innerHTML = selElmnt.options[j].innerHTML;
                c.addEventListener("click", function(e) {
                    /* when an item is clicked, update the original select box, and the selected item: */
                    var y, i, k, s, h;
                    s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                    h = this.parentNode.previousSibling;
                    for (i = 0; i < s.length; i++) {
                        if (s.options[i].innerHTML == this.innerHTML) {
                            s.selectedIndex = i;
                            // start seting dropdown value
                            h.innerHTML = ""; // reset first
                            if(icon) h.innerHTML = icon; // add icon if has
                            h.innerHTML += this.innerHTML; // add normal innerhtml
                            // end seting dropdown value
                            y = this.parentNode.getElementsByClassName("same-as-selected");
                            for (k = 0; k < y.length; k++) {
                                y[k].removeAttribute("class");
                            }
                            this.setAttribute("class", "same-as-selected");
                            var configEvent = {
                                target: {
                                    name: selElmnt.name,
                                    value: selElmnt.value,
                                }
                            }
                            self.props.onChange(configEvent);
                            break;
                        }
                    }
                    h.click();
                });
                b.appendChild(c);
            }
            x[i].appendChild(b);
            a.addEventListener("click", function(e) {
                /* when the select box is clicked, close any other select boxes, and open/close the current select box: */
                e.stopPropagation();
                closeAllSelect(this);
                this.nextSibling.classList.toggle("select-hide");
                this.classList.toggle("select-arrow-active");
            });
        }
        function closeAllSelect(elmnt) {
            /* a function that will close all select boxes in the document, except the current select box: */
            var x, y, i, arrNo = [];
            x = document.getElementsByClassName("select-items");
            y = document.getElementsByClassName("select-selected");
            for (i = 0; i < y.length; i++) {
                if (elmnt == y[i]) {
                    arrNo.push(i)
                } else {
                    y[i].classList.remove("select-arrow-active");
                }
            }
            for (i = 0; i < x.length; i++) {
                if (arrNo.indexOf(i)) {
                    x[i].classList.add("select-hide");
                }
            }
        }
        /* if the user clicks anywhere outside the select box, then close all select boxes: */
        document.addEventListener("click", closeAllSelect);
    }

    render() {
        const extraClassName = this.props.className ? this.props.className+" " : "";
        return (
            <div className={extraClassName+"custom-select "+this.props.name} style={this.props.style}>
                <select id="select" name={this.props.name} value={this.props.value} onChange={() => null}>
                    {this.props.options}
                </select>
            </div>
        );
    }
}
export default SelectTag;