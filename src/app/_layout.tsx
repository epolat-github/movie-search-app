import { Stack } from "expo-router";

const RootLayout = () => {
    return (
        <Stack
            screenOptions={{
                contentStyle: {
                    backgroundColor: "#fff",
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Movie List",
                }}
            />
            <Stack.Screen
                name="movie/[imdbId]"
                options={{
                    presentation: "modal",
                    headerShown: false,
                }}
            />
        </Stack>
    );
};

export default RootLayout;
