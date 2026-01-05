import React from 'react';
import logo from "../assets/logo.svg";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
          
          {/* --- Phần bên trái: Logo & Tên tổ chức --- */}
          <div className="flex items-center gap-3">
            {/* Đây là chỗ đặt Logo hình ảnh. Bạn thay src bằng đường dẫn ảnh thật nhé */}
            <img 
              src={logo}
              alt="GDG Logo" 
              className="h-8 w-auto object-contain"
            />
            
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-base leading-tight">
                Google Developer Group
              </span>
              <span className="text-gray-600 text-sm">
                On Campus • FPT University HCMC
              </span>
            </div>
          </div>

          {/* --- Phần bên phải: Thông tin & Địa chỉ --- */}
          <div className="flex flex-col items-start md:items-end text-left md:text-right gap-1 text-sm text-gray-700">
            
            {/* Dòng 1: Fonts link */}
            <p>
              Fonts and Icons provided by{' '}
              <a href="https://fonts.google.com" className="text-blue-600 hover:underline">
                Google Fonts
              </a>
            </p>

            {/* Dòng 2: Copyright */}
            <p className="text-gray-500">
              &copy;GDGoC FTPU HCM 2024 - All Right Reserved
            </p>

            {/* Dòng 3: Địa chỉ + Icon */}
            <div className="flex items-start justify-end gap-2 mt-1 max-w-md">
                {/* Icon Location (image) */}
                <img
                  src={logo}
                  alt="Location"
                  className="w-5 h-5 flex-shrink-0 mt-0.5 object-contain"
                />
              
              <span>
                Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000
              </span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;