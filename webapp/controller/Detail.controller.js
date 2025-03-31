sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/m/MessageToast"],
  (Controller, MessageBox, MessageToast) => {
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
          this.getView().unbindElement();

          this.getView().bindElement({
            path: "/Suppliers(" + sSupplierID + ")",
            parameters: {
              expand: "Products,Products/Category",
            },
          });
        },

        onItemPress: async function (oEvent) {
          let oSelectedItem = oEvent.getSource();
          let oProduct = oSelectedItem.getBindingContext().getObject();

          let oModel = this.getOwnerComponent().getModel("LocalDataModel");
          oModel.setProperty("/ProductData", { ...oProduct });
          oModel.setProperty("/isEdit", false);

          this.oDialog ??= await this.loadFragment({
            name: "com.bootcamp.sapui5.tpfinalfiori.view.ProductDialog",
          });

          this.oDialog.open();
        },

        onAddProduct: async function () {
          let oModel = this.getOwnerComponent().getModel("LocalDataModel");
          oModel.setProperty("/ProductData", { CategoryID: 1 });
          oModel.setProperty("/isEdit", true);

          this.oDialog ??= await this.loadFragment({
            name: "com.bootcamp.sapui5.tpfinalfiori.view.ProductDialog",
          });

          this.oDialog.setModel(oModel, "LocalDataModel");
          this._resetValidation();
          this.oDialog.open();
        },

        onChangeValidate: function (oEvent) {
          let oInput = oEvent.getSource();
          let sValueState = "None";
          let bValidationError = false;

          if (oInput instanceof sap.m.Input) {
            if (!oInput.getValue()) {
              sValueState = "Error";
              bValidationError = true;
            }
          }

          if (oInput instanceof sap.m.ComboBox) {
            if (!oInput.getSelectedKey()) {
              sValueState = "Error";
              bValidationError = true;
            }
          }

          oInput.setValueState(sValueState);
          return !bValidationError;
        },

        onPressSaveData: function () {
          let oModel = this.getOwnerComponent().getModel("LocalDataModel");
          let oProductData = { ...oModel.getProperty("/ProductData") };

          if (!this._validateForm()) {
            MessageToast.show("Please, complete all required fields.");
            return;
          }

          MessageBox.success(
            "Product: " +
              oProductData.ProductName +
              " was created but cannot show it in table"
          );

          this.onCloseDialog();
        },

        _validateForm: function () {
          let oForm = this.byId("productForm");
          let aFormContent = oForm.getContent();
          let bValid = true;

          aFormContent.forEach((oControl) => {
            if (
              oControl instanceof sap.m.Input ||
              oControl instanceof sap.m.ComboBox
            ) {
              let isValid = this.onChangeValidate({
                getSource: () => oControl,
              });
              if (!isValid) {
                bValid = false;
              }
            }
          });

          return bValid;
        },

        _resetValidation: function () {
          let oForm = this.byId("productForm");
          if (!oForm) return;

          let aFormContent = oForm.getContent();
          aFormContent.forEach((oControl) => {
            if (
              oControl instanceof sap.m.Input ||
              oControl instanceof sap.m.ComboBox
            ) {
              oControl.setValueState("None");
            }
          });
        },

        onCloseDialog() {
          this.byId("productDialog").close();
        },
      }
    );
  }
);
