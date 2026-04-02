export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Main: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  SessionResult: { questionId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  SettingsTab: undefined;
  StoreTab: undefined;
};

export type RootStackScreenName = keyof RootStackParamList;
export type HomeStackScreenName = keyof HomeStackParamList;
