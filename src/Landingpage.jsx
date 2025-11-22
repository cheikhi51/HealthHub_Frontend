import Navbar from './Components/Navbar';
import Home from './Components/Home';
import About from './Components/About';
import Service from './Components/Service';
import FAQ from './Components/FAQ';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
function Landingpage() {
  return (
    <div>
        <Navbar />
        <Home />
        <About />
        <Service />
        <FAQ />
        <Contact />
        <Footer />
    </div>
  );
}
export default Landingpage;