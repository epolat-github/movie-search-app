import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PortalProvider } from "@gorhom/portal";
import { SnackbarContextProvider } from "../context/SnackbarContext";

const RootLayout = () => {
    return (
        <GestureHandlerRootView
            style={{
                flex: 1,
            }}
        >
            <PortalProvider>
                <BottomSheetModalProvider>
                    <SnackbarContextProvider>
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
                                    headerRight: () => (
                                        <Link href="/favorites" asChild>
                                            <Pressable hitSlop={10}>
                                                <MaterialIcons
                                                    name="favorite"
                                                    size={24}
                                                    color="red"
                                                />
                                            </Pressable>
                                        </Link>
                                    ),
                                }}
                            />
                            <Stack.Screen
                                name="favorites"
                                options={{
                                    title: "Favorite List",
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
                    </SnackbarContextProvider>
                </BottomSheetModalProvider>
            </PortalProvider>
        </GestureHandlerRootView>
    );
};

export default RootLayout;
