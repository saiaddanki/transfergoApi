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
});
