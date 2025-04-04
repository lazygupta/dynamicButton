import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ModeToggle } from './components/mode-toggle';
import Output from "./pages/OutputPage";
import MainPage from "./pages/ConfigPage";

function App() {

  return (
    <>

      <div className="flex-col ">
        <div className="flex justify-end m-5">
          <ModeToggle />
        </div>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/output" element={<Output />} />
          </Routes>
        </BrowserRouter>
      </div>



    </>

  )
}

export default App;
