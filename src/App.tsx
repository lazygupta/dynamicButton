import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ModeToggle } from './components/mode-toggle';
import WorkflowOutput from "./pages/OutputPage";
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
              <Route path="/config" element={<MainPage />} />
              <Route path="/output" element={<WorkflowOutput />} />
            </Routes>
          </BrowserRouter>
        </div>
      


    </>

  )
}

export default App;
