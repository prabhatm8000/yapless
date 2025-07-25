import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Search } from "lucide-react";
import { useState } from "react";
import { MdAutoMode } from "react-icons/md";

type ModeType = "YAPLESS" | "BRIEF" | "DETAILED" | "AUTO";

const ModeDropDown = ({
    modeSelector,
    setModeSelector,
}: {
    modeSelector: ModeType;
    setModeSelector: (m: "YAPLESS" | "BRIEF" | "DETAILED" | "AUTO") => void;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size={"sm"} className="capitalize">
                    <MdAutoMode />
                    {modeSelector}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-28">
                <DropdownMenuLabel>Mode</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={modeSelector === "AUTO"}
                    onCheckedChange={() => setModeSelector("AUTO")}
                >
                    Auto
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={modeSelector === "BRIEF"}
                    onCheckedChange={() => setModeSelector("BRIEF")}
                >
                    Brief
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={modeSelector === "DETAILED"}
                    onCheckedChange={() => setModeSelector("DETAILED")}
                >
                    Detailed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={modeSelector === "YAPLESS"}
                    onCheckedChange={() => setModeSelector("YAPLESS")}
                >
                    Yapless
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const SearchButton = ({
    value,
    toggle,
}: {
    value: boolean;
    toggle: () => void;
}) => {
    return (
        <Button
            size={"sm"}
            onClick={toggle}
            variant={"outline"}
            className={`${value ? "opacity-100" : "opacity-50"}`}
        >
            <Search />
            Search
        </Button>
    );
};

const Prompt = () => {
    const [modeSelector, setModeSelector] = useState<ModeType>("AUTO");
    const [search, setSearch] = useState<boolean>(true);
    return (
        <Card className="py-4">
            <CardContent className="px-4">
                <Textarea
                    className="rounded-none dark:bg-transparent border-none ring-0 shadow-none p-0 w-full resize-none overflow-auto focus-visible:border-none focus-visible:ring-0 hover:outline-none active:outline-none"
                    placeholder="Ask anything, I'll not yap!"
                    style={{
                        height: "auto",
                        maxHeight: "240px", // 5 lines * line-height (24px)
                    }}
                />
                <div className="mt-2 flex items-center justify-between w-full gap-2">
                    <div className="mt-2 flex items-center w-full gap-2">
                        <ModeDropDown
                            setModeSelector={setModeSelector}
                            modeSelector={modeSelector}
                        />
                        <SearchButton
                            value={search}
                            toggle={() => setSearch((p) => !p)}
                        />
                    </div>
                    <Button size={"icon"} className="rounded-full">
                        <ArrowUp />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Prompt;
