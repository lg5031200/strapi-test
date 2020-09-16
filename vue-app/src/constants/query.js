import gql from "graphql-tag";

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

export const ME = gql`
  query me {
    me {
      id
      username
      email
    }
  }
`;
