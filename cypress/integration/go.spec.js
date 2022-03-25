import GenericFunctions from "../support/GenericFunctions";

describe("Transfer api tests", function () {
  const generic = new GenericFunctions();
  beforeEach(function () {
    cy.fixture("testData").as("testData");
  });

  it("All delivery options are available", function () {
    var urls = [
      generic.getEP("150.00", "LT", "PL", "EUR", "EUR"),
      generic.getEP("150.00", "TR", "PL", "TRY", "EUR"),
    ];
    urls.forEach((url) => {
      cy.request({
        url: url,
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.status).to.eq(200);
        if (
          this.testData.nowStandard.includes(
            resp.body.enquiry.transferRoute.fromCountry
          )
        ) {
          expect(resp.body).to.have.property("deliveryOptions");
          expect(resp.body.deliveryOptions).to.have.property("now");
          if (
            resp.body.deliveryOptions.now.availability.reason ==
            "NOT_WORKING_HOURS"
          ) {
            expect(
              resp.body.deliveryOptions.now.availability.isAvailable
            ).to.eq(false);
          } else {
            expect(
              resp.body.deliveryOptions.now.availability.isAvailable
            ).to.eq(true);
          }
          expect(resp.body.deliveryOptions).to.have.property("standard");
          expect(
            resp.body.deliveryOptions.standard.availability.isAvailable
          ).to.eq(true);
        } else {
          expect(resp.body).to.have.property("deliveryOptions");
          expect(resp.body.deliveryOptions).to.have.property("today");
          if (
            resp.body.deliveryOptions.today.availability.reason ==
            "NOT_WORKING_HOURS"
          ) {
            expect(
              resp.body.deliveryOptions.today.availability.isAvailable
            ).to.eq(false);
          } else {
            expect(
              resp.body.deliveryOptions.today.availability.isAvailable
            ).to.eq(true);
          }
          expect(resp.body.deliveryOptions).to.have.property("standard");
          expect(
            resp.body.deliveryOptions.standard.availability.isAvailable
          ).to.eq(true);
        }
      });
    });
  });
  it("Verify receiving amount is calculated correctly", function () {
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
  /*it("Verify exceeding max amount", function () {
    I need more data or explanation for this. 
  })*/
  it("Verify min max ", function () {
    var lessThanMin = [0.55, 0.99];
    var greaterThanMax = [1000002, 1000002];
    var minMax = [1, 1000000];
    for (let i = 0; i < 2; i++) {
      cy.request({
        url: generic.getEP(lessThanMin[i], "LT", "PL", "EUR", "EUR"),
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.status).to.not.eq(200);
        expect(resp.body.message).to.contain("tooSmallAmount");
      });
      cy.request({
        url: generic.getEP(greaterThanMax[i], "LT", "PL", "EUR", "EUR"),
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.status).to.not.eq(200);
        expect(resp.body.message).to.contain("invalidAmount");
      });
      cy.request({
        url: generic.getEP(minMax[i], "LT", "PL", "EUR", "EUR"),
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.have.property("deliveryOptions");
      });
    }
  });
  it("Verify response time ", function () {
    var eps = [
      generic.getEP("150.00", "LT", "PL", "EUR", "EUR"),
      generic.getEP("150.00", "TR", "PL", "TRY", "EUR"),
      generic.getEP("15000", "TR", "PL", "TRY", "EUR"),
      generic.getEP("0.55", "TR", "PL", "TRY", "EUR"),
      generic.getEP("40000.00", "TR", "PL", "TRY", "EUR"),
    ];
    eps.forEach((element) => {
      cy.request({
        url: element,
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.duration).to.not.be.greaterThan(200);
      });
    });
  });
});
