import axios from 'axios';
import React, { useState, useEffect } from 'react';
import NewImageForm from './NewImageForm'

const App = () => {
  const [name, setName] = useState('');
  const [rgba, setRgba] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = 'picture.png';
    image.addEventListener('load', () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
    });
  }, []);

  const handleClick = (event) => {
    const getMousePosition = (event) => {
      return { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
    };
    const mousePosition = getMousePosition(event);
    const canvas = event.target;
    const context = canvas.getContext('2d');
    const { data: imageData } = context.getImageData(
      mousePosition.x,
      mousePosition.y,
      1,
      1
    );

    const getRgbaValues = (imageData) => {
      const rgba = [];
      imageData.reduce((acc, cv) => {
        acc.push(cv);
        return acc;
      }, rgba);
      return rgba;
    };

    const fetchColorName = async (rgba) => {
      try {
        const { data } = await axios.get(`/api/art/color/${rgba.toString()}`);
        setName(data.name.value);
      } catch (error) {
        console.error(error);
      }
    };

    let colorValues = getRgbaValues(imageData);
    setRgba(colorValues);
    fetchColorName(colorValues)
  };

  const handleSubmit = async(event, imageUrl) => {
    if(imageUrl){
      await axios.post(`/api/art/`, {url: imageUrl});
    }
  }

  return (
    <div id="ux">
      <canvas id="myCanvas" onClick={(e) => handleClick(e)}></canvas>
      <div id="display">
        <h2>Color: {name}</h2>
        <p>{`R: ${rgba[0]} G: ${rgba[1]} B: ${rgba[2]} A: ${rgba[3]}`}</p>
        <NewImageForm handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default App;
