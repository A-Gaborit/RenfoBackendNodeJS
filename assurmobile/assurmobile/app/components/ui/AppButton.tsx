import { Button } from "react-native-paper";
import { colors } from "../../theme";

export function AppButton({ onPress, children, mode = "contained", style }: {
    onPress: () => void;
    children: string;
    mode?: "contained" | "outlined" | "text";
    style?: any;
}) {
    return (
        <Button
            mode={mode}
            onPress={onPress}
            buttonColor={mode === "contained" ? colors.primary : undefined}
            textColor={mode === "contained" ? colors.white : colors.primary}
            style={[{ borderRadius: 10 }, style]}
        >
            {children}
        </Button>
    );
}
