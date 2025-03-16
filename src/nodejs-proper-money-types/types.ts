import {
  EMissionType,
  EPointFromType,
  EPointType,
  ERewardType,
  ESubscriptionEntitlement,
  ETransactionCategoryType,
  EVerificationOneTimePasswordType,
} from "./enum";

export type TJwtTokenObject = {
  userId: string;
};

export type TJwtToken = {
  accessToken: string;
  refreshToken: string;
};

export type TMission = {
  userId?: String;
  type: EMissionType;
  description: string;
  missionCount: {
    completedCount: number;
    totalCount: number;
  };
  point: Number;
  isClaimed: boolean;
  isClaimable: boolean;
  isActive: boolean;
};

export type TGetMissionQuery = {
  entitlement: ESubscriptionEntitlement;
};

export type TGetMissionResponse = {
  dailyMissions: {
    missions: TMission[];
    refreshAt: string;
  };
  weeklyMissions: {
    missions: TMission[];
    period: {
      startAt: Date;
      endAt: Date;
    };
    refreshAt: string;
  };
};

export type TPoint = {
  _id: string;
  userId: string;
  type: EPointType;
  value: number;
  pointFrom: {
    type: EPointFromType;
    id: string | null;
    documentType: ERewardType | EMissionType;
  };
  expiryAt: Date;
  createdAt: Date;
};

export type TGetPointTotalResponse = {
  totalPoints: number;
};

export type TPostPointClaimBody = {
  missionType: EMissionType;
  entitlement: ESubscriptionEntitlement;
};

export type TReward = {
  _id: string;
  userId: string;
  type: ERewardType;
  value: number;
  expiryAt: Date;
  isRedeemed: boolean;
  phoneNumber: null | string;
  emailAddress: null | string;
};

export type TRewardStoreItem = {
  name: string;
  description: string;
  type: ERewardType;
  price: number;
  refreshAt: string;
  inventoryLeft: number;
};

export type TGetRewardQuery = {
  isValid: string;
  page: string;
  limit: string;
};

