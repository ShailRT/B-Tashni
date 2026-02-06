import ShippingStrip from "./ShippingStrip";

export default function Footer() {
  return (
    <>
      <ShippingStrip />
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <h5 className="font-bold text-sm uppercase tracking-wide mb-4">
                Subscribe
              </h5>
              <p className="text-xs text-gray-500 mb-4 max-w-xs">
                Sign up for our newsletter to get the latest news, announcements,
                and special offers.
              </p>
              <div className="flex border-b border-gray-300 pb-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full outline-none text-sm placeholder:text-gray-400"
                />
                <button className="text-xs font-bold uppercase ml-2">Join</button>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wide mb-4">
                Help
              </h5>
              <ul className="space-y-3 text-xs text-gray-500">
                <li>
                  <a href="#" className="hover:text-black">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Orders
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wide mb-4">
                About
              </h5>
              <ul className="space-y-3 text-xs text-gray-500">
                <li>
                  <a href="#" className="hover:text-black">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wide mb-4">
                Social
              </h5>
              <ul className="space-y-3 text-xs text-gray-500">
                <li>
                  <a href="#" className="hover:text-black">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    TikTok
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 uppercase tracking-wide">
            <p>
              © {new Date().getFullYear()} B-Tashni. All Rights Reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </>

  );
}
