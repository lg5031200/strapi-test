import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        username
      }
    }
  }
`;

// export const LOGOUT = gql`
//   mutation logout {
//     logout
//   }
// `;