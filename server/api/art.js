const router = require('express').Router();
const axios = require('axios');
const fs = require('fs');

const createFile = (response) => {
  const outputPath = '../client/public/picture.png';
  const output = fs.createWriteStream(outputPath);

  const stream = response.data;
  stream.on('data', (chunk) => {
    output.write(new Buffer.from(chunk));
  });
  stream.on('end', async () => {
    output.end();
  });
};

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://cdn.britannica.com/90/195990-050-4DD68279/Self-Portrait-Vincent-van-Gogh-Rijksmuseum-Amsterdam-1887.jpg',
      {
        responseType: 'stream',
      }
    );
    createFile(response);
    res.end();
  } catch (e) {
    console.error(e);
  }
});

router.get('/color/:rgba', async (req, res, next) => {
  try {
    const colorString = req.params.rgba;
    const { data } = await axios.get(
      `http://thecolorapi.com/id?rgb=${colorString}`
    );

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // fs.unlinkSync('../client/public/resized_pic.png', (err) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    // });

    fs.unlinkSync('../client/public/picture.png', (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    const newImageUrl = req.body.url;
    const response = await axios.get(newImageUrl, {
      responseType: 'stream',
    });
    createFile(response);
    //await resizeImage('../client/public/picture.png');
    res.end();
  } catch (error) {
    console.error(error);
  }
});

router.delete('/', async (req, res) => {
  fs.unlink('../client/public/resized_pic.png', (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.end();
});

module.exports = router;
