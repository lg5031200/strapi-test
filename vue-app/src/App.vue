<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item
          link
          v-for="nav in navItems"
          :key="nav.text"
          @click.stop="changePage(nav.path)"
        >
          <v-list-item-action>
            <v-icon>{{ nav.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ nav.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        {{ order ? order.restaurant.name : "Drinks Shop" }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            @click="orderDialog = true"
            v-show="showAddBtn"
            :disabled="!!order && order.drinks && order.drinks.length === 0"
          >
            <v-icon dark>mdi-plus-circle</v-icon>
          </v-btn>
        </template>
        <span>新增訂單</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
            color="indigo"
            v-bind="attrs"
            v-on="on"
            v-show="userData || me"
          >
            <v-icon dark>
              mdi-account-circle
            </v-icon>
          </v-avatar>
        </template>
        <span>{{
          me ? me.username : userData ? userData.loginData.user.username : null
        }}</span>
      </v-tooltip>

      <v-btn
        @click="signupDialog = true"
        v-show="!userData && !me"
        color="indigo lighten-1"
      >
        SignUp
      </v-btn>

      <v-btn
        @click="loginDialog = true"
        v-show="!userData && !me"
        class="ml-3"
        color="indigo darken-3"
      >
        Login
      </v-btn>
      <v-btn icon v-show="userData || me" @click="logoutDialog = true">
        <v-icon>mdi-exit-run</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view :createdOrder="order"></router-view>
    </v-main>

    <v-footer color="indigo" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <signup-dialog
      :dialog="signupDialog"
      @close-dialog="closeSignUpDialog"
    ></signup-dialog>
    <login-dialog
      :dialog="loginDialog"
      @close-dialog="closeLoginDialog"
    ></login-dialog>
    <logout-dialog
      :dialog="logoutDialog"
      @close-dialog="closeLogoutDialog"
    ></logout-dialog>
    <order-dialog
      :dialog="orderDialog"
      @close-dialog="closeOrderDialog"
      :me="me"
      :userData="userData"
    >
    </order-dialog>
  </v-app>
</template>

<script>
import { ME, ORDERS } from "@/constants/query";
import LoginDailog from "@/components/LoginDialog";
import LogoutDialog from "@/components/LogoutDialog";
import SignUpDialog from "@/components/SignUpDialog";
import OrderDialog from "@/components/OrderDialog";

export default {
  name: "App",
  components: {
    "login-dialog": LoginDailog,
    "logout-dialog": LogoutDialog,
    "signup-dialog": SignUpDialog,
    "order-dialog": OrderDialog
  },
  data() {
    return {
      drawer: true,
      loginDialog: false,
      logoutDialog: false,
      orderDialog: false,
      signupDialog: false,
      userData: null,
      order: null,
      navItems: [
        {
          icon: "mdi-home",
          text: "Home",
          path: "/home"
        },
        {
          icon: "mdi-view-list",
          text: "訂單",
          path: "/order"
        },
        {
          icon: "mdi-playlist-plus",
          text: "新增訂單",
          path: "/add"
        }
      ]
    };
  },
  watch: {
    $route: {
      async handler(data) {
        if (data.name === "Add") {
          await this.$apollo.queries.orders.refetch();
        }
      }
    }
  },
  computed: {
    showAddBtn() {
      return this.me || this.userData;
    }
  },
  methods: {
    async closeLoginDialog(userData) {
      this.loginDialog = false;
      this.userData = userData;
      this.changePage("/home");
    },
    async closeLogoutDialog(isLogout) {
      this.logoutDialog = false;
      if (isLogout) {
        this.userData = null;
        this.me = null;
        this.changePage("/home");
      }
    },
    closeOrderDialog(data) {
      this.orderDialog = false;
      this.order = data;
      this.changePage("/add");
    },
    closeSignUpDialog(data) {
      this.signupDialog = false;
      if (data) this.loginDialog = true;
    },
    changePage(path) {
      this.$router.push({ path }, () => {});
    }
  },
  apollo: {
    me: {
      query: ME,
      fetchPolicy: "network-only",
      skip() {
        return !localStorage.getItem("apollo-token");
      }
    },
    orders: {
      query: ORDERS,
      variables() {
        return {
          where: {
            user: {
              id: this.me ? this.me.id : null
            },
            status: "init"
          },
          sort: "created_at:desc"
        };
      },
      result({ data }) {
        this.order = data.orders[0];
      }
    }
  }
};
</script>
<style lang="scss"></style>
