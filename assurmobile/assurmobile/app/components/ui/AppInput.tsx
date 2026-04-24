import { useState } from "react";
import { TextInput, Text } from "react-native-paper";
import { colors } from "../../theme";

export function AppInput({ placeholder, onChangeText, secureTextEntry, icon, rightIcon, showPasswordToggle, value }: {
    placeholder: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    icon?: string;
    rightIcon?: React.ReactNode;
    showPasswordToggle?: boolean;
    value?: string;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const renderRightIcon = () => {
        if (showPasswordToggle && secureTextEntry) {
            return (
                <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    color={colors.textSecondary}
                    onPress={() => setShowPassword(!showPassword)}
                />
            );
        }
        return rightIcon;
    };

    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={secureTextEntry && !showPassword}
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
            right={renderRightIcon()}
        />
    );
}
