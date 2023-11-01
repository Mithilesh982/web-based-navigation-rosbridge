import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";
import Connection from "./components/Connection";
import Teleoperation from "./components/Teleoperation";
import RobotState from "./components/RobotState";

function App() {
  return (
    <div className="App">
      <Header />
      <Body></Body>
      <Connection/>
      <Teleoperation/>
      <RobotState/>
      <Footer />
    </div>
  );
}

export default App;
