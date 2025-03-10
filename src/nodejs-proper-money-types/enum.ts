export enum ESubscriptionEntitlement {
  starter = "Starter",
  plus = "Plus",
  premium = "Premium",
}

export enum EUserGetInfoResponseErrorMessage {
  logged_in_another_devices = "0",
  google_token_revoked = "1",
  apple_token_revoked = "2",
  facebook_token_revoked = "3",
}

export enum ETransactionCategoryType {
  income = 0,
  expense = 1,
}

export enum EMissionType {
  dailyCheckIn = 0,
  weeklyCheckIn = 1,
  daiyAddIncomeOrExpense = 2,
  weeklyAddIncomeOrExpense = 3,
}

export enum EPointType {
  add = 0,
  deduct = 1,
}

export enum EPointFromType {
  mission = 0,
  weekly_winner_touch_and_go = 1,
  reward_item_store = 2,
}

export enum ERewardType {
  weekly_winner_touch_and_go = 0,
  weekly_winner_touch_and_go_reward_point = 1,
  reward_store_item_touch_and_go_ewallet = 2,
  reward_store_item_touch_and_go_ewallet_check_in_weekly_ticket = 3,
}

export enum EVerificationOneTimePasswordType {
  Login = "Login",
  ShareUser = "ShareUser",
}

export enum EGetTransactionsByType {
  category = "category",
  label = "label",
}

export enum EGetTransactionsBySort {
  recent = "recent",
  highest = "highest",
}

export enum EUserSignInMethod {
  anonymous = "anonymous",
  phoneNumber = "phoneNumber",
  email = "email",
  google = "google",
  apple = "apple",
  facebook = "facebook",
}

export enum EFirebaseCloudMessagingTopic {
  global = "PROPERMONEY-GLOBAL",
}
