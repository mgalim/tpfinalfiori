sap.ui.define(
  [
    "com/bootcamp/sapui5/tpfinalfiori/utils/HomeService",
    "sap/ui/model/json/JSONModel",
  ],
  function (HomeService, JSONModel) {
    "use strict";

    return {
      init: function (oNorthwindModel) {
        this._oNorthwindModel = oNorthwindModel;
      },
      setInitModelLocalData: function (oComponent) {
        oComponent.setModel(
          new JSONModel({
            valueSearch: "",
          }),
          "LocalDataModel"
        );
      },

      getDataSuppliers: async function (oFilters) {
        return HomeService.readSuppliers(this._oNorthwindModel, oFilters);
      },

      setSupplierModel: async function (oController, oData) {
        let oListModel = oController.getOwnerComponent().getModel("Suppliers");
        if (!oListModel) {
          const oModel = new JSONModel([]);
          oModel.setSizeLimit(100000);
          oController.getOwnerComponent().setModel(oModel, "Suppliers");
          oListModel = oController.getOwnerComponent().getModel("Suppliers");
        }
        oListModel.setData(oData);
      },
    };
  }
);
