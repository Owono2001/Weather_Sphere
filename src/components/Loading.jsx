import React from 'react';
import { PuffLoader } from 'react-spinners';

const Loading = () => (
  <div className="loading">
    <PuffLoader color="#2a9d8f" size={80} />
  </div>
);

export default Loading;