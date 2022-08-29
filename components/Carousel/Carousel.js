import React, { Component } from 'react'
import Slider from 'react-slick'

import styles from './carousel.module.css'
import '../../node_modules/slick-carousel/slick/slick.css'
import '../../node_modules/slick-carousel/slick/slick-theme.css'

function randomIntFromInterval(min, max, removed) { // min and max included 
  let n = Math.floor(Math.random() * (max - min + 1) + min)
  while(removed.includes(n)){
    n = Math.floor(Math.random() * (max - min + 1) + min)
  }
  removed.push(n)
  return n
}

export default class Carousel extends Component { 

  render() {

    console.log('carousel component')
    
    const SLIDES_TO_SHOW = 8
    const PAGES = 2

    const settings = this.props.settings || {
      autoplay: true,
      autoplaySpeed: 5000,
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: SLIDES_TO_SHOW,
      slidesToScroll: SLIDES_TO_SHOW,
      arrows: false,
      adaptiveHeight: true,
      className: styles.carousel
    };
    const { children } = this.props

    //console.log('len',children.length, children.length/6)

    //const items = children.sort(() => 0.5 - Math.random());
    const items = children
    const removedElements = []
    //console.log("🚀 ~ file: Carousel.js ~ line 44 ~ Carousel ~ render ~ items.length/SLIDES_TO_SHOW < PAGES", items.length/SLIDES_TO_SHOW < PAGES)

    while(items.length/SLIDES_TO_SHOW < PAGES){
      items.push(items[randomIntFromInterval(0,items.length-SLIDES_TO_SHOW,removedElements)])
    }

    //console.log(removedElements)

    return (
        <Slider {...settings}>
            {children.map(item=>{return <div key={item} className={styles.slide}>{item}</div>})}
        </Slider>
    );
  }
  
}