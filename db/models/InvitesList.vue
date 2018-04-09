


<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 class="padding elevation-0">
                <v-card class=" white--text ">
                    <v-card-title>
                       <h4> Invites </h4>
                        <v-spacer></v-spacer>
                        <v-text-field  color="white" append-icon="search" label="Search by E-mail" single-line hide-details v-model="search"></v-text-field>
                    </v-card-title>
                        <v-card-actions>
                        <router-link :to="'invites/create'"> <v-icon color="primary">create</v-icon></router-link>                   
                        <!-- <v-btn flat class="orange--text">Explore</v-btn> -->
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex class="elevation-0 padding " sm12>
                <v-card >
                    <v-data-table v-model="selected" select-all selected-key="name" v-bind:headers="headers" v-bind:items="items" v-bind:search="search" v-bind:pagination.sync="pagination" :total-items="totalItems" :loading="loading" class="elevation-1">
                    <template slot="headerCell" scope="props">
                        
                             <v-tooltip bottom>
                             <span slot="activator">
                                    {{ props.header.text }}
                            </span>
                             <span>
                                     {{ props.header.text }}
                             </span>
                            </v-tooltip>
                     </template>
                      
                        <template slot="items" scope="props" >
                             <tr :active="props.selected" @click="">
                                   <td @click="props.selected = !props.selected">
                                     <v-checkbox primary hide-details :input-value="props.selected"></v-checkbox>
                                 </td>
                                 <td class="text-xs-center">{{ props.item.id }}</td>
                                 <td class="text-xs-center">{{ props.item.email }}</td>
                                 <td class="text-xs-center">{{ props.item.user ?props.item.user.name:'-' }}</td>
                                 <td class="text-xs-center">{{ props.item.token }}</td>
                                 <td class="text-xs-center">{{ props.item.created_at }}</td>
                                <td class="text-xs-center">
                                    <span class="group pa-2">
                                     <!-- <v-icon>home</v-icon> -->
                                     <!-- <v-icon>event</v-icon> -->
                                     <router-link :to="`specialties/${props.item.id}`"> <v-icon>info</v-icon></router-link> 
                                    </span>
                                </td>
                             </tr> 
                        </template>
                        
                    </v-data-table>
    
                </v-card>
                
            </v-flex>
           
        </v-layout>
        
    </div>

</template>



<script >
import { ApiService } from "../../../services";

import _ from "lodash";
export default {
  data() {
    return {
      search: "",
      totalItems: 0,
      items: [],
      selected: [],
      loading: true,
      selectedUser: false,
      pagination: {},
      headers: [
        {
          text: "id",
          align: "center",
          sortable: false,
          value: "id"
        },
        { text: "E-mail", align: "center", value: "email" },
        { text: "User", align: "center", value: "user" },
        { text: "Token", align: "center", value: "token" },
        { text: "Created", align: "center", value: "created_at" }
      ]
    };
  },
  components: {},
  watch: {
    pagination: {
      handler(newValue, oldValue) {
        if (!oldValue.page && newValue.page !== oldValue.page) return;

        this.getDataFromApi().then(res => {
          this.items = res.data;
          this.totalItems = res.pagination.rowCount;
        });
      },
      deep: true
    }
  },
  mounted() {
    this.getDataFromApi().then(res => {
      this.items = res.data;
      this.totalItems = res.pagination.rowCount;
    });
  },
  methods: {
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.items.slice();
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    getDataFromApi() {
      this.loading = true;

      return ApiService.AdminApi.Invites.list(this.pagination)
        .then(res => {
          console.log("res", res);
          this.loading = false;
          this.items = res.data;

          return res;
        })
        .catch(err => {
          this.loading = false;
          this.items = [];
          return [];
        });
    }
  }
};
</script>

<style scoped>
.resize {
  -webkit-transition: width 300ms ease-in-out, height 300ms ease-in-out;
  -moz-transition: width 300ms ease-in-out, height 300ms ease-in-out;
  -o-transition: width 300ms ease-in-out, height 300ms ease-in-out;
  transition: width 300ms ease-in-out, height 300ms ease-in-out;
}
</style>