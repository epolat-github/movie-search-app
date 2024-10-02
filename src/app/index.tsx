import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button, Text, View } from "react-native";

const Index = () => {
    const router = useRouter();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <StatusBar animated />
            <Text>Movie List Screen</Text>
            <Button
                title="Navigate to Details"
                onPress={() => router.push("/details")}
            />
        </View>
    );
};

export default Index;
