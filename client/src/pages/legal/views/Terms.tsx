import TitleText from "@/components/TitleText";

const Terms = () => {
    return (
        <div className="flex flex-col gap-4">
            <TitleText className="text-3xl font-light w-[calc(56rem-50px)] pb-2 truncate">
                Terms of Service
            </TitleText>
            <div>
                <span>
                    We don&apos;t have any terms as of now, and the code is open
                    source.
                </span>
                <br />
                <span>
                    Here at:
                    <a
                        target="_blank"
                        href="https://www.github.com/prabhatm8000/yapless/"
                        className="ml-2 underline text-blue-500"
                    >
                        https://www.github.com/prabhatm8000/yapless/
                    </a>
                </span>
            </div>
        </div>
    );
};

export default Terms;
