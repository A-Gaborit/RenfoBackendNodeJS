import { Button } from "react-native-paper";
import { colors } from "../theme";

interface AppButtonProps {
    onPress: () => void;
    children: string;
    mode?: "contained" | "outlined" | "text";
    style?: any;
}

export function AppButton({ onPress, children, mode = "contained", style }: AppButtonProps) {
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
