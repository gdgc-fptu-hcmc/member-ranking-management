import React from "react";
import FAQFrame from "./FAQFrame";

const content = [
  {
    question: "Google Developer Groups (GDG) là gì?",
    answer: "Google Developer Groups (GDG) là những tổ chức lớn nhất thế giới. Hơn 1000 GDG hiện đang có mặt tại hơn 140 quốc gia trên toàn cầu. Chương trình giúp các nhà phát triển kết nối với nhau và tìm hiểu về cách xây dựng sản phẩm của Google. Tại GDG, bạn sẽ được gặp gỡ những chuyên gia đầu ngành, luôn sẵn sàng chia sẻ kiến thức và đồng hành trong hành trình phát triển kỹ năng công nghệ của mình.",
    borderColor: "#1a2a56",
  },
  {
    question: "Google Developer Groups on Campus (GDGoC) là gì?",
    answer: "GDGoC là nhánh mở rộng của GDG, được thành lập dành riêng cho các bạn sinh viên đam mê công nghệ tại các trường đại học trên toàn thế giới. GDGoC là nơi bạn không chỉ được truyền cảm hứng mà còn có cơ hội thực hành và ứng dụng những công nghệ mới nhất vào thực tiễn.",
    borderColor: "#e94436",
  },
  {
    question: "GDGoC có những hoạt động gì?",
    answer: "Bên cạnh việc giao lưu học hỏi, chia sẻ kiến thức, kinh nghiệm nội bộ thì GDGoC chúng mình còn  thường xuyên phối hợp với các cộng đồng khác trong hệ sinh thái của Google địa phương để tăng thêm sự kết nối (mở rộng mqh) giữa các nhà phát triển có cùng đam mê công nghệ. Đặc biệt các bạn sẽ có cơ hội sử dụng miễn phí một số công nghệ của Google và tham gia các buổi DevFest - Hội nghị công nghệ do các nhóm phát triển của Google tổ chức (GDG) mang đến các chủ đề thú vị, cập nhật và hướng dẫn cách sử dụng các xu hướng công nghệ mới nhất của Google.  Không chỉ thế, GDGoC cũng là nơi để các bạn sinh viên tài năng có cơ hội thể hiện bản thân ở các cuộc thi mang tầm quốc tế của Google như Hackathon, Solution Challenge, etc.",
    borderColor: "#109d58",
  },
  {
    question: "GDGoC PFTU sử dụng những công nghệ gì?",
    answer: `- Frontend: ReactJS, Angular, VueJS.
- Backend: Python, NodeJS, Java.
- Mobile: Android native, Flutter.
- Google Services: Firebase, Vertex AI, Google Cloud, TensorFlow, JAX, Keras, etc.`,
    borderColor: "#fabc05"
  },
];
const FAQSections = ({onChatToggle}) => {
  return (
    <div className="max-w-375 my-6 mx-auto w-[calc(100%-80px*2)]">
      <h1 className="text-5xl text-center text-[#1a2a56] font-bold mb-5" id="section-faq">
        Frequently Asked Question
      </h1>
      <div className="flex h-25 border border-solid border-[#e94436] rounded-xl items-center justify-between py-0 px-8 my-4 mx-16 shadow-md text-[18px]">
        Try using our AI powered Assistant to help you answer your inqueries
        <div className="py-2 px-4 border-2 border-solid border-[#1a2a56] hover:bg-[#1a2a56] hover:text-white transition-colors duration-200"
         onClick={onChatToggle}
        >
          Open chat
        </div>
      </div>
      <div>
        {
            content.map((item)=>(
                <FAQFrame
                question={item.question}
                answer={item.answer}
                borderColor={item.borderColor}
                />
            ))
        }
      </div>
    </div>
  );
};

export default FAQSections;

