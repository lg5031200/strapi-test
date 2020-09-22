import gql from "graphql-tag";

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

export const CREATE_ORDER = gql`
  mutation createOrder($input: createOrderInput) {
    createOrder(input: $input) {
      order {
        id
        status
        restaurant {
          name
        }
        drinks {
          product {
            name
            price
          }
          suger
          ice
          quantity
        }
      }
    }
  }
`;

export const CREATE_DRINK = gql`
  mutation createDrink($input: createDrinkInput) {
    createDrink(input: $input) {
      drink {
        id
      }
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation updateOrder($input: updateOrderInput) {
    updateOrder(input: $input) {
      order {
        id
        status
      }
    }
  }
`;
