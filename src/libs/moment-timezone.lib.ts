import MomentTimezone from "moment-timezone";

const getStartAndEndDatetimeByAsiaKualaLumpur = (
  type: "today" | "week" | "month"
) => {
  const now = MomentTimezone().tz("Asia/Kuala_Lumpur");
  let result = {
    startAt: new Date(),
    endAt: new Date(),
  };
  if (type == "today") {
    result = {
      startAt: new Date(now.clone().startOf("day").toJSON()),
      endAt: new Date(now.clone().endOf("day").toJSON()),
    };
  }
  if (type == "week") {
    result = {
      startAt: new Date(now.clone().startOf("week").toJSON()),
      endAt: new Date(now.clone().endOf("week").toJSON()),
    };
  } else if (type == "month") {
    result = {
      startAt: new Date(now.clone().startOf("month").toJSON()),
      endAt: new Date(now.clone().endOf("month").toJSON()),
    };
  }
  return result;
};

const getStartAndEndOfDay = (date: Date) => {
  let result = {
    startAt: new Date(),
    endAt: new Date(),
  };
  result = {
    startAt: new Date(MomentTimezone(date).clone().startOf("day").toJSON()),
    endAt: new Date(MomentTimezone(date).clone().endOf("day").toJSON()),
  };
  return result;
};

const addSevenDays = (date: Date) => {
  return new Date(MomentTimezone(date).clone().add(7, "days").toJSON());
};

const addOneMonth = (date: Date) => {
  return new Date(MomentTimezone(date).clone().add(31, "days").toJSON());
};

const addOneYear = (date: Date) => {
  return new Date(MomentTimezone(date).clone().add(365, "days").toJSON());
};

export const MomentTimezoneLib = {
  getStartAndEndDatetimeByAsiaKualaLumpur,
  getStartAndEndOfDay,
  addSevenDays,
  addOneMonth,
  addOneYear
};
