import logo from "../assets/logo.svg"
import assist from "../assets/assist.png"
import { useEffect, useState } from "react";

function NavBar() {
  const [opacity, setOpacity] = useState(0);
  useEffect(()=>{
    function handleScroll(){
      if(window.scrollY > window.innerHeight - 250){
      setOpacity(1);
    }
    else{
      setOpacity(0);
    }
    }
    window?.addEventListener("scroll", handleScroll);
    return () => {
      window?.removeEventListener("scroll", handleScroll);
    }
  },[])
  return (
    <div className={`sticky top-0 flex gap-5  z-50 h-25 bg-[#fafafa] px-20 ${opacity === 1 ? "shadow-md" : "shadow-none"}`}>
      <img src={logo} alt="gg-logo" />
      <div className="flex flex-1 justify-between items-center">
        <div className={` transition-opacity duration-200 ${opacity === 1 ? "opacity-100" : "opacity-0"}`}>
          <h1 className="text-[#1a2a56] font-bold text-[32px]">Google Developer Group</h1>
          <div className="flex gap-2.5 items-center">
            <span className="text-[#4385f3]">On Campus</span>
            <span>•</span>
            <span>FPT University HCMC</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div>Member</div>
          <div>Event</div>
          <div>Gallery</div>
          <div>FAQ</div>
          <div>
            <img
              className="h-5"
              src={assist}
              alt="assist-logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
