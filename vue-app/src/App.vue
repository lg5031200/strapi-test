<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/order">Orders</router-link> |
      <router-link to="/add">Add</router-link> |
      <b v-if="user">
        <router-link to="/me">{{ user.username }} </router-link>
        <img src="https://i0.zi.org.tw/kocpc/2017/09/1505037254-e970979c4fe7bbbfcde39041cbf86f2f.png" height="50px" width="50px" border="1">
      </b>
      <router-link v-else to="/login">Login</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import { ME } from "@/constants/query";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      user: null
    };
  },
  apollo: {
    me: {
      query: ME,
      skip() {
        return !localStorage.getItem("apollo-token") && !this.$route.query.id;
      },
      result({ data }) {
        this.user = data.me;
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
