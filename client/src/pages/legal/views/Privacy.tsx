import TitleText from "@/components/TitleText";

const Privacy = () => {
    return (
        <div className="flex flex-col gap-4">
            <TitleText className="text-3xl font-light w-[calc(56rem-50px)] pb-2 truncate">
                Privacy Policy
            </TitleText>
            <div>
                There is no privacy policy!, everyone wants your data!
                Don&apos;t worry about your google account, we are only taking
                your name, email and profile picture. And of course, we'll have
                your chats too!!
            </div>
        </div>
    );
};

export default Privacy;
