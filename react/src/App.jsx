import {Route,Routes} from 'react-router-dom'
import Profile from './pages/Profile'


function App() {

  return (
    <>
     <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/user-profile' element={<Profile/>}/>
     </Routes>
    </>
  )
}

export default App
