import axios from 'axios';
import React, {useState, useEffect} from 'react'

const App = () => {
  const [name, setName] = useState('');
  const [rgba, setRgba] = useState([0,0,0,0])

  useEffect(() => {
    const canvas = document.getElementById('myCanvas')
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = 'picture.png';
    image.addEventListener('load', () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0 ,0)
    })
  }, []);

  handleClick = (event) => {
    const getMousePosition = (event) => {
      return {x: event.nativeEvent.offsetX, y:event.nativeEvent.offsetY}
    }
    const mousePosition = getMousePosition(event);
    const canvas = event.target;
    const context = canvas.getContext('2d');
    const {data: imageData} = context.getImageData(mousePosition.x, mousePosition.y, 1, 1);

    const getRgbaValues = (imageData) => {
      const rgba = [];
      imageData.reduce((acc, cv) => {
        acc.push(cv);
        return acc;
      }, rgba)
      return rgba
    };

    let colorValues = getRgbaValues(imageData);
    setRgba(colorValues);
  }

  return (
    <div><h1>Hello world!</h1></div>
  )
}

export default App
