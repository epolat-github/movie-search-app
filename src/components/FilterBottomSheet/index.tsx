import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { spacing } from "../../theme/spacing";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import Button from "../Button";
import { MovieType } from "../../types/movieService.type";

export interface FilterBody {
    startYear: string;
    endYear: string;
    type?: MovieType;
}

interface FilterBottomSheetType {
    onApprove: () => void;
    filters: FilterBody;
    setFilters: React.Dispatch<React.SetStateAction<FilterBody>>;
}

const FilterBottomSheet = forwardRef<BottomSheetModal, FilterBottomSheetType>(
    (props, ref) => {
        const { onApprove, filters, setFilters } = props;

        const renderBackdrop = useCallback(
            (props: BottomSheetBackdropProps) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                />
            ),
            []
        );

        const onInputChange = (
            key: Exclude<keyof FilterBody, "type">,
            value: string
        ) => {
            setFilters((prev) => {
                return {
                    ...prev,
                    [key]: value,
                };
            });
        };

        const onFilterTypeSelect = (selectedType: MovieType) => {
            setFilters((prev) => {
                if (prev.type === selectedType) {
                    prev.type = undefined;
                } else {
                    prev.type = selectedType;
                }

                return {
                    ...prev,
                };
            });
        };

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={["50%", "80%"]}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                keyboardBehavior="extend"
                keyboardBlurBehavior="restore"
                index={0}
            >
                <BottomSheetView
                    style={{
                        flex: 1,
                        paddingHorizontal: spacing.medium,
                        gap: spacing.medium,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 18,
                        }}
                    >
                        Filter Your Search
                    </Text>

                    <View>
                        <Text style={{ color: "gray" }}>
                            Movies only use a start year
                        </Text>
                        <BottomSheetTextInput
                            style={styles.filterTextInput}
                            placeholder="Start year to search"
                            value={filters.startYear}
                            onChangeText={(value) =>
                                onInputChange("startYear", value)
                            }
                            keyboardType="numeric"
                            maxLength={4}
                        />
                        <Text style={{ color: "gray" }}>
                            Series use an end year too
                        </Text>
                        <BottomSheetTextInput
                            style={styles.filterTextInput}
                            placeholder="End year to search"
                            value={filters.endYear}
                            onChangeText={(value) =>
                                onInputChange("endYear", value)
                            }
                            keyboardType="numeric"
                            maxLength={4}
                        />
                    </View>

                    <View
                        style={{
                            gap: spacing.small,
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>
                            Filter by type
                        </Text>
                        <Text style={{ color: "gray" }}>
                            Select a type again to disable the filter
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                gap: spacing.tiny,
                            }}
                        >
                            {(["series", "movie", "episode"] as const).map(
                                (typeName) => (
                                    <Pressable
                                        key={typeName}
                                        style={{
                                            flex: 1,
                                            backgroundColor:
                                                typeName === filters.type
                                                    ? colors.secondary
                                                    : colors.gray,
                                            borderRadius: spacing.tiny,
                                            padding: spacing.small,
                                        }}
                                        onPress={() =>
                                            onFilterTypeSelect(typeName)
                                        }
                                    >
                                        <Text
                                            style={{
                                                textTransform: "capitalize",
                                                textAlign: "center",
                                                color:
                                                    typeName === filters.type
                                                        ? "#fff"
                                                        : "#000",
                                            }}
                                        >
                                            {typeName}
                                        </Text>
                                    </Pressable>
                                )
                            )}
                        </View>
                    </View>

                    <Button
                        text="Filter Search"
                        containerStyle={{
                            marginTop: spacing.small,
                        }}
                        onPress={onApprove}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    filterTextInput: {
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 20,
        padding: 8,
        backgroundColor: colors.gray,
    },
});

export default FilterBottomSheet;
