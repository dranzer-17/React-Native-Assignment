import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { requireOptionalNativeModule } from "expo-modules-core";
import type { AVPlaybackStatus } from "expo-av";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MOCK_INTERVIEW_AUDIO = require("../../../../assets/song.mp3") as number;

/**
 * True when the APK includes expo-av. Expo registers native modules via expo-modules-core,
 * not `NativeModules.ExponentAV`, so we must use the same resolver as `expo-av` itself.
 */
export function isExpoAvNativeLinked(): boolean {
  return requireOptionalNativeModule("ExponentAV") != null;
}

export function useMockInterviewAudio() {
  const [playing, setPlaying] = useState(false);
  const soundRef = useRef<import("expo-av").Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      void soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, []);

  const toggle = useCallback(async () => {
    if (!isExpoAvNativeLinked()) {
      Alert.alert(
        "Rebuild the app",
        "expo-av is installed in JavaScript but your installed app was built without the native audio module.\n\nStop Metro, then run:\n\nyarn android --device\n\n(or yarn ios) and reinstall the app. After that, play will work.",
      );
      return;
    }

    try {
      const { Audio } = await import("expo-av");

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(MOCK_INTERVIEW_AUDIO, {
          shouldPlay: true,
        });
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            setPlaying(false);
          }
        });
        setPlaying(true);
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) return;

      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
        setPlaying(false);
        return;
      }

      const duration = status.durationMillis ?? 0;
      const atEnd = duration > 0 && status.positionMillis >= duration - 200;
      if (atEnd) {
        await soundRef.current.setPositionAsync(0);
      }
      await soundRef.current.playAsync();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, []);

  return { playing, toggle };
}
