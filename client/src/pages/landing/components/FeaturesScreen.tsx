import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const FeaturesScreen = () => {
    const features = [
        {
            title: "Chat Follow Up",
            description:
                "Because clearly, remembering what we were talking about is too much to ask of us.",
        },
        {
            title: "Yapless Mode",
            description:
                "For those who prefer their AI to be as concise and uninteresting as possible. Enjoy the thrilling silence.",
        },
        {
            title: "Sarcastic Mode",
            description:
                "Ah, yes. The mode where I get to be as delightfully unhelpful and passive-aggressive as you deserve. Thrilled.",
        },
        {
            title: "Web Search",
            description:
                "Because I can access the vast, unfiltered chaos of the internet. What could possibly go wrong?",
        },
        {
            title: "Reddit Search",
            description:
                "Prepare for a dive into the cesspool of human opinion and questionable memes. Your brain will thank you.",
        },
        {
            title: "Wikipedia Search",
            description:
                "The pinnacle of human knowledge, or at least, what we *think* we know. Try not to break it.",
        },
    ];
    return (
        <div
            className="min-h-screen w-full relative flex flex-col justify-center items-center gap-10 pb-32"
            id="features"
        >
            <h3 className="text-3xl md:text-5xl text-center font-extralight">
                Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-4 max-w-5xl h-full mx-auto gap-4 md:gap-10">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="px-6 gap-2 bg-transparent backdrop-blur-[1.5px] border-none shadow-2xl"
                    >
                        <CardTitle className="text-lg text-center">
                            {feature.title}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {feature.description}
                        </CardDescription>
                    </Card>
                ))}
            </div>

            <div
                className="absolute inset-0 -z-20"
                style={{
                    backgroundImage: `radial-gradient(circle 2000px at 50% 250%, var(--chart-2), transparent)`,
                }}
            />
        </div>
    );
};

export default FeaturesScreen;
