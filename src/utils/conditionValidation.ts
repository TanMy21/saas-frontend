import { Condition } from "./types";

export const validateConditions = (conditions: Condition[]) => {
  console.log("\n🔍 Running validateConditions...");
  console.log("Received conditions:", JSON.stringify(conditions, null, 2));
  let globalIsValid = true;
  const errorMap: Record<number, string[]> = {};
  const isValidArray: boolean[] = [];
  const conditionSet = new Set();
  const selfReferencingSet = new Set();
  const conditionValueMap = new Map<string, string>();
  const lessThanMap = new Map<number, string>();
  const lessThanEqualMap = new Map<number, string>();
  const greaterThanMap = new Map<number, string>();
  const greaterThanEqualMap = new Map<number, string>();
  const equalToMap = new Map<number, string>();

  conditions.forEach((condition, index) => {
    const {
      goto_questionID,
      conditionType,
      conditionValue,
      relatedQuestionID,
    } = condition;
    const conditionErrors: string[] = [];
    let isValid = true;

    // Rule: Prevent empty condition
    if (!goto_questionID || !conditionType || !conditionValue) {
      conditionErrors.push("All fields are required.");
      isValid = false;
    }

    // Rule: Prevent self-referencing condition
    if (goto_questionID === relatedQuestionID) {
      conditionErrors.push("A question cannot conditionally link to itself.");
      selfReferencingSet.add(goto_questionID);
      isValid = false;
    }

    // Rule: Prevent duplicate conditions
    const conditionKey = `${goto_questionID}-${conditionType}-${conditionValue}`;
    if (conditionSet.has(conditionKey)) {
      conditionErrors.push("This condition already exists.");
      isValid = false;
    } else {
      conditionSet.add(conditionKey);
    }

    // Rule: prevent duplicate conditions with different destinations
    const conditionValueKey = `${relatedQuestionID}-${conditionType}-${conditionValue}`;
    if (conditionValueMap.has(conditionValueKey)) {
      if (conditionValueMap.get(conditionValueKey) !== goto_questionID) {
        conditionErrors.push(
          "The same condition value cannot lead to different target questions."
        );
        isValid = false;
      }
    } else {
      conditionValueMap.set(conditionValueKey, goto_questionID);
    }

    // Rule: Prevent overlapping numeric conditions with different destinations
    const numericValue = Number(conditionValue);
    if (!isNaN(numericValue)) {
      // console.log(
      //   `\nProcessing Condition: ${conditionType} ${numericValue} → ${goto_questionID}`
      // );
      // console.log("Less Than Map:", [...lessThanMap.entries()]);
      // console.log("Less Than Equal Map:", [...lessThanEqualMap.entries()]);
      // console.log("Less Than Map:", [...greaterThanMap.entries()]);
      // console.log("Greater Than Map:", [...greaterThanMap.entries()]);
      // console.log("Greater Than Equal Map:", [
      //   ...greaterThanEqualMap.entries(),
      // ]);
      // console.log("Equal Map:", [...equalToMap.entries()]);

      // Rule: Handle "Less Than" condition overlaps with other conditions having different destinations
      if (conditionType === "is-less-than") {
        for (const [existingValue, existingTarget] of lessThanMap) {
          if (
            numericValue !== existingValue &&
            goto_questionID !== existingTarget &&
            (numericValue > existingValue || numericValue < existingValue)
          ) {
            conditionErrors.push(
              `"Less than ${numericValue}" conflicts with "Less than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of lessThanEqualMap) {
          if (
            numericValue !== existingValue &&
            goto_questionID !== existingTarget &&
            (numericValue <= existingValue || numericValue >= existingValue)
          ) {
            conditionErrors.push(
              `"Less than ${numericValue}" conflicts with "Less than or equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }
        for (const [existingValue, existingTarget] of lessThanEqualMap) {
          if (
            numericValue == existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Less than ${numericValue}" conflicts with "Less than or equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of greaterThanMap) {
          if (
            numericValue >= existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Less than ${numericValue}" conflicts with "Greater than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of equalToMap) {
          if (
            numericValue > existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Less than ${numericValue}" conflicts with "Equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        lessThanMap.set(numericValue, goto_questionID);
      }

      // Rule: Handle "Less Than equal to" condition overlaps with other conditions having different destinations
      if (conditionType === "is-less-than-equal-to") {
        for (const [existingValue, existingTarget] of lessThanMap) {
          if (
            (numericValue >= existingValue || numericValue <= existingValue) &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Less than or equal to ${numericValue}" conflicts with "Less than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        // for (const [existingValue, existingTarget] of lessThanMap) {
        //   if (
        //     numericValue === existingValue &&
        //     goto_questionID !== existingTarget
        //   ) {
        //     conditionErrors.push(
        //       `"Less than or equal to ${numericValue}" conflicts with "Less than ${existingValue}" leading to a different target.`
        //     );
        //     isValid = false;
        //   }
        // }
        for (const [existingValue, existingTarget] of lessThanEqualMap) {
          if (
            (numericValue <= existingValue || numericValue >= existingValue) &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Less than or equal to ${numericValue}" conflicts with "Less than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of greaterThanMap) {
          if (
            numericValue >= existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Less than or equal to ${numericValue}" conflicts with "Greater than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of greaterThanEqualMap) {
          if (
            (numericValue >= existingValue || numericValue === existingValue) &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Less than or equal to ${numericValue}" conflicts with "Greater than or equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of equalToMap) {
          if (
            (numericValue >= existingValue || numericValue <= existingValue) &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Less than or equal to ${numericValue}" conflicts with "Equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }
        lessThanEqualMap.set(numericValue, goto_questionID);
      }

      // Rule: Handle "Greater Than" condition overlaps with other conditions having different destinations
      if (conditionType === "is-greater-than") {
        for (const [existingValue, existingTarget] of lessThanMap) {
          if (
            (numericValue >= existingValue || numericValue <= existingValue) &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Greater than ${numericValue}" conflicts with "Less than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }
        for (const [existingValue, existingTarget] of greaterThanMap) {
          if (
            (numericValue >= existingValue || numericValue <= existingValue) &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Greater than ${numericValue}" conflicts with "Greater than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }
        for (const [existingValue, existingTarget] of greaterThanEqualMap) {
          if (
            (numericValue >= existingValue || numericValue <= existingValue) &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Greater than ${numericValue}" conflicts with "Greater than or equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of equalToMap) {
          if (
            numericValue <= existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Greater than ${numericValue}" conflicts with "Equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }
        greaterThanMap.set(numericValue, goto_questionID);
      }

      // Rule: Handle "Greater than or equal to" condition overlaps with other conditions having different destinations
      if (conditionType === "is-greater-than-equal-to") {
        for (const [existingValue, existingTarget] of lessThanMap) {
          if (
            numericValue <= existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Greater than or equal to ${numericValue}" conflicts with "Less than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of lessThanEqualMap) {
          if (
            numericValue === existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Greater than or equal to ${numericValue}" conflicts with "Less than or equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }
        for (const [existingValue, existingTarget] of greaterThanMap) {
          if (
            (numericValue >= existingValue || numericValue <= existingValue) &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Greater than or equal to ${numericValue}" conflicts with "Greater than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }
        for (const [existingValue, existingTarget] of greaterThanEqualMap) {
          if (
            (numericValue >= existingValue || numericValue <= existingValue) &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Greater than or equal to ${numericValue}" conflicts with "Greater than or equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }
        for (const [existingValue, existingTarget] of equalToMap) {
          if (
            (numericValue >= existingValue || numericValue <= existingValue) &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Greater than or equal to ${numericValue}" conflicts with "Equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }
        greaterThanEqualMap.set(numericValue, goto_questionID);
      }

      // Rule: Handle "Equal to" condition overlaps with other conditions having different destinations
      if (conditionType == "is-equal-to") {
        for (const [existingValue, existingTarget] of lessThanMap) {
          if (
            numericValue < existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Equal to ${numericValue}" conflicts with "Less than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of lessThanEqualMap) {
          if (
            numericValue >= existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Equal to ${numericValue}" conflicts with "Less than or equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of greaterThanMap) {
          if (
            numericValue > existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Equal to ${numericValue}" conflicts with "Greater than ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        for (const [existingValue, existingTarget] of greaterThanEqualMap) {
          if (
            numericValue >= existingValue &&
            goto_questionID !== existingTarget
          ) {
            conditionErrors.push(
              `"Equal to ${numericValue}" conflicts with "Greater than or equal to ${existingValue}" leading to a different target.`
            );
            isValid = false;
          }
        }

        equalToMap.set(numericValue, goto_questionID);
      }
    }

    // store errors
    errorMap[index] = conditionErrors;
    isValidArray[index] = isValid;
    if (!isValid) {
      globalIsValid = false;
    }
  });

  // console.log("Final Validation Results:", {
  //   isValidArray,
  //   globalIsValid,
  //   errorMap,
  // });
  return { isValidArray, globalIsValid, errorMap };
};
