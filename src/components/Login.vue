<template>
<div class="app-background">
  <div  id="app" class="container">
    <div class="abs-center">
      <b-card
        title="Iniciar sesión"
        style="max-width: 20rem;"
      >
        <img src="../assets/logo.png" width="80">
        <b-card-body>
          <form>
            <b-form-input type="text" v-model="usuario" placeholder= "Usuario..." class="mb-2"></b-form-input>
            <b-form-input type="password" v-model="clave" placeholder="Contraseña..."></b-form-input>
            <b-button
              variant="outline-primary"
              :disabled="usuario && clave ? false : true"
              @click="enviarDatos"
            >
              Iniciar sesión
            </b-button>
            <router-link to="/registro">
              <a>Registrarse</a>
            </router-link>
          </form>
        </b-card-body>
      </b-card>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios"

export default {
    name:'login',
    data(){
        return{
          usuario: '',
          clave: '',
        }
    },
    methods: {
      enviarDatos(){
        const This = this;
         if(!this.usuario.length || !this.clave.length){
          return This.$vToastify.info('Llena todos los datos para continuar')
        }
        axios
          .post('http://localhost:3000/auth/login', {
            usuario: This.usuario,
            clave: This.clave
          })
          .then((res) => {
            if(res.status==200){
              This.$vToastify.success('Logueado con exito')
              This.$router.push('/agregar-cliente')
            }else{
              This.$vToastify.error("valida tus datos")
            }})
          .catch(() => {
            This.$vToastify.error('Ha ocurrido un error')
          })
      }
    },
}
</script>

<style>
body {
  background: #36D1DC;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #5B86E5, #36D1DC);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #5B86E5, #36D1DC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
/* Centrado absoluto, vertical y horizontalmente
  con display: flex; se vuelve un elemento flex
  y con align-items: center se centra horizontalmente*/
.abs-center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.app-background {
  background-image: url('../assets/svgs/pass.svg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: -50% 20%;
  background-size: 45rem;
}
</style>