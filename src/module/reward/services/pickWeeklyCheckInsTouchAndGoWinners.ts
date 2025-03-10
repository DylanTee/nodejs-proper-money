// export default async function pickWeeklyTouchAndGoWinner() {
//   try {
//     const participantList = PointAggregate.getParticipants([]) as any
//     if (participantList.length > 0) {
//       const winnerArr = [] as any;
//       //pick winner had check in has 7 count
//       const tenRinggitPoolArray = participantList.filter((x:any) => x.count >= 7);
//       const randomTenRinggitPoolIndex = Math.floor(
//         Math.random() * tenRinggitPoolArray.length
//       );
//       const winnerOfTenRinggit = tenRinggitPoolArray[randomTenRinggitPoolIndex];
//       winnerOfTenRinggit
//         ? winnerArr.push({ ...winnerOfTenRinggit, value: 10 })
//         : undefined;
//       //pick winner had check in has 5 count
//       const fiveRinggitPoolArray = participantList.filter(
//         (x:any) => x.count >= 5 && !winnerArr.map((x:any) => x._id).includes(x._id)
//       );
//       const randomFiveRinggitPoolIndex = Math.floor(
//         Math.random() * fiveRinggitPoolArray.length
//       );
//       const winnerOfFiveRinggit =
//         fiveRinggitPoolArray[randomFiveRinggitPoolIndex];
//       winnerOfFiveRinggit
//         ? winnerArr.push({ ...winnerOfFiveRinggit, value: 5 })
//         : undefined;
//       //pick winner had check in has 3 count
//       const threeRinggitPoolArray = participantList.filter(
//         (x) => x.count >= 3 && !winnerArr.map((x) => x._id).includes(x._id)
//       );
//       const randomThreeRinggitPoolIndex = Math.floor(
//         Math.random() * threeRinggitPoolArray.length
//       );
//       const winnerOfThreeRinggit =
//         threeRinggitPoolArray[randomThreeRinggitPoolIndex];
//       winnerOfThreeRinggit
//         ? winnerArr.push({ ...winnerOfThreeRinggit, value: 3 })
//         : undefined;
//       //pick winner had check in has 1 count
//       const oneRinggitPoolArray = participantList.filter(
//         (x:any) => x.count >= 1 && !winnerArr.map((x) => x._id).includes(x._id)
//       );
//       const randomOneRinggitPoolIndex = Math.floor(
//         Math.random() * oneRinggitPoolArray.length
//       );
//       const winnerOfOneRinggit = oneRinggitPoolArray[randomOneRinggitPoolIndex];
//       winnerOfOneRinggit
//         ? winnerArr.push({ ...winnerOfOneRinggit, value: 1 })
//         : undefined;
//       if (winnerArr.length > 0) {
//         const winnerTouchAndGoDocs = winnerArr.map((data) => ({
//           userId: data._id,
//           type: ERewardType.weekly_winner_touch_and_go,
//           value: data.value,
//         }));
//         await insertMany(winnerTouchAndGoDocs);
//         ProperServices.sendNotificationToAdmin({
//           title: "Proper Money Touch and Weekly Winner",
//           body: JSON.stringify(winnerArr, null, 2),
//         });
//       }
//       //reward user who had participated and did not win
//       const rewardPointPoolArray: TParticipant[] = getUniqueArrayOfObject([
//         ...oneRinggitPoolArray,
//         ...threeRinggitPoolArray,
//         ...fiveRinggitPoolArray,
//         ...tenRinggitPoolArray,
//       ]).filter((x) => !winnerArr.map((x) => x._id).includes(x._id));
//       if (rewardPointPoolArray.length > 0) {
//         const rewardPartipantsDocs = rewardPointPoolArray.map((data) => ({
//           userId: data._id,
//           type: ERewardType.weekly_winner_touch_and_go_reward_point,
//           value: data.count * 10, //each of checkin count get 10 point
//         }));
//         await insertMany(rewardPartipantsDocs);
//       }
//     }
//   } catch (e) {
//     throw e;
//   }
// }
