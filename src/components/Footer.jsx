import { useState } from 'react';
import ShippingStrip from "./ShippingStrip";

export default function Footer() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      <ShippingStrip />
      <footer className="bg-white pt-10 md:pt-20 pb-6 text-[#191919]">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 mb-15 md:mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:gap-4 lg:gap-8">

            {/* Center Section: STAY IN THE KNOW (Order 1 on Mobile, Center on Desktop) */}
            <div className="w-full md:w-[50%] md:max-w-md mx-auto order-1 md:order-2 flex flex-col items-center text-center mb-10 md:mb-0">
              <h2 className="font-extrabold text-lg md:text-[17px] tracking-widest mb-4 uppercase text-[#191919]">JOIN THE BTASHNI CIRCLE</h2>
              <p className="text-[14px] md:text-[13px] mb-5 text-[#4a4a4a] font-medium leading-relaxed">Be the first to experience new drops, limited releases, and everything happening inside BTASHNI.</p>
              <div className="w-full flex mb-4 border border-[#191919] h-12">
                <input type="text" placeholder="Enter your email for early access" className="flex-1 px-4 placeholder-gray-400 focus:outline-none text-[13px]" disabled />
                <button className="bg-[#292621] text-white px-5 flex items-center justify-center hover:bg-black transition-colors" disabled>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <p className="text-[12px] text-[#4a4a4a] mb-6 leading-[1.6] font-medium max-w-[380px]">
                By submitting your email you agree to receive recurring automated marketing messages from BTASHNI. View <a href="#" onClick={e => e.preventDefault()} className="underline font-bold text-black hover:text-gray-700">Terms</a> & <a href="#" onClick={e => e.preventDefault()} className="underline font-bold text-black hover:text-gray-700">Privacy</a>
              </p>
              <p className="text-[13px] text-[#4a4a4a] mb-4 font-medium">Text <span className="font-bold text-black text-[15px]">BTASHNI</span> to <span className="font-bold text-black text-[15px]">68805</span> to never miss a drop!</p>
              <p className="text-[12px] text-[#6b6b6b] leading-[1.6] font-medium max-w-[420px]">
                By texting BTASHNI to 68805, you agree to receive recurring automated promotional and personalized marketing text messages (e.g. cart reminders) from BTASHNI at the cell number used when signing up. Consent is not a condition of any purchase. Reply HELP for help and STOP to cancel. Msg frequency varies. Msg & data rates may apply. View <a href="#" onClick={e => e.preventDefault()} className="underline font-bold text-black hover:text-gray-700">Terms</a> & <a href="#" onClick={e => e.preventDefault()} className="underline font-bold text-black hover:text-gray-700">Privacy</a>.
              </p>
            </div>

            {/* Left Section: Help (Order 2 on Mobile, Left on Desktop) */}
            <div className="w-full md:w-[22%] order-2 md:order-1 border-t border-gray-200 md:border-t-0">
              <h3
                className="font-extrabold text-[#191919] text-[15px] md:text-[13px] tracking-widest uppercase py-4 md:py-0 md:mb-5 flex justify-between items-center md:flex-col md:items-center text-left md:text-center w-full cursor-pointer md:cursor-auto"
                onClick={() => setIsHelpOpen(!isHelpOpen)}
              >
                SUPPORT
                <span className="md:hidden text-[#191919]">
                  <svg className={`w-[22px] h-[22px] transition-transform duration-300 ${isHelpOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </h3>
              <ul className={`${isHelpOpen ? 'flex' : 'hidden'} md:flex flex-col space-y-[14px] text-[13px] text-[#4a4a4a] text-left md:text-center font-normal pb-6 md:pb-0 pl-3 md:pl-0 border-l-[1px] md:border-l-0 border-gray-200 ml-1 md:ml-0 translate-y-[-5px] md:translate-y-0`}>
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-black hover:underline">Returns</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-black hover:underline">Track Order</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-black hover:underline">Size Guide</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-black hover:underline">Shipping</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-black hover:underline">Contact</a></li>
              </ul>
            </div>

            {/* Right Section: More (Order 3 on Mobile, Right on Desktop) */}
            <div className="w-full md:w-[22%] order-3 md:order-3 border-t border-b border-gray-200 md:border-t-0 md:border-b-0">
              <h3
                className="font-extrabold text-[#191919] text-[15px] md:text-[13px] tracking-widest uppercase py-4 md:py-0 md:mb-5 flex justify-between items-center md:flex-col md:items-center text-left md:text-center w-full cursor-pointer md:cursor-auto"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
              >
                ABOUT BTASHNI
                <span className="md:hidden text-[#191919]">
                  <svg className={`w-[22px] h-[22px] transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </h3>
              <ul className={`${isMoreOpen ? 'flex' : 'hidden'} md:flex flex-col space-y-[14px] text-[13px] text-[#4a4a4a] text-left md:text-center font-normal pb-6 md:pb-0 pl-3 md:pl-0 border-l-[1px] md:border-l-0 border-gray-200 ml-1 md:ml-0 translate-y-[-5px] md:translate-y-0`}>
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-black hover:underline">Our Story</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-black hover:underline">Journal</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-black hover:underline text-left md:text-center">Careers</a></li>
              </ul>
            </div>

          </div>

          {/* Social Icons */}
          <div className="flex justify-center items-center gap-5 mt-10 md:mt-12 text-[#191919]">
            {/* IG */}
            <a href="#" onClick={e => e.preventDefault()} className="hover:opacity-70 transition-opacity"><svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            {/* FB */}
            <a href="#" onClick={e => e.preventDefault()} className="hover:opacity-70 transition-opacity"><svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg></a>
            {/* X/Twitter */}
            <a href="#" onClick={e => e.preventDefault()} className="hover:opacity-70 transition-opacity"><svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg></a>
            {/* YT */}
            <a href="#" onClick={e => e.preventDefault()} className="hover:opacity-70 transition-opacity"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg></a>
            {/* TikTok */}
            <a href="#" onClick={e => e.preventDefault()} className="hover:opacity-70 transition-opacity"><svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg></a>
          </div>
        </div>

        {/* Bottom Bar Container - This spreads wider than max-w-7xl */}
        <div className="w-full px-8 md:px-12">
          <div className="border-t border-gray-200 pt-6 flex flex-col items-center md:flex-row md:justify-between text-[11px] text-[#4a4a4a] relative">
            <div className="flex items-center gap-2 mb-6 md:mb-0 cursor-pointer text-black">
              <img src="https://flagcdn.com/w20/in.png" alt="India flag" className="w-[18px] h-3 rounded-sm object-cover" />
              <span className="font-semibold uppercase tracking-wide">DESIGNED IN INDIA</span>
            </div>

            <div className="flex flex-col md:flex-row text-center gap-4 md:gap-10 items-center flex-wrap justify-center mb-10 md:mb-0 font-medium whitespace-nowrap">
              <a href="#" onClick={e => e.preventDefault()} className="hover:text-black">CA Transparency Act</a>
              <a href="#" onClick={e => e.preventDefault()} className="hover:text-black">Accessibility</a>
              <a href="#" onClick={e => e.preventDefault()} className="hover:text-black">Privacy</a>
              <a href="#" onClick={e => e.preventDefault()} className="hover:text-black">Terms</a>
              <a href="#" onClick={e => e.preventDefault()} className="hover:text-black">Do Not Sell or Share My Personal Information</a>
            </div>

            <div className="md:relative absolute bottom-0 right-0">
              {/* <button className="bg-[#292621] text-white p-3 hover:bg-black transition-colors" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" /></svg>
              </button> */}
            </div>
          </div>
        </div>
      </footer>
    </>

  );
}
