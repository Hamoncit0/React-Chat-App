import './App.css'
import Login from './components/login/login'
import MainPage from './components/main-page/main-page'
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom'
function App() {

  return (
    <div>
    <Router>
      <Routes>
        <Route path="/main" element={
          <>
            <MainPage/>
          </>} />
        <Route path="/" element={
          <>
            <Login />
          </>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </div>
  )
}

export default App
