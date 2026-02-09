import logo_horizontal from "../assets/logo-horizontal-with-text.png";
import gemini from "../assets/gemini.png"
function TopBrandBar() {
  return (
    <div className="bg-white border-b">
      <div className="h-14 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 w-60">
          <img src={logo_horizontal} alt="" />
        </div>

        <div className="flex items-center gap-2 w-25">
         <img src={gemini} alt="" />
        </div>
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-red-500 via-blue-500 via-yellow-400 to-green-500" />
    </div>
  );
}
export default TopBrandBar
