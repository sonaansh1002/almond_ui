import * as Transactions from "./transaction"
import * as Vendors from "./vendor"
import * as AuthAPI from "./auth"
import * as Providers from './Providers/providers'
import * as ProvidersExport from './Providers/export'
import * as UpiTransaction from './clientService/upiService'
import * as Epod from "./epod"
import * as Products from "./Products/products"
import * as ExportProduct from './Products/export'
import * as ClientTransaction from "./clientService/allTransaction"
import * as ClientService from "./clientService/allService"

import * as AllCatalogue from './allCatalogue/catalogue'
import * as Add from './allCatalogue/add'
import * as View from './allCatalogue/view'
import * as AddCatProduct from './allCatalogue/addProduct'
import * as CreateUser from './portalUser/create'
import * as AssignProject from './portalUser/assign'
import * as PortalUser from './portalUser/users'

export default {
  Transactions,
  Vendors,
  AuthAPI,
  Providers,
  Epod,
  Products,
  ProvidersExport,
  ExportProduct,
  UpiTransaction,
  ClientTransaction,
  ClientService,
  AllCatalogue,
  // useAddProduct,
  Add,
  View,
  AddCatProduct,
  CreateUser,
  AssignProject,
  PortalUser
};

