sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "com/bootcamp/sapui5/tpfinalfiori/utils/HomeHelper",
  ],
  (Controller, HomeHelper) => {
    "use strict";

    return Controller.extend(
      "com.bootcamp.sapui5.tpfinalfiori.controller.Detail",
      {
        onInit() {
          let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("detail")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
          let sSupplierID = oEvent.getParameter("arguments").SupplierID;
          this.getView().bindElement({
            path: "/Suppliers(" + sSupplierID + ")",
            parameters: {
              expand: "Products,Products/Category",
            },
          });
        },

        onItemPress: async function () {
          this.oDialog ??= await this.loadFragment({
            name: "com.bootcamp.sapui5.tpfinalfiori.view.ProductDialog",
          });

          this.oDialog.open();
        },

        onCloseDialog() {
          this.byId("productDialog").close();
        },
      }
    );
  }
);
