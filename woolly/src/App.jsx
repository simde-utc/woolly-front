import React from 'react';
import Header from './components/Header';

const HEADER_HEIGHT = '64px';

class App extends React.Component {
  render() {
    return (
      <div style={{ paddingTop: HEADER_HEIGHT }}>
        <Header height={HEADER_HEIGHT} />
        slt
      </div>
    );
  }
}

export default App;
