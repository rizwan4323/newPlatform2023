import React from 'react';

class ContentSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            count: props.count,
            lastIndex: Math.ceil(props.children.length / props.count) - 1,
            interval: null
        };
        this.interval = false;
        this.autoPlay();
    }

    autoPlay(){
        if (this.props.autoPlay) {
            this.interval = setInterval(() => {
                this.nextSlide();
            }, this.props.timeToSlide);
        }
    };

    stopAutoPlay(props){
        if (props.autoPlay && props.pauseOnMouseOver) {
            clearInterval(this.interval);
        }
    }

    handleKeys(){
        document.addEventListener('keydown', (event) => {
            if(event.target.nodeName == "BODY"){
                const key = event.keyCode;
                switch (key) {
                    case 37: this.previousSlide();
                        break;
                    case 39: this.nextSlide();
                        break;
                }
            }
        });
    };

    previousSlide(){
        let index = this.state.index;
        index--;
        if (index === -1) index = this.state.lastIndex;
        this.setSlide(index);
    };

    nextSlide(){
        let index = this.state.index;
        if (index === this.state.lastIndex) index = 0;
        else index++;
        this.setSlide(index);
    };

    setSlide(i){
        this.setState({ index: i });
    };

    getSlides(){
        const { children } = this.props;
        let slides = [];
        let i = 0;
        while (i < children.length) {
            let slideItems = [];
            for (var j = 0; j < this.state.count && i < children.length; j++) {
                let slideItem = (
                    <section key={i} className="slider-item">
                        {children[i]}
                    </section>
                );
                slideItems.push(slideItem);
                i++;
            }
            let slide = (
                <section key={i} className="slider-slide">
                    {slideItems}
                </section>
            );
            slides.push(slide);
        }
        return slides;
    };

    componentDidMount(){
        this.handleKeys();
    }

    render() {
        const { index } = this.state;
        const { showDots } = this.props;
        const { dotsLocation } = this.props;
        let contentStyle = { left: index * -100 + "%" };
        const slides = this.getSlides();

        return (
            <section className="slider" onMouseOver={() => this.stopAutoPlay(this.props)}>
                <section className="slider-content" style={contentStyle}>
                    {slides}
                </section>
                {
                    showDots && slides.length > 1 &&
                    <section className="slider-dots" style={{justifyContent: dotsLocation}}>
                        {slides.map((slide, i) => {
                            const onClick = i === index ? null : () => this.setSlide(i);
                            return <span key={i} className={`slider-dot ${i === index ? "selected" : ""}`} onClick={onClick} />
                        })}
                    </section>
                }
            </section>
        );
    }
}

export default ContentSlider;