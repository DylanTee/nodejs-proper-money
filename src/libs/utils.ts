import {
  EMissionType,
  ESubscriptionEntitlement,
} from "../nodejs-proper-money-types/enum";
import {
  memberFeatureFree,
  memberFeaturePlus,
  memberFeaturePremium,
} from "../nodejs-proper-money-types/types";

const generateRandomSixNumberString = () => {
  let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let digits = "";
  for (let i = 0; i < 6; i++) {
    digits = digits + [Math.floor(Math.random() * arr.length)];
  }
  return digits;
};

const generateRandomString = (length: number) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  return result;
};

function getUniqueArrayOfObject(array: any) {
  return [...new Set(array.map((o: any) => JSON.stringify(o)))].map((s: any) =>
    JSON.parse(s)
  );
}

function removeStartAndEndSpaceInString(text: string) {
  return text.trimStart().trimEnd();
}

const getRemainingRefreshTimeText = ({
  lastDate,
  type,
}: {
  lastDate: Date;
  type: "month" | "week" | "daily";
}) => {
  const timeDifference = lastDate.getTime() - new Date().getTime();
  const remainingDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  if (type == "daily") {
    return `${remainingHours} hour(s)`;
  } else if (type == "week" || type == "month") {
    return `${remainingDays} day(s) ${remainingHours} hour(s)`;
  } else {
    return "";
  }
};

function removeLeadingZero(str: string) {
  if (str.charAt(0) === "0") {
    return removeStartAndEndSpaceInString(str.slice(1));
  }
  return removeStartAndEndSpaceInString(str);
}

function removeDotBeforeAt(email: string) {
  const atIndex = email.indexOf("@");
  if (atIndex !== -1) {
    const username = email.substring(0, atIndex);
    const domain = email.substring(atIndex);
    const modifiedUsername = username.replace(/\./g, ""); 
    return modifiedUsername + domain;
  }
  return email; 
}

function reformatEmail(str: string | undefined) {
  let lowercaseEmail = str ? str.toLowerCase() : undefined;
  if (lowercaseEmail && lowercaseEmail.includes("@gmail")) {
    lowercaseEmail = removeDotBeforeAt(lowercaseEmail);
  }
  return lowercaseEmail;
}

const isValidDate = (dateString: string) => {
  const parsedDate = new Date(dateString);
  return !isNaN(parsedDate.getTime());
};

const getPoint = ({
  missionType,
  entitlement,
}: {
  missionType: EMissionType;
  entitlement: ESubscriptionEntitlement;
}) => {
  const getExtraPoint = () => {
    if (entitlement == ESubscriptionEntitlement.premium) {
      return memberFeaturePremium.claimPointMultiplier;
    } else if (entitlement == ESubscriptionEntitlement.plus) {
      return memberFeaturePlus.claimPointMultiplier;
    } else {
      return memberFeatureFree.claimPointMultiplier;
    }
  };
  if (missionType == EMissionType.dailyCheckIn) {
    return 10 * getExtraPoint();
  } else if (missionType == EMissionType.daiyAddIncomeOrExpense) {
    return 30 * getExtraPoint();
  } else if (missionType == EMissionType.weeklyCheckIn) {
    return 30 * getExtraPoint();
  } else if (missionType == EMissionType.weeklyAddIncomeOrExpense) {
    return 90 * getExtraPoint();
  } else {
    return 0 * getExtraPoint();
  }
};

const escapeRegex = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export {
  generateRandomSixNumberString,
  generateRandomString,
  getUniqueArrayOfObject,
  removeStartAndEndSpaceInString,
  getRemainingRefreshTimeText,
  removeLeadingZero,
  reformatEmail,
  isValidDate,
  getPoint,
  escapeRegex,
};
