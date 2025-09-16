import { useEffect } from 'react';
import './App.css';
import TrainingTrackerComponent from './Components/TraningTrackerComponent';
 
function App() {
  //  useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     // Block F5 (key = F5)
  //     if (e.key === "F5") {
  //       e.preventDefault();
  //       alert("Refresh is disabled in this application.");
  //     }

  //     // Block Ctrl+R (or Cmd+R on Mac)
  //     if ((e.ctrlKey || e.metaKey) && e.key === "r") {
  //       e.preventDefault();
  //       alert("Refresh is disabled in this application.");
  //     }
  //   };

  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = ""; // Required for Chrome
  //     return "";
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);
  return (
      
      <div className="App" >        
        <TrainingTrackerComponent />
      </div>    
  );
}

export default App;
