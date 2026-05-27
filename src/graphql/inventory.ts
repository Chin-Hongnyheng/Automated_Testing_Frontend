import { gql } from '@apollo/client/core'

export const GET_INVENTORIES = gql`
  query {
    getInventories {
      id
      name
      description
      quantity
      price
      supplierId
      stockLevel
      minStockLevel
    }
  }
`

export const GET_INVENTORY = gql`
  query GetInventory($id: ID!) {
    getInventory(id: $id) {
      id
      name
      description
      quantity
      price
      supplierId
      stockLevel
      minStockLevel
    }
  }
`

export const GET_LOW_STOCK = gql`
  query {
    getLowStockItems {
      id
      name
      stockLevel
      minStockLevel
    }
  }
`

export const CREATE_INVENTORY = gql`
  mutation CreateInventory($input: CreateInventoryInput!) {
    createInventory(input: $input) {
      id
      name
    }
  }
`

export const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($input: UpdateInventoryInput!) {
    updateInventory(input: $input) {
      id
      name
    }
  }
`

export const DELETE_INVENTORY = gql`
  mutation DeleteInventory($id: ID!) {
    deleteInventory(id: $id)
  }
`

export const ADJUST_STOCK = gql`
  mutation AdjustStock($input: AdjustStockInput!) {
    adjustStock(input: $input) {
      id
      name
      stockLevel
    }
  }
`
