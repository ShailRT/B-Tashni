'use client';

export default function DoNotSellPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-16 px-4 md:px-8">
            <div className="max-w-[800px] mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest uppercase mb-12 text-center text-[#191919]">
                    DO NOT SELL OR SHARE MY PERSONAL INFORMATION
                </h1>

                <div className="space-y-8 text-[#4a4a4a] leading-relaxed">
                    <section>
                        <p className="text-[15px]">
                            We do not sell your personal data as the concept of “selling” is traditionally understood as being the exchange of something for money. However, we share your personal information with third parties for the purpose of cross-contextual behavioral advertising purposes (e.g., targeted advertising and remarketing). Applicable U.S. state data protection laws hold such disclosures and sharing to be considered “selling” or “sharing”. Therefore, you have the right to opt out of such selling and sharing. In the preceding 12 months, we have sold or shared the following categories of personal data with the following categories of third parties and for the following purposes:
                        </p>
                    </section>

                    <section className="space-y-4">
                        <ul className="list-disc pl-5 space-y-4 text-[15px]">
                            <li>
                                <span className="font-bold text-[#191919]">Identifiers:</span> We provide such information to analytics, marketing, advertising and remarketing partners and services providers for analytical and targeted advertising purposes, including, to target advertisements to you for goods and services and by displaying those advertisements on other websites.
                            </li>
                            <li>
                                <span className="font-bold text-[#191919]">Internet or other electronic network activity information (e.g., cookies and other online unique identifiers):</span> We provide such information to analytics, marketing, advertising and remarketing partners and services providers for analytical and targeted advertising purposes, including, to target advertisements to you for goods and services and by displaying those advertisements on other websites.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <p className="text-[15px]">
                            For further information on such activities, please see our <a href="/privacy" className="underline font-bold text-black hover:text-gray-700">Privacy Policy</a>.
                        </p>
                        <p className="text-[15px] mt-4">
                            We do not knowingly sell or share for cross-contextual behavioral advertising purposes, the personal data of anyone under the age of 16 years old. See the “Children” section of this Privacy Policy for more information.
                        </p>
                        <p className="text-[15px] mt-4">
                            Under applicable data protection laws, you may have the right to opt-out of our “sale” or “sharing” of personal information to third parties. If you wish to opt-out of such “sales” please follow the opt-out instructions below. This is a limited opt-out that does not apply to information sold or shared prior to the Company receiving your request. Additionally, this opt-out is specific to us and does not apply to any third party activity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#191919] mb-4 uppercase tracking-wider">
                            Instructions
                        </h2>
                        <p className="text-[15px]">
                            If you want to opt out of the “selling” or “sharing” of your personal data for targeted advertising purposes, you can do so by changing your settings through the website’s Cookie Preferences button below. Specifically, you can opt out by de-selecting the cookie settings within the Cookie Preferences tool. Please note your preference with respect to the Cookie Preferences are device and browser specific, so you will need to change your preferences on each device and browser you use to interact with our online services. You must reset your preferences if you clear cookies or use a different browser or device.
                        </p>
                        <p className="text-[15px] mt-4">
                            Additionally, you can download the Global Privacy Control signal to opt out of the “selling” or “sharing” of your personal data for targeted advertising purposes. See here for more information on the Global Privacy Control <a href="https://globalprivacycontrol.org/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-black hover:text-gray-700">click here</a>. Note that if you opt out via the Global Privacy Control signal, you will need to turn it on for each supported browser or browser extension you use. If you have any questions, concerns, or would like more information about your ability to opt out, you can contact us by emailing: <a href="mailto:privacy@btashni.com" className="underline font-bold text-black hover:text-gray-700">privacy@btashni.com</a>
                        </p>
                    </section>

                    <section>
                        <p className="text-[14px] italic">
                            Please note that, regardless of the method you choose to opt-out, this is a limited opt-out that does not apply to information sold or shared prior to our receipt of your request.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
