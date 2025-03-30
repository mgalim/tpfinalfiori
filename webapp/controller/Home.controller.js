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
          this.oTable = this.getView().byId("idSuppliersTable");
          this.oRouter = this.getOwnerComponent().getRouter();
          this.loadSuppliers();
        },

        loadSuppliers: async function (oFilter = []) {
          let oData = await HomeHelper.getDataSuppliers(oFilter);
          await HomeHelper.setSupplierModel(this, oData[0].results);
        },

        handleTxtFilter: function () {
          let aFilters = [];
          let oBinding = this.oTable.getBinding("rows");
          let oModel = this.getOwnerComponent().getModel("LocalDataModel");
          let sQuery = oModel.getProperty("/valueSearch");

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
          let iIndex = this.oTable.getSelectedIndex();
          if (iIndex === -1) return;
          let aData = this.oTable.getContextByIndex(iIndex).getObject();

          this.oRouter.navTo("detail", {
            SupplierID: aData.SupplierID,
          });
        },

        sortColumn: function (sSortProperty) {
          let oColumn = this.oTable
            .getColumns()
            .find((col) => col.getSortProperty() === sSortProperty);
          let bDescending = !!oColumn.getSorted() && !oColumn.getSortOrder();

          this.oTable.sort(
            oColumn,
            bDescending ? SortOrder.Descending : SortOrder.Ascending,
            true
          );
        },

        clearAllSortings: function () {
          this.oTable.getBinding().sort(null);
          this.oTable.getColumns().forEach((oColumn) => {
            oColumn.setSorted(false);
          });
        },
      }
    );
  }
);
