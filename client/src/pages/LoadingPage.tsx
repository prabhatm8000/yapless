import LoadingCircle from "@/components/ui/LoadingCircle";

const LoadingPage = () => {
    return (
        <>
            {/* <div className="fixed z-[999] h-dvh w-screen top-0 right-0 flex justify-center items-center">
                <IoIosLink size={50} className="animate-pulse ease-in-out" />
            </div> */}
            {/* css in the html */}
            <div id="lazy-loading">
                <div>
                    <LoadingCircle />
                </div>
            </div>
        </>
    );
};

export default LoadingPage;
