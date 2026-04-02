import { createNavigationContainerRef, CommonActions } from "@react-navigation/native";
import type { RootStackParamList } from "@/navigation/types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateToMain(): void {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main" }],
      }),
    );
  }
}

export function navigateToWelcome(): void {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      }),
    );
  }
}
