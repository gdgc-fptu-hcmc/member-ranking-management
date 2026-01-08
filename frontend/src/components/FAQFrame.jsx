import React, { useLayoutEffect, useRef, useState } from "react";

const FAQFrame = ({question, answer, borderColor}) => {
    const [expanded, setExpanded] = useState(false);
    const answerRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);

    useLayoutEffect(()=>{
        if(!answerRef.current) return;
        const h = answerRef.current.scrollHeight;
        setMaxHeight(expanded ? h : 0);
    },[expanded, answer])
  return (
    <div className="border border-solid rounded-xl py-0 px-8 my-4 mx-16 shadow-md text-[18px]" style={{ borderColor}}>
      <div className="py-6 px-0 cursor-pointer font-bold text-[24px] flex justify-between w-full">
        <div>{question}</div>
        <span className={`material-symbols-outlined !text-5xl font-normal transition-transform duration-200 ${expanded ? "rotate-180": ""}`}
        onClick={()=> setExpanded(prev=> !prev)}
        >expand_circle_down</span>

      </div>
        <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight }}
      >
        <div
          ref={answerRef}
          className="border-t
            px-4
            pb-6 pt-4
            text-[16px]
            leading-relaxed
            whitespace-pre-line"
        >
          {answer}
        </div>
      </div>
      
    </div>
  );
};

export default FAQFrame;
