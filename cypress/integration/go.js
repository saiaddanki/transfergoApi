import GenericFunctions from "../support/GenericFunctions";

describe("Transfer api tests", function () {
  const generic = new GenericFunctions();
  beforeEach(function () {
    cy.fixture("testData").as("testData");
  });
  it("All delivery options are available", function () {
    cy.request({
      url: generic.getEP("150.00", "LT", "PL", "EUR", "EUR"),
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("deliveryOptions");
      expect(resp.body.deliveryOptions).to.have.property("now");
      expect(resp.body.deliveryOptions).to.have.property("standard");
    });
    cy.request({
      url: generic.getEP("150.00", "TR", "PL", "TRY", "EUR"),
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("deliveryOptions");
      expect(resp.body.deliveryOptions).to.have.property("today");
      expect(resp.body.deliveryOptions).to.have.property("standard");
    });
  });
  it.only("Verify receiving amount is calculated correctly", function () {
    var eps = [
      generic.getEP("150.00", "LT", "PL", "EUR", "EUR"),
      generic.getEP("150.00", "TR", "PL", "TRY", "EUR"),
    ];
    for (let i = 0; i < eps.length; i++) {
      cy.request({
        url: eps[i],
        failOnStatusCode: false,
      }).then((resp) => {
        var finalFee =
          resp.body.deliveryOptions.standard.paymentOptions.bank.quote.fees
            .finalFee;
        var sendingAmount =
          resp.body.deliveryOptions.standard.paymentOptions.bank.quote
            .sendingAmount;
        var receivingAmount =
          resp.body.deliveryOptions.standard.paymentOptions.bank.quote
            .receivingAmount;
        var rate =
          resp.body.deliveryOptions.standard.paymentOptions.bank.quote.rate;
        expect(receivingAmount) ===
          ((sendingAmount - finalFee) * rate).toFixed(2);
        cy.log(
          receivingAmount +
            "verifies with" +
            ((sendingAmount - finalFee) * rate).toFixed(2)
        );
      });
    }
  });
});
