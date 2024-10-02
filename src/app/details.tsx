import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button, Platform, Text, View } from "react-native";

const Details = () => {
    const router = useRouter();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <StatusBar
                style={Platform.OS === "ios" ? "light" : "auto"}
                animated
            />
            <Text>Details screen</Text>
            <Button title="Dismiss" onPress={() => router.dismiss()} />
        </View>
    );
};

export default Details;
