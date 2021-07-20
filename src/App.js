import './App.css';
import Form from './Form';

function App() {

  return (
    <div className="App" style={styles}>
      <Form/>
    </div>
  );
}

export default App;

const styles = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent:'center',
  background: 'rgba(82, 91, 100, 0.3)'
}
