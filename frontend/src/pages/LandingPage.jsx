import NavBar from "../components/NavBar";
import AboutUsLanding from "../components/AboutUsLanding";
import IntroSectionLanding from "../components/IntroSectionLanding";
import GallerySection from "../components/GallerySection";
import Footer from "../components/footer";

const LandingPage = () => {
    return (
      <>
        <NavBar />
        <IntroSectionLanding /> 
        <AboutUsLanding />
        <GallerySection/>
        <AboutUsLanding />
        <Footer/>
      </>
    )
}

export default LandingPage;