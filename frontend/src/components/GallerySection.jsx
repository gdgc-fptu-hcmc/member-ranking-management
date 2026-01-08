import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Pagination } from "swiper/modules";
const images = [
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/Copy%2520of%25201_7rb6hY2.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/Copy%2520of%25204_LBI8aIa.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/Copy%2520of%25205_tlTtyCT.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/Copy%2520of%25208_r7rneAI.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/Copy%2520of%25203_ZXutMXi.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/Copy%2520of%252014_OAMtHzm.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/Copy%2520of%25206_xFPxuOa.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/Copy%2520of%252011_MkPYwH2.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/Copy%2520of%25209_b3FXrFB.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/Copy%2520of%252015_8P8rzRc.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/17_gFkBVjT.png",
  "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,h_500,q_auto:good,w_500/v1/gcs/platform-data-goog/chapter_photos/13_NWcKl8M.png",
];
function GallerySection() {
  return (
    <div className="w-[calc(100%-80px*2)] max-w-[1500px] mx-auto my-6 min-h-[100px]">
      <h1 id="section-gallery" className="text-center text-[45px] font-bold text-[#fabc05] mb-6">
        Gallery
      </h1>
      <div>
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination, Autoplay]}
          slidesPerView={4}
          slidesPerGroup={4}
          spaceBetween={20}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          className="mySwiper w-full h-[350px]"
        >
          {images.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="p-2">
                <div className="rounded-xl
                  border border-transparent
                  transition-all
                  duration-500
                  ease-in-out
                  hover:scale-[1.04]
                  hover:border-black
                  hover:shadow-xl">
                  <img
                    src={item}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default GallerySection;
