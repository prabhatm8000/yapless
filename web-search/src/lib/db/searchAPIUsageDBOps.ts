import prismaClient from "./prismaClient";

export const updateUsageCount = (
    id: string,
    api: "serpApiCalls" | "tavilyApiCalls",
    incrementBy: number
) => {
    return prismaClient.searchAPIUsage.update({
        where: {
            id,
        },
        data: {
            [api]: {
                increment: incrementBy,
            },
        },
    });
};

export const createUsageCount = (month: number, year: number) => {
    return prismaClient.searchAPIUsage.create({
        data: {
            month,
            year,
            serpApiCalls: 0,
            tavilyApiCalls: 0,
        },
        select: {
            id: true,
            serpApiCalls: true,
            tavilyApiCalls: true,
        },
    });
};

/**
 * gets usage for current month, if not exists, creates
 * @returns
 */
export const getUsageCount = async () => {
    const d = new Date();
    const cM = d.getMonth();
    const cY = d.getFullYear();
    try {
        const res = await prismaClient.searchAPIUsage.findFirstOrThrow({
            where: {
                month: cM,
                year: cY,
            },
            select: {
                id: true,
                serpApiCalls: true,
                tavilyApiCalls: true,
            },
        });
        return res;
    } catch (error) {
        console.log("shit");
        return await createUsageCount(cM, cY);
    }
};
