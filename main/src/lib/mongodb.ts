import mongoose from "mongoose";
import envvars from "../constants/envvars";

export const connectToDB = () => {
    try {
        const mongo = mongoose.connect(envvars.MONGODB_URI as string, {
            dbName: "yapless",
        });
        return mongo;
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
};

export const disconnectFromDB = () => mongoose.disconnect();

/**
 *
 * @param id
 * @returns true or throws APIResponseError
 */
export const validateObjectId = (
    ...ids: (string | number | mongoose.Types.ObjectId)[]
): boolean => {
    if (!ids.length) throw new Error("At least one id is required");
    for (const id of ids) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new Error("Invalid ObjectId");
    }
    return true;
};

export const matchObjectId = (
    id1: string | number | mongoose.Types.ObjectId,
    id2: string | number | mongoose.Types.ObjectId
): boolean => {
    validateObjectId(id1, id2);
    if (id1.toString() !== id2.toString()) {
        return false;
    }
    return true;
};
