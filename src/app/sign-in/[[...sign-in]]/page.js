"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-[24px] font-light uppercase tracking-[0.2em] text-black">
                        B-TASHNI
                    </h1>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-light">
                        Sign in to your account
                    </p>
                </div>

                <div className="flex justify-center">
                    <SignIn
                        appearance={{
                            elements: {
                                formButtonPrimary: "bg-black hover:bg-black/90 text-[11px] font-bold uppercase tracking-[0.2em] rounded-none py-4",
                                card: "shadow-none border-none p-0",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "rounded-none border-black/10 hover:bg-black/5 text-[11px] uppercase tracking-wider font-medium",
                                formFieldInput: "rounded-none border-black/10 focus:border-black focus:ring-0 text-[14px]",
                                footerActionText: "text-[12px] font-light",
                                footerActionLink: "text-[12px] font-bold hover:text-black/70",
                                identityPreviewText: "text-[12px]",
                                formResendCodeLink: "text-[12px] font-bold",
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
