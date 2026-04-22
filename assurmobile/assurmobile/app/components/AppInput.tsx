import { TextInput } from "react-native-paper";
import { colors } from "../theme";

interface AppInputProps {
    placeholder: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    icon?: string;
    rightIcon?: React.ReactNode;
}

export function AppInput({ placeholder, onChangeText, secureTextEntry, icon, rightIcon }: AppInputProps) {
    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            mode="outlined"
            outlineColor={colors.primaryLight}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            style={{ backgroundColor: colors.white }}
            left={icon ? (
                <TextInput.Icon
                    icon={icon}
                    color={colors.textSecondary}
                    tabIndex={-1}
                />
            ) : undefined}
            right={rightIcon}
        />
    );
}
