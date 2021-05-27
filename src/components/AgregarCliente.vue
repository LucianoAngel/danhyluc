<template>
  <div class="app-background">
    <div  id="app" class="container">
      <div class="h2 pt-5 mb-0">
        <h2><b-icon icon="person-fill"></b-icon> Clientes</h2>
      </div>

    <!-- Ingrese datos de nuevo cliente -->
        <b-card title="Ingrese los datos del cliente">
            <b-form-group label-cols-lg="1" label="Nombre">
              <b-form-input v-model.trim="cliente.descripcion" placeholder="Ingrese el nombre"></b-form-input>
            </b-form-group>
            <b-form-group label-cols-lg="1" label="Teléfono">
              <b-form-input v-model.trim="cliente.telefono" placeholder="Ingrese el número de teléfono"></b-form-input>
            </b-form-group>
            <b-form-group label-cols-lg="1" label="Correo electrónico">
              <b-form-input v-model.trim="cliente.email" placeholder="Ingrese el correo electrónico"></b-form-input>
            </b-form-group>
            <b-form-group label-cols-lg="1" label="Identificación">
              <b-form-input v-model.number="cliente.identificacion" placeholder="Ingrese la identificación"></b-form-input>
            </b-form-group>
            <b-button @click="validarCliente(cliente)" variant="primary">Agregar</b-button>
        </b-card>
     <!-- Lista de clientes -->
        <b-card title="Clientes" class="mt-3">
          <b-list-group v-if="clientes && clientes.length">
            <b-list-group-item v-for="item of clientes" :key="'Servidor'+item.id_cliente">
              <b>Nombre:</b> {{item.descripcion}} - <b>Teléfono:</b> {{item.telefono}} - <b>Email:</b> {{item.email}}
              - <b>identificacion:</b> {{item.identificacion}}
              <b-button variant="primary" @click="abrirModal(item)">Editar</b-button>
              <b-button variant="danger" @click="eliminarCliente(item.id_cliente)">x</b-button>
            </b-list-group-item>
          </b-list-group>
          <div v-else>
            <p>No hay clientes registrados</p>
          </div>
        </b-card>
          <b-modal
            v-model="openModal"
            @ok="cancelarEventoModal"
            title="Ingresa los nuevos datos del servidor"
          >
           <b-form-group label="Nombre">
              <b-form-input v-model.trim="nuevoCliente.descripcion" placeholder="Ingrese el nombre"></b-form-input>
            </b-form-group>
            <b-form-group label="Teléfono">
              <b-form-input v-model.trim="nuevoCliente.telefono" placeholder="Ingrese el número de teléfono"></b-form-input>
            </b-form-group>
            <b-form-group label="Correo electrónico">
              <b-form-input v-model.trim="nuevoCliente.email" placeholder="Ingrese el email"></b-form-input>
            </b-form-group>
            <b-form-group label="Identificación">
              <b-form-input v-model.number="nuevoCliente.identificacion" placeholder="Ingrese la identificación"></b-form-input>
            </b-form-group>
          </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'agregar-cliente',
    data(){
        return{
            clientes: [],
            cliente: {
              descripcion: '',
              telefono: '',
              email: '',
              identificacion: '',
            },
            nuevoCliente: {
              descripcion: '',
              telefono: '',
              email: '',
              identificacion: '',
            },
            openModal: false,
        }
    },
    methods: {
        abrirModal(cliente) {
          this.nuevoCliente = JSON.parse(JSON.stringify(cliente));
          this.openModal= true;
        },
        cancelarEventoModal(evento){
          evento.preventDefault();
          this.validarCliente(this.nuevoCliente, true)
        },
        validarCliente(cliente, editar){
          const emailReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
          if(!cliente || !cliente.descripcion || !cliente.telefono
            || !cliente.email || !cliente.identificacion){
            return this.$vToastify.info('Llena todos los datos para continuar')
          }
          if(cliente.descripcion.length > 49) return this.$vToastify.info('Ingresa un nombre más corto');
          if(cliente.telefono.length > 11) return this.$vToastify.info('El teléfono debe contar con 11 caracteres maximo');
          if(cliente.email.length > 49) return this.$vToastify.info('Ingresa un email más corto');
          if(cliente.identificacion.length > 9) return this.$vToastify.info('La identificación debe contar con 9 caracteres maximo');
          if(!emailReg.test(cliente.email)) return this.$vToastify.info('Ingresa un email valido');
          if(!parseInt(cliente.identificacion)) return this.$vToastify.info('La identificación debe ser númerica');
          if(editar) return this.actualizarCliente()
          return this.aggCliente();
        },
        aggCliente() {
        const This = this;
          axios
            .post('http://localhost:3000/api/clients/add', this.cliente)
            .then((res) => {
                if(res.status==200){
                This.$vToastify.success('Persona agregada satisfactoriamente')
                This.buscarClientes();
                This.cliente = {
                  descripcion: '',
                  telefono: '',
                  email: '',
                  identificacion: '',
                };
                }else{
                This.$vToastify.error("Ha ocurrido un error")
                }})
            .catch((error) => {
                console.log(error)
                This.$vToastify.error(error)
            })
      },
      buscarClientes() {
        const This= this;
        axios
          .get('http://localhost:3000/api/clients')
          .then((res) => {
              if(res.status==200){
                console.log(res.data)
              This.clientes = res.data;
              This.$vToastify.success('Clientes obtenidos satisfactoriamente')
              }else{
              This.$vToastify.error("Ha ocurrido un error obteniendo los clientes")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      eliminarCliente(id) {
        if(!id)return
        const This= this;
        axios
          .delete(`http://localhost:3000/api/clients/${id}`)
          .then((res) => {
              if(res.status==200){
              This.$vToastify.success('Clientes eliminado satisfactoriamente')
              This.buscarClientes()
              }else{
              This.$vToastify.error("Ha ocurrido un error eliminado cliente")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      actualizarCliente() {
        const This= this;
        if(!this.nuevoCliente.id_cliente) return This.$vToastify.error("Ha ocurrido un error inesperado intenta de nuevo")
        axios
          .put(`http://localhost:3000/api/clients/${this.nuevoCliente.id_cliente}`, this.nuevoCliente)
          .then((res) => {
              if(res.status==200){
                This.$vToastify.success('Clientes actualizado satisfactoriamente')
                This.buscarClientes()
                This.nuevoCliente = {
                  descripcion: '',
                  telefono: '',
                  email: '',
                  identificacion: '',
                };
                this.openModal= false;
              }else{
                This.$vToastify.error("Ha ocurrido un error actualizado cliente");
                this.openModal= false;
              }})
          .catch((error) => {
              console.log(error)
              This.$vToastify.error(error)
          })
      }
    },
    mounted: function(){
      this.buscarClientes();
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
  background-image: url('../assets/svgs/user.svg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: -50% 50%;
  background-size: 45rem;
}
</style>