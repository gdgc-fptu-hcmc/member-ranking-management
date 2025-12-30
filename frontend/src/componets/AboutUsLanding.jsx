import React from 'react';

const AboutUsLanding = () => {
  return (
    <section className="w-full bg-white py-10 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        
        {/* Cột Trái: Hình ảnh */}
        <div className="w-full md:w-3/5 relative">
          {/* Trang trí chấm bi xanh (giả lập) ở góc trái trên */}
          <div className="absolute -left-4 -top-4 hidden md:flex flex-col gap-1 z-0">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
             ))}
          </div>

          {/* Ảnh chính */}
          <div className="relative z-10 bg-white p-2 rounded-xl shadow-lg border border-gray-100">
            <img 
              src="/img/banner.webp"
              alt="GDGoC Team FPTU" 
              className="w-full h-auto rounded-lg object-cover"
            />
            
            {/* Tag năm học (Màu vàng ở góc phải) */}
            <div className="absolute top-4 right-0 bg-yellow-400 text-black font-bold px-4 py-1 shadow-md">
            </div>
          </div>
        </div>

        {/* Cột Phải: Nội dung chữ */}
        <div className="w-full md:w-2/5 flex flex-col gap-4">
          {/* Tiêu đề chính */}
          <h2 className="text-5xl md:text-6xl font-extrabold text-red-500 leading-tight">
            About  us
          </h2>

          {/* Tiêu đề phụ */}
          <h3 className="text-xl md:text-2xl font-bold text-black uppercase tracking-wide">
             GDGoC - FPTU HCMC
          </h3>

          {/* Đoạn văn mô tả */}
          <p className="text-gray-600 text-justify leading-relaxed text-xl ">
            Google Developer Groups (GDG) on Campus FPT University HCMC are tech student 
            community groups at FPT University Ho Chi Minh City who are interested in 
            Google developer technologies. We often build playgrounds for tech students 
            based on learning Google's technologies and applying them to create useful 
            products for the community with the following orientation.
          </p>
        </div>

      </div>
    </section>
  );
};

export default AboutUsLanding;