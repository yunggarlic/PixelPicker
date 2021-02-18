const router = require('express').Router();
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp')

const createFile = async (response) => {
  const outputPath = './public/picture.png';
  const output = fs.createWriteStream(outputPath);

  const stream = response.data;
  stream.on('data', (chunk) => {
    output.write(new Buffer.from(chunk));
  });
  stream.on('end', async () => {
   await output.end();
  });
};

const resizeFile = (response) => {
  sharp(response).resize({width: 500}).toFile('./public/picture.png')
}

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.holland.com/upload_mm/2/5/2/56781_fullimage_vincent_van_gogh.jpg',
      {
        responseType: 'arraybuffer',
      }
    );
    //await createFile(response);
    resizeFile(response.data)
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

    // fs.unlinkSync('./public/picture.png', (err) => {
    //   if (err) {
    //     return;
    //   }
    // });

    const newImageUrl = req.body.url;
    const response = await axios.get(
      newImageUrl,
      {
        responseType: 'arraybuffer',
      }
    );
    resizeFile(response.data)
    res.end();
  } catch (error) {
    console.error(error);
  }
});

router.delete('/', async (req, res) => {
  fs.unlink('./public/resized_pic.png', (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.end();
});

module.exports = router;
