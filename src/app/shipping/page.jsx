import React from "react";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-white text-[#191919] pt-24 md:pt-32 pb-16 px-6 md:px-12 max-w-[1000px] mx-auto">
      <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-widest text-center mb-16">
        Shipping Policy
      </h1>

      <div className="space-y-12 text-[14px] md:text-[15px] text-[#4a4a4a] leading-[1.8] font-medium">
        {/* SHIP METHODS */}
        <section>
          <h2 className="font-extrabold text-lg md:text-[17px] tracking-widest mb-6 uppercase text-[#191919] border-b border-gray-200 pb-3">
            Ship Methods
          </h2>
          <p className="mb-4">We offer free shipping on all orders over $75 in the U.S.</p>
          <p className="mb-4">We have the following shipping options available in the U.S.</p>
          <ul className="list-disc pl-6 mb-4 space-y-3">
            <li><span className="font-bold text-black">Economy</span> - Delivery in 4 to 7 Business Days via UPS/USPS</li>
            <li><span className="font-bold text-black">Standard</span> - Delivery in 3 to 5 Business Days via UPS/USPS</li>
            <li><span className="font-bold text-black">Express</span> - Order by Noon ET. Processing begins that same day. Delivery in 2 to 3 Business Days via UPS</li>
            <li><span className="font-bold text-black">Priority</span> - Order by Noon ET. Processing begins that same day. Delivery in 1 to 2 Business Days via UPS</li>
          </ul>
          <p className="mb-4">Please expect a processing time of 1-2 business days for orders placed with standard shipping.</p>
          <p className="mb-4">If shipping to a P.O. Box or APO/FPO address, you must select Economy. Please note transit times will vary.</p>
          <p>Please note we do not ship to freight forwarding address.</p>
        </section>

        {/* SHIPMENT TRACKING */}
        <section>
          <h2 className="font-extrabold text-lg md:text-[17px] tracking-widest mb-6 uppercase text-[#191919] border-b border-gray-200 pb-3">
            Shipment Tracking
          </h2>
          <p className="mb-4">
            You can track your order via the Shipment Notification E-mail(s), Order Confirmation Page or the Account section on BTASHNI.com / BTASHNI App.
          </p>
          <p className="mb-4">
            Please note that you may receive more than one Shipment Notification E-mail if item(s) from your order are shipping separately.
          </p>
          <p>
            If tracking information on the shipping carrier page for your order is not showing activity/movement for more than 5 business days, please contact Customer Service.
          </p>
        </section>

        {/* LOST OR STOLEN PACKAGES */}
        <section>
          <h2 className="font-extrabold text-lg md:text-[17px] tracking-widest mb-6 uppercase text-[#191919] border-b border-gray-200 pb-3">
            Lost or Stolen Packages
          </h2>
          <p className="mb-4">
            We know carrier issues and delays can happen. We find that some carriers may scan a package as “Delivered” when it is still out for delivery and will sometimes physically deliver the parcel within the next four business days.
          </p>
          <p className="mb-4">
            After 4 business days, if your order is showing as "Delivered” by the carrier, and you have still not located your package, and you have checked the area surrounding your delivery address please contact Customer Service for assistance.
          </p>
          <p className="mb-4">
            Please note, BTASHNI is not liable for missing packages marked delivered. If you believe this was mis-delivered, we recommend filing a claim with the carrier directly. At this time, we're not currently set up for reshipment orders or exchanges and require that a new order is placed with the returned funds.
          </p>
          <p>
            If the carrier’s tracking link for your order is not showing activity or movement for more than 5 business days, please contact Customer Service to investigate.
          </p>
        </section>
      </div>
    </div>
  );
}
