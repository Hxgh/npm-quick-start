import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
// import Ac from 'npm-quick-start';
import Ac from '../../src/index';

const App = () => {
  return (
    <div>
      <Ac />
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById('root'));
