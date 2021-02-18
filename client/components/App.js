import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import NewImageForm from './NewImageForm';

const App = () => {
  const [name, setName] = useState('');
  const [rgba, setRgba] = useState([0, 0, 0, 0]);
  const [imageTrigger, setImage] = useState({})
  const canvas = useRef(null)



  useEffect(() => {
    const context = canvas.current.getContext('2d');
    const image = new Image();
    image.src = 'picture.png';
    image.addEventListener('load', () => {
      canvas.current.width = image.naturalWidth;
      canvas.current.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
    });
    return () => {
      image.removeEventListener('load', () => {
        canvas.current.width = image.naturalWidth;
        canvas.current.height = image.naturalHeight;
        context.drawImage(image, 0, 0);
      });
    }
  }, []);


  const handleClick = (event) => {
    const getMousePosition = (event) => {
      return { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
    };
    const mousePosition = getMousePosition(event);
    const context = canvas.current.getContext('2d');
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
    fetchColorName(colorValues);
  };

  const handleSubmit = async (event, imageUrl) => {
    if (imageUrl) {
      await axios.post(`/api/art/`, { url: imageUrl });
    }

  };

  return (
    <div id="pixelpicker">
      <canvas id="myCanvas" ref={canvas} onClick={handleClick}></canvas>
      <div id="ui">
        <h2>Color: {name}</h2>
        <div
          style={{
            width: 200,
            height: 200,
            border: '1px solid black',
            backgroundColor: `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`,
          }}
        ></div>
        <p>{`R: ${rgba[0]} G: ${rgba[1]} B: ${rgba[2]} A: ${rgba[3]}`}</p>
        <NewImageForm handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default App;
