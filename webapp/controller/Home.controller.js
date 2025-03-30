sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/bootcamp/sapui5/tpfinalfiori/utils/HomeHelper",
  ],
  (Controller, Filter, FilterOperator, HomeHelper) => {
    "use strict";

    return Controller.extend(
      "com.bootcamp.sapui5.tpfinalfiori.controller.Home",
      {
        onInit() {
          this.oRouter = this.getOwnerComponent().getRouter();
          this.loadSuppliers();
        },
        loadSuppliers: async function (oFilter = []) {
          let oData = await HomeHelper.getDataSuppliers(oFilter);
          await HomeHelper.setSupplierModel(this, oData[0].results);
        },
        handleTxtFilter: function () {
          let aFilters = [];
          let oTable = this.getView().byId("idSuppliersTable");
          let oBinding = oTable.getBinding("rows");
          var oModel = this.getOwnerComponent().getModel("LocalDataModel");
          var sQuery = oModel.getProperty("/valueSearch");

          if (sQuery) {
            let oFilterId = new Filter("SupplierID", FilterOperator.EQ, sQuery);
            let oFilterName = new Filter(
              "CompanyName",
              FilterOperator.Contains,
              sQuery
            );

            aFilters.push(
              new Filter({
                filters: [oFilterId, oFilterName],
                and: false,
              })
            );
          }

          oBinding.filter(aFilters);
        },

        onRowSelect: function (oEvent) {
          let oTable = this.getView().byId("idSuppliersTable");
          let iIndex = oTable.getSelectedIndex();
          if (iIndex === -1) return;

          let aData = oTable.getContextByIndex(iIndex).getObject();

          this.oRouter.navTo("detail", {
            supplierId: aData.SupplierID,
          });
        },
      }
    );
  }
);
