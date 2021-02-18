import React, { useState } from 'react';

const NewImageForm = (props) => {
  const [imageUrl, setImageUrl] = useState('');
  const { handleSubmit } = props;
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e, imageUrl)}>
        <input
          type="string"
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder={'image url'}
        ></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewImageForm;
