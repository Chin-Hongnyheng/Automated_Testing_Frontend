import { gql } from '@apollo/client/core'

export const REGISTER = gql`
  mutation Register($input: CreateRegisterInput!) {
    register(input: $input) {
      message
      accessToken
      refreshToken
    }
  }
`

export const LOGIN = gql`
  mutation Login($input: CreateLoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`

export const GET_ME = gql`
  query {
    getMe {
      id
      userName
      email
    }
  }
`
