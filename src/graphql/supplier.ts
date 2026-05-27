import { gql } from '@apollo/client/core'

export const GET_SUPPLIERS = gql`
  query {
    getSuppliers {
      id
      name
      email
      phone
    }
  }
`

export const GET_SUPPLIER = gql`
  query GetSupplier($id: ID!) {
    getSupplier(id: $id) {
      id
      name
      email
      phone
    }
  }
`

export const CREATE_SUPPLIER = gql`
  mutation CreateSupplier($input: CreateSupplierInput!) {
    createSupplier(input: $input) {
      id
      name
    }
  }
`

export const UPDATE_SUPPLIER = gql`
  mutation UpdateSupplier($input: UpdateSupplierInput!) {
    updateSupplier(input: $input) {
      id
      name
    }
  }
`

export const DELETE_SUPPLIER = gql`
  mutation DeleteSupplier($id: ID!) {
    deleteSupplier(id: $id)
  }
`
