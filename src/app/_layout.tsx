import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
    return (
        <GestureHandlerRootView
            style={{
                flex: 1,
            }}
        >
            <BottomSheetModalProvider>
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
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default RootLayout;
