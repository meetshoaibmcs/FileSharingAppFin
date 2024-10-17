import './App.css'
import Files from './components/Files'

function App() {

    return (
              <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Files />
                </Routes>
            </Router>
        </AuthProvider>
  )
}

export default App