export type TGetRewardResponse = {
  rewards: TReward[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
};

export type TPostRewardSubmitBody = {
  rewardId: string;
  phoneNumber: string;
};

export type TPostRewardClaimBody = {
  rewardId: string;
};

export type TGetRewardStoreResponse = {
  rewardStoreItems: TRewardStoreItem[];
};

export type TPostRewardRedeemBody = {
  rewardType: ERewardType;
};

export type TPostRewardRedeemResponse = {
  value: string;
};

export type TPostTopUpCreateBillBody = {
  userId: string;
  productId: string;
  description: string;
  name: string;
  email: string;
  amount: string;
};

export type TPostTopUpCreateReferenceBody = {
  userId: string;
  productId: string;
  referenceNo: string;
};

export type TPostTopUpEditReferenceBody = {
  iPayEightyEightResponse: Object;
  iPayEightyEightBackend: Object;
};

export type TTransaction = {
  _id: string;
  userId: string;
  transactionCategoryId: string;
  transactionLabelIds: string[];
  user: TUser;
  transactionCategory: TTransactionCategory;
  transactionLabels: TTransactionLabel[] | null;
  currency: string;
  amount: number;
  imagePath: string | null;
  note: string | null;
  isDeleted: boolean;
  transactedAt: Date;
  updatedAt: Date;
  createdAt: Date;
};

export type TTimelineTransaction = {
  date: string;
  records: TTransaction[];
  totalIncome: number;
  totalExpense: number;
  totalCurrenciesIncomeAndExpenses: {
    currency: string;
    totalIncomes: number;
    totalExpenses: number;
  }[];
};

export type TGetTransactionsDashboardQuery = {
  startTransactedAt: string;
  endTransactedAt: string;
};

export type TGetTransactionDashboardResponse = {
  user: {
    transactions: TTransaction[];
    transactionCategories: TTransactionCategory[];
    transactionLabels: TTransactionLabel[];
    timelineTransactions: TTimelineTransaction[];
  };
  sharedUser: {
    transactions: TTransaction[];
    transactionCategories: TTransactionCategory[];
    transactionLabels: TTransactionLabel[];
    timelineTransactions: TTimelineTransaction[];
  };
  total: {
    transactions: TTransaction[];
    transactionCategories: TTransactionCategory[];
    transactionLabels: TTransactionLabel[];
    timelineTransactions: TTimelineTransaction[];
  };
};

export type TPostTransactionCreateBody = {
  transactionCategoryId: string;
  transactionLabelIds: string[];
  currency: string;
  amount: number;
  imagePath: string | null;
  note: string | null;
  transactedAt: Date;
};

export type TPostTransactionUpdateBody = {
  _id: string;
  transactionCategoryId: string;
  transactionLabelIds: string[];
  currency: string;
  amount: number;
  imagePath: string | null;
  note: string | null;
  transactedAt: Date;
};

export type TPostTransactionDeleteBody = {
  _id: string;
};

export type TGetTransactionQuery = {
  page: number;
  limit: number;
  transactionCategoryId: string | undefined;
  transactionLabelId: string | undefined;
};

export type TGetTransactionResponse = {
  data: TTransaction[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    total_items: number;
  };
};

export type TGetTransactionDetailQuery = {
  id: string;
};

export type TGetTransactionDetailResponse = TTransaction;

export type TTransactionCategory = {
  _id: string;
  name: string;
  type: ETransactionCategoryType;
  backgroundColor: string;
  imagePath: string;
  userId: string;
  isDeleted: boolean;
  updatedAt: Date;
  createdAt: Date;
};

export type TGetTransactionCategoryQuery = {
  q: string;
  page: number;
  limit: number;
  type: ETransactionCategoryType;
};

export type TGetTransactionCategoryResponse = {
  data: TTransactionCategory[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    total_items: number;
  };
};

export type TPostTransactionCategoryCreateBody = {
  name: string;
  type: ETransactionCategoryType;
  backgroundColor: string;
  imagePath: string;
};

export type TPostTransactionCategoryCreateResponse = {
  id: string;
};

export type TPostTransactionCategoryUpdateBody = {
  _id: string;
  name: string;
  type: ETransactionCategoryType;
  backgroundColor: string;
  imagePath: string;
};

export type TPostTransactionCategoryDeleteBody = {
  _id: string;
};

export type TGetTransactionCategoryAssetsResponse = {
  icons: string[];
  backgroundColors: string[];
};

export type TTransactionLabel = {
  _id: string;
  name: string;
  userId: string;
  isDeleted: boolean;
  updatedAt: Date;
  createdAt: Date;
};

export type TGetTransactionLabelQuery = {
  q: string;
  page: number;
  limit: number;
};

export type TGetTransactionLabelResponse = {
  data: TTransactionLabel[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    total_items: number;
  };
};

export type TGetTransactionLabelDetailsQuery = {
  ids: string[];
};

export type TGetTransactionLabelDetailsResponse = TTransactionLabel[];

export type TPostTransactionLabelCreateBody = {
  name: string;
};

export type TPostTransactionLabelCreateResponse = {
  id: string;
};

export type TPostTransactionLabelUpdateBody = {
  _id: string;
  name: string;
};

export type TPostTransactionLabelDeleteBody = {
  _id: string;
};

export type TUser = {
  _id: string;
  phoneNumber: string;
  profileImage: string;
  displayName: string;
  language: string;
  currency: string;
  sharedUserId: string | null;
  sharedUserInfo: TSharedUserInfo;
  lastActiveAt: Date;
  premiumMemberTrialEndAt: Date | null;
  topUpMemberRole: ESubscriptionEntitlement | null;
  topUpMemberEndAt: Date | null;
  createdAt: Date;
  notificationToken: string | null;
};

export type TMemberFeature = {
  name: ESubscriptionEntitlement;
  maximumCategories: number;
  maximumLabels: number;
  claimPointMultiplier: number;
  isAblePhotoAI: boolean;
};

export const memberFeatureFree: TMemberFeature = {
  name: ESubscriptionEntitlement.starter,
  maximumCategories: 5,
  maximumLabels: 10,
  claimPointMultiplier: 1,
  isAblePhotoAI: false,
};

export const memberFeaturePlus: TMemberFeature = {
  name: ESubscriptionEntitlement.plus,
  maximumCategories: 50,
  maximumLabels: 100,
  claimPointMultiplier: 2,
  isAblePhotoAI: false,
};

export const memberFeaturePremium: TMemberFeature = {
  name: ESubscriptionEntitlement.premium,
  maximumCategories: 100,
  maximumLabels: 200,
  claimPointMultiplier: 4,
  isAblePhotoAI: true,
};

export type TSharedUserInfo = {
  _id: string;
  id: string;
  profileImage: string;
  emailAddress: string | null;
  phoneNumber: string | null;
  displayName: string;
  notificationToken: string | null;
} | null;

export type TGetUserDetailResponse = TUser;

export type TPostUserRemoveSharedUserBody = {
  sharedUserId: string;
};

export type TPostUserRequestOTPBody = {
  phoneNumber: string;
};

export type TPostUserRequestOTPResponse = {
  verificationOneTimePasswordType: EVerificationOneTimePasswordType;
};

export type TPostUserUpdateBody = Partial<TUser>;

export type TVerification = {
  _id: string;
  userId: string;
  type: EVerificationOneTimePasswordType;
  oneTimePassword: string;
  phoneNumber: string | null;
  expiryAt: Date;
  isVerify: boolean;
  verifiedAt: Date | null;
  createdAt: Date;
};

export type TPostVerificationVerifyBody = {
  phoneNumber: string;
  oneTimePassword: string;
  oneTimePasswordType: EVerificationOneTimePasswordType;
};

export type TPostVerificationVerifyResponse = TJwtToken;

export type TGetVerificationPostGenerateShareIdResponse = {
  oneTimePassword: string;
  expiryAt: Date;
};

export type TPostVerifyShareIdBody = {
  oneTimePassword: string;
};

export type TPostVerifyShareIdReponse = {
  sharedUserId: string;
};
