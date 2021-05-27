<template>
    <div>
        <b-navbar toggleable="lg" type="success" variant="light">

        <b-navbar-brand href="#"><img src="../assets/logo.png" width="25" class="mb-1"> Dahnyluc</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"> <b-icon icon="three-dots" variant="info"></b-icon></b-navbar-toggle>

         <b-collapse id="nav-collapse" is-nav>

             <b-navbar-nav v-if="$route.name !== 'Principal'">
                <b-nav-item to="/agregar-servidor" exact><b-icon icon="person-badge"></b-icon> Agregar Servidor</b-nav-item>
                <b-nav-item to="/agregar-cliente" exact><b-icon icon="person-fill"></b-icon> Agregar Cliente</b-nav-item>
                <b-nav-item to="/categoria"><b-icon icon="list-task"></b-icon> Categoría</b-nav-item>
                <b-nav-item to="/servicios"><b-icon icon="wrench"></b-icon> Servicios</b-nav-item>
                <b-nav-item to="/transacciones"><b-icon icon="receipt"></b-icon> Transacciones</b-nav-item>
                <b-nav-item @click="logout">Salir</b-nav-item>
                <!-- <b-nav-item to="/historial-de-venta">Historial de Venta</b-nav-item>
                <b-nav-item>Ingresos</b-nav-item> -->
        </b-navbar-nav>
        <b-navbar-nav v-if="$route.name === 'Principal'" class="ml-auto fixed">
          <b-nav-item to="/registro">Registrarme</b-nav-item>
          <b-nav-item to="/login">Iniciar</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Navbar",
  methods: {
    logout() {
      const This = this;
      axios
        .get("http://localhost:3000/auth/logout")
        .then((res) => {
          if (res.status == 200) {
            console.log(res.data);
            This.$vToastify.success("Sesión finalizada con exito");
            this.$router.push("/");
          } else {
            This.$vToastify.error(
              "Ha ocurrido un error finalizando la sesión. Intenta de nuevo"
            );
          }
        })
        .catch((error) => {
          This.$vToastify.error(error);
        });
    },
  },
};
</script>