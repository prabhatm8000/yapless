import { BsGithub, BsTwitterX } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="w-full h-10 fixed bottom-0">
            <div className="max-w-7xl h-full mx-auto flex items-center">
                <p className="text-xs w-full flex flex-col md:flex-row items-center justify-center gap-2 text-muted-foreground">
                    <span className="flex gap-2">
                        <a href="https://x.com/prabhatm8000" target="_blank">
                            <BsTwitterX />
                        </a>
                        <a
                            href="https://github.com/prabhatm8000"
                            target="_blank"
                        >
                            <BsGithub />
                        </a>
                    </span>
                    <span>
                        &copy; 2025 Yapless. All rights reserved! There are no
                        rights as of now!
                    </span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
