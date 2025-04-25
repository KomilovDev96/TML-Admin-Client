import React from 'react'
import Lottie from "lottie-react";
import notfound from './Animation - 1745491730642.json'
import NotFoundStyle from './Style';
export default function NotFoundPage() {
  return (
    <NotFoundStyle>
      <Lottie animationData={notfound} loop={true} />
      <h2>NotFoundPage</h2>
    </NotFoundStyle>
  )
}
