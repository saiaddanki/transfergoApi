import testData from "../fixtures/testData.json";

class GenericFunctions {
  getEP(
    amount,
    fromCountryCode,
    toCountryCode,
    fromCurrencyCode,
    toCurrencyCode
  ) {
    return (
      Cypress.config().baseUrl +
      testData.uriConst +
      testData.paramAmount +
      amount +
      testData.paramFromCoCode +
      fromCountryCode +
      testData.paramToCoCode +
      toCountryCode +
      testData.paramFromCuCode +
      fromCurrencyCode +
      testData.paramToCuCode +
      toCurrencyCode
    );
  }
}
export default GenericFunctions;
