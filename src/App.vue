<template>
  <div class="app">
    <Main />
    <!-- <Mobile /> -->
  </div>
</template>

<script>
import Main from './components/Main.vue'


export default {
  name: 'app',
  components: {
    Main,
  }
}
</script>

<style>
  
  body{
    margin: 0 !important; 
  } 

  @media (max-device-width: 650px){
    body{
      /*width: 100%;*/
     /* display: -webkit-flex; 
      display: inline-flex; 
      flex-direction: column; */
      /*background: black;*/
    }
  }

  
  .app {
    padding: 0px;
    font-family: Arial;
    text-align: center;
    color: #2c3e50;
  }

</style>
