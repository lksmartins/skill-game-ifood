import React, { Component } from 'react'
import Slider from 'react-slick'

import '../node_modules/slick-carousel/slick/slick.css'
import '../node_modules/slick-carousel/slick/slick-theme.css'

export default class Carousel extends Component {

  render() {
      
    const settings = this.props.settings || {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      adaptiveHeight: true
    };
    const { children } = this.props

    return (
        <Slider {...settings}>
            {children}
        </Slider>
    );
  }
  
}