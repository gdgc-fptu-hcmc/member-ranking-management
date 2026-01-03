import headerb from "../assets/headerb.webp"

function IntroSectionLanding() {
  return (
    <div className="w-full py-6 px-22 flex flex-col align-middle ">
      <div className="rounded-xl overflow-hidden">
        <img
          className="w-full"
          src={headerb}
          alt="header-logo"
        />
      </div>

      <h1 className=" text-center font-bold my-5 text-4xl">
        Welcome to
        <br />
        <span>GDG on Campus FPT University - Ho Chi Minh City, Vietnam</span>
      </h1>

      <div className="text-center">
        <div className="mb-3">Scroll for more</div>
        <span className="material-symbols-rounded animate-scroll-down">keyboard_arrow_down</span>
      </div>
      
    </div>
  );
}

export default IntroSectionLanding;
