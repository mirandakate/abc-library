import React from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import Toaster from "../Toaster";
import ModalConfirm from "../Modal/Confirm";
import ModalSlideOver from "../Modal/SlideOver";
import RecentBorrowed from "./RecentBorrowed";

interface MainContainerProps {
    children: React.ReactNode;
}

const MainContainer: React.FunctionComponent<MainContainerProps> = ({ children }) => {
    return (
        <>
            {/* Background color split screen for large screens */}
            <div className="fixed top-0 left-0 w-1/2 h-full bg-white" aria-hidden="true" />
            <div className="fixed top-0 right-0 w-1/2 h-full bg-gray-50" aria-hidden="true" />
            <div className="relative min-h-full flex flex-col">
                {/* Navbar */}
                <Navbar />

                {/* 3 column wrapper */}
                <div className="flex-grow w-full mx-auto lg:flex">
                    {/* Left sidebar & main wrapper */}
                    <div className="flex-1 min-w-0 bg-white xl:flex">
                        {/* Account profile */}
                        <SideNav />
                        {/* Projects List */}
                        {children}
                    </div>

                    {/* Activity borrowed */}
                    <RecentBorrowed />
                </div>
            </div>
            {/* Toaster component */}
            <Toaster />
            {/* Modal confirm component */}
            <ModalConfirm />
            {/* Modal slideover component */}
            <ModalSlideOver />
        </>
    )
}

export default MainContainer