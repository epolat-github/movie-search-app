import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key: string, value: string | Object) => {
    try {
        let dataToSave = "";

        if (typeof value === "string") {
            dataToSave = value;
        }

        if (typeof value === "object") {
            dataToSave = JSON.stringify(value);
        }

        if (dataToSave !== "") {
            await AsyncStorage.setItem(key, dataToSave);
        }
    } catch (e) {
        throw e;
    }
};

const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);

        if (value === null) return undefined;

        return value;
    } catch (e) {
        throw e;
    }
};

export default { storeData, getData };
