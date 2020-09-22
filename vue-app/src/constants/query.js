import gql from "graphql-tag";

export const ME = gql`
  query me {
    me {
      id
      username
      email
      role {
        type
      }
    }
  }
`;

export const USER = gql`
  query user($id: ID!) {
    user(id:$id) {
      id
      role {
        type
      }
    }
  }
`;

export const RESTAURANTS = gql`
  query {
    restaurants {
      id
      name
      description
      categories {
        name
      }
    }
  }
`;

export const PRODUCTS = gql`
  query products($where: JSON) {
    products(where: $where) {
      id
      name
      price
      category {
        name
      }
    }
  }
`;

export const DRINKS = gql`
  query {
    drinks {
      id
      ice
      suger
      quantity
      order {
        id
      }
      product {
        name
      }
    }
  }
`;

export const ORDERS = gql`
  query {
    orders {
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
`;

export const ORDER = gql`
  query order($id: ID!) {
    order(id: $id) {
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
`;
