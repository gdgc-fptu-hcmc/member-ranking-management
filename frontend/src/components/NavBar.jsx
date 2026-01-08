import logo from "../assets/logo.svg";
import assist from "../assets/assist.png";
import { useEffect, useState } from "react";

const menuNav = [
  { name: "Members", id: "section-members", color: "text-[#109d58]" },
  { name: "Events", id: "section-events", color: "text-[#4385f3]" },
  { name: "Gallery", id: "section-gallery", color: "text-[#fabc05]" },
  { name: "FAQ", id: "section-faq", color: "text-[#e94436]" },
];
function NavBar() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > window.innerHeight - 250) {
        setOpacity(1);
      } else {
        setOpacity(0);
      }
    }
    window?.addEventListener("scroll", handleScroll);
    return () => {
      window?.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className={`sticky top-0 z-20 flex gap-5 h-24 bg-[#fafafa] px-20 ${
        opacity === 1 ? "shadow-md" : "shadow-none"
      }`}
    >
      <img src={logo} alt="gg-logo" />
      <div className="flex flex-1 justify-between items-center">
        <div
          className={`transition-opacity duration-200 ${
            opacity === 1 ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-[#1a2a56] font-bold text-[32px]">
            Google Developer Group
          </h1>
          <div className="flex gap-2.5 items-center">
            <span className="text-[#4385f3]">On Campus</span>
            <span>•</span>
            <span>FPT University HCMC</span>
          </div>
        </div>
        <div className="flex items-center gap-10 h-full">
          {menuNav?.map((item) => (
            <div
              className={`flex items-center text-[18px] px-6 py-4 font-bold cursor-pointer ${item.color} hover:bg-[#0001] h-full  transition-colors duration-200`}
              key={item.id}
              onClick={()=>{
                const target = document.getElementById(item.id);
                if(!target) return;
                const off = target.offsetTop;
                window?.scrollTo({
                  top: off - 120,
                  behavior: "smooth"
                })
              }}
            >
              {item.name}
            </div>
          ))}
          <div className="flex items-center text-[18px] px-6 py-4 font-bold cursor-pointer hover:bg-[#0001] h-full  transition-colors duration-200">
            <img className="h-10  " src={assist} alt="assist-logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;