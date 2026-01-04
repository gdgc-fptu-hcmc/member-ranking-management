import NavBar from "../components/NavBar";
import AboutUsLanding from "../components/AboutUsLanding";
import IntroSectionLanding from "../components/IntroSectionLanding";
import GallerySection from "../components/GallerySection";


const LandingPage = () => {
    return (
      <>
        <NavBar />
        <IntroSectionLanding /> 
        <AboutUsLanding />
        <GallerySection/>
        <AboutUsLanding />
      </>
    )
}

export default LandingPage;