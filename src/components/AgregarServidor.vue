<template>
  <div class="app-background">
    <div  id="app" class="container">
      <div class="h2 pt-5 mb-0">
        <h2><b-icon icon="person-badge"></b-icon> Servidores</h2>
      </div>

    <!-- Ingrese datos de nuevo servidor -->
        <b-card title="Ingrese los datos del servidor">
            <b-form-group  label-cols-lg="1" label="Nombre">
              <b-form-input :state="validar.descripcion" v-model.trim="servidor.descripcion" placeholder="Ingrese el nombre"></b-form-input>
            </b-form-group>
            <b-form-group label-cols-lg="1" label="Teléfono">
              <b-form-input :state="validar.telefono" v-model.trim="servidor.telefono" placeholder="Ingrese el número de teléfono"></b-form-input>
            </b-form-group>
            <b-form-group label-cols-lg="1" label="Usuario">
              <b-form-input :state="validar.usuario" v-model.trim="servidor.usuario" placeholder="Ingrese el usuario"></b-form-input>
            </b-form-group>
            <b-form-group label-cols-lg="1" label="Clave">
              <b-form-input :state="validar.clave" v-model.number="servidor.clave" placeholder="Ingrese la clave"></b-form-input>
            </b-form-group>
            <b-button @click="validarservidor(servidor)" variant="primary">Agregar</b-button>
        </b-card>
     <!-- Lista de Servidores -->
        <b-card title="Servidores" class="mt-3">
          <b-list-group v-if="servidores && servidores.length">
            <b-list-group-item v-for="item of servidores" :key="'Servidor'+item.id_servidor">
              <b>Nombre:</b> {{item.descripcion}} - <b>Teléfono:</b> {{item.telefono}} - <b>usuario:</b> {{item.usuario}}
              - <b>clave:</b> *******
              <b-button variant="primary" @click="abrirModal(item)">Editar</b-button>
              <b-button variant="danger" @click="eliminarservidor(item.id_servidor)">x</b-button>
            </b-list-group-item>
          </b-list-group>
          <div v-else>
            <p>No hay Servidores registrados</p>
          </div>
        </b-card>
          <b-modal
            v-model="openModal"
            @ok="cancelarEventoModal"
            title="Ingresa los nuevos datos del servidor"
          >
           <b-form-group label="Nombre">
              <b-form-input v-model.trim="nuevoServidor.descripcion" placeholder="Ingrese el nombre"></b-form-input>
            </b-form-group>
            <b-form-group label="Teléfono">
              <b-form-input v-model.trim="nuevoServidor.telefono" placeholder="Ingrese el número de teléfono"></b-form-input>
            </b-form-group>
            <b-form-group label="Usuario">
              <b-form-input v-model.trim="nuevoServidor.usuario" placeholder="Ingrese el usuario"></b-form-input>
            </b-form-group>
            <b-form-group label="Clave">
              <b-form-input v-model.number="nuevoServidor.clave" placeholder="Ingrese la clave"></b-form-input>
            </b-form-group>
          </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'agregar-servidor',
    data(){
        return{
            servidores: [],
            servidor: {
              descripcion: '',
              telefono: '',
              usuario: '',
              clave: '',
            },
            nuevoServidor: {
              descripcion: '',
              telefono: '',
              usuario: '',
              clave: '',
            },
            validar:{},
            openModal: false,
        }
    },
    methods: {
        abrirModal(servidor) {
          this.nuevoServidor = JSON.parse(JSON.stringify(servidor));
          this.openModal= true;
        },
        cancelarEventoModal(evento){
          evento.preventDefault();
          this.validarservidor(this.nuevoServidor, true)
        },
        validarservidor(servidor, editar){
          this.validar = {
            descripcion: servidor.descripcion ? true : false,
            telefono: servidor.telefono ? true : false,
            usuario: servidor.usuario ? true : false,
            clave: servidor.clave ? true : false,
          }
          if(Object.values(this.validar).includes(false))return;
          if(servidor.descripcion.length > 49) return this.$vToastify.info('Ingresa un nombre más corto');
          if(servidor.telefono.length > 11) return this.$vToastify.info('El teléfono debe contar con 11 caracteres maximo');
          if(servidor.usuario.length > 49) return this.$vToastify.info('Ingresa un usuario más corto');
          if(servidor.clave.length > 254) return this.$vToastify.info('La clave debe contar con 9 caracteres maximo');
          if(editar) return this.actualizarservidor()
          return this.aggservidor();
        },
        aggservidor() {
        const This = this;
          axios
            .post('http://localhost:3000/api/servers/add', this.servidor)
            .then((res) => {
                if(res.status==200){
                This.$vToastify.success('Servidor agregada satisfactoriamente')
                This.buscarServidores();
                This.servidor = {
                  descripcion: '',
                  telefono: '',
                  usuario: '',
                  clave: '',
                };
                This.validar = {};
                }else{
                This.$vToastify.error("Ha ocurrido un error")
                }})
            .catch((error) => {
                This.$vToastify.error(error)
            })
      },
      buscarServidores() {
        const This= this;
        axios
          .get('http://localhost:3000/api/servers')
          .then((res) => {
              if(res.status==200){
                console.log(res.data)
              This.servidores = res.data;
              This.$vToastify.success('Servidores obtenidos satisfactoriamente')
              }else{
              This.$vToastify.error("Ha ocurrido un error obteniendo los Servidores")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      eliminarservidor(id) {
        if(!id)return
        const This= this;
        axios
          .delete(`http://localhost:3000/api/servers/${id}`)
          .then((res) => {
              if(res.status==200){
              This.$vToastify.success('Servidores eliminado satisfactoriamente')
              This.buscarServidores()
              }else{
              This.$vToastify.error("Ha ocurrido un error eliminado servidor")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      actualizarservidor() {
        const This= this;
        if(!this.nuevoServidor.id_servidor) return This.$vToastify.error("Ha ocurrido un error inesperado intenta de nuevo")
        axios
          .put(`http://localhost:3000/api/servers/${this.nuevoServidor.id_servidor}`, this.nuevoServidor)
          .then((res) => {
              if(res.status==200){
                This.$vToastify.success('Servidores actualizado satisfactoriamente')
                This.buscarServidores()
                This.nuevoServidor = {
                  descripcion: '',
                  telefono: '',
                  usuario: '',
                  clave: '',
                };
                this.openModal= false;
              }else{
                This.$vToastify.error("Ha ocurrido un error actualizado servidor");
                this.openModal= false;
              }})
          .catch((error) => {
              console.log(error)
              This.$vToastify.error(error)
          })
      }
    },
    mounted: function(){
      this.buscarServidores();
    }
}
</script>
<style>
body {
  background: #36D1DC;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #5B86E5, #36D1DC);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #5B86E5, #36D1DC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.app-background {
  background-image: url('../assets/svgs/employee.svg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: -50% 50%;
  background-size: 45rem;
}
</style>