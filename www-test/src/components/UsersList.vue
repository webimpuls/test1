<template>
  <h3>Поиск пользователя</h3>
  <div class="form">
    <input type="text" v-model="query" /> <input type="button" value="Искать" v-on:click="send_request" />
  </div>
  <h3>Пользователи</h3>
  <div class="list">
    <table id="users_list">
      <tr v-for="item in items" :key="item.message">
        <td>{{item.id}}</td>
        <td>{{item.email}}</td>
        <td>{{item.first_name}}</td>
        <td>{{item.last_name}}</td>
        <td>{{item.avatar}}</td>
      </tr>
    </table>
  </div>
  <div class="hello"><h1>{{ msg }}</h1></div>
</template>

<script>
export default {
  name: 'UsersList',
  props: {
    msg: String
  },
  data() {
    let data = {
      query:'',
      items: []
    }
    return data;
  },
  methods:{
    send_request() {
      let usersUrl = '/data/users';
      if (this.query != '') {
        usersUrl += '?q=' + this.query;
      }
      fetch(usersUrl)
        .then((resp)=>{ return resp.json(); })
        .then((data)=>{
          this.items = data;
        })
    }
  },
  mounted() {
    this.send_request();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
table {
  border-collapse: collapse;
}
td {
  padding: 2px 15px;
  border: 1px solid #888;
}
</style>
