<template>
  <div class="app-background">
    <div  id="app" class="container">
      <div class="h2 pt-5 mb-0">
        <h2><b-icon icon="receipt"></b-icon> Transacciones</h2>
      </div>
    <!-- Ingrese datos de nuevo transaccion -->
        <b-card title="Ingrese los datos del transaccion">
            <p><b>Fecha: {{fechaActual}}</b></p>
            <b-form-group label-cols-lg="1" label="Cliente">
              <b-form-select
                v-model="transaccion.id_cliente"
                :options="clientes"
                value-field="id_cliente"
                text-field="descripcion"
              >
                <template #first>
                  <b-form-select-option value="" disabled>Selecciona un cliente</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-form-group label-cols-lg="1" label="Servicio">
              <b-form-select
                v-model="transaccion.id_servicio"
                :options="servicios"
                value-field="id_servicio"
                text-field="descripcion"
                @change="calcularMonto"
              >
                <template #first>
                  <b-form-select-option value="" disabled>Selecciona un servicio</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
            <p><b>Monto: {{transaccion.monto_total ? transaccion.monto_total : '0'}} Bs.s</b></p>
            <b-button @click="validarTransaccion(transaccion)" variant="primary">Agregar</b-button>
        </b-card>
     <!-- Lista de transacciones -->

        <b-card title="Transacciones" class="mt-3">
          <b-list-group v-if="transacciones && transacciones.length">
            <b-list-group-item v-for="item of transaccionesFormateadas" :key="'transaccion'+item.id_transaccion">
              <b>Fecha:</b> {{item.fecha}} - <b>Cliente:</b> {{item.nombreCliente}} - <b>Monto:</b> {{item.monto_total}} Bs.s
              <b-button variant="primary" @click="abrirModal(item)">Editar</b-button>
              <b-button variant="danger" @click="eliminartransaccion(item.id_transaccion)">x</b-button>
            </b-list-group-item>
          </b-list-group>
          <div v-else>
            <p>No hay transacciones registradas</p>
          </div>
        </b-card>
          <b-modal
            v-model="openModal"
            @ok="cancelarEventoModal"
            title="Ingresa los nuevos datos del transaccion"
          >
            <p><b>Fecha: {{fechaActual}}</b></p>
            <b-form-group label-cols-lg="1" label="Cliente">
              <b-form-select
                v-model="nuevaTransaccion.id_cliente"
                :options="clientes"
                value-field="id_cliente"
                text-field="descripcion"
              >
                <template #first>
                  <b-form-select-option value="" disabled>Selecciona un cliente</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-form-group label-cols-lg="1" label="Servicio">
              <b-form-select
                v-model="nuevaTransaccion.id_servicio"
                :options="servicios"
                value-field="id_servicio"
                text-field="descripcion"
                @change="calcularMontoEditar"
              >
                <template #first>
                  <b-form-select-option value="" disabled>Selecciona un servicio</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
            <p><b>Monto: {{nuevaTransaccion.monto_total ? nuevaTransaccion.monto_total : '0'}} Bs.s</b></p>
          </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'agregar-transaccion',
    data(){
      return{
        transacciones: [],
        clientes: [],
        servicios: [],
        transaccion: {
          fecha: '',
          id_cliente: '',
          id_servicio: '',
          monto_total: '',
        },
        nuevaTransaccion: {
          fecha: '',
          id_cliente: '',
          id_servicio: '',
          monto_total: '',
        },
        openModal: false,
      }
    },
    computed: {
      transaccionesFormateadas() {
        if(this.transacciones){
          const transaccionesFormateadas = this.transacciones.map(t => {
            const cliente = this.clientes.filter(c => c.id_cliente === t.id_cliente)
            const nombreCliente = cliente[0] ? cliente[0].descripcion : 'Sin especificar';
            const fechaFormato = t.fecha.split('T')
            return ({
              fecha: fechaFormato[0],
              id_cliente: t.id_cliente,
              nombreCliente: nombreCliente,
              monto_total: t.monto_total,
              id_transaccion: t.id_transaccion
            })
          })
          return transaccionesFormateadas
        }
      },
      fechaActual() {
        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        const sinFormato = hoy.toLocaleDateString();
        const paraFormato = sinFormato.split('/')
        const conFormato = `${paraFormato[2]}-${paraFormato[1].length > 1 ? '' : 0}${paraFormato[1]}-${paraFormato[0].length > 1 ? '' : 0}${paraFormato[0]}`
        return conFormato
      }
    },
    methods: {
      calcularMonto(){
        const id = this.transaccion.id_servicio;
        if(this.transaccion.id_servicio){
          const servicio = this.servicios.filter(x => {
            return x.id_servicio === id
          })
          this.transaccion.monto_total = servicio[0].monto
        }
      },
      calcularMontoEditar(){
        const id = this.nuevaTransaccion.id_servicio;
        if(this.nuevaTransaccion.id_servicio){
          const servicio = this.servicios.filter(x => {
            return x.id_servicio === id
          })
          this.nuevaTransaccion.monto_total = servicio[0].monto
        }
      },
        abrirModal(transaccion) {
          this.nuevaTransaccion = JSON.parse(JSON.stringify(transaccion));
          this.openModal= true;
        },
        cancelarEventoModal(evento){
          evento.preventDefault();
          this.validarTransaccion(this.nuevaTransaccion, true)
        },
        validarTransaccion(transaccion, editar){
          if(!transaccion || !transaccion.id_cliente || !transaccion.id_servicio){
            return this.$vToastify.info('Llena todos los datos para continuar')
          }
          if(editar) return this.actualizartransaccion()
          return this.aggTransaccion();
        },
        aggTransaccion() {
          // Asignar fecha actual a la transacción
        const transaccion = {...this.transaccion};
        transaccion.fecha = this.fechaActual
        const This = this;
          axios
            .post('http://localhost:3000/api/transactions/add', transaccion)
            .then((res) => {
                if(res.status==200){
                This.$vToastify.success('transaccion creada satisfactoriamente')
                This.buscartransacciones();
                This.transaccion = {
                  descripcion: '',
                  id_categoria: '',
                  monto: '',
                };
                }else{
                This.$vToastify.error("Ha ocurrido un error")
                }})
            .catch((error) => {
                This.$vToastify.error(error)
            })
      },
      buscartransacciones() {
        const This= this;
        axios
          .get('http://localhost:3000/api/transactions')
          .then((res) => {
              if(res.status==200){
                console.log('transacciones', res.data)
                This.transacciones = res.data;
                This.$vToastify.success('transacciones obtenidos satisfactoriamente')
              }else{
                This.$vToastify.error("Ha ocurrido un error obteniendo los transacciones")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      eliminartransaccion(id) {
        console.log('no llamo', id)
        if(!id)return
        console.log('se llamo')
        const This= this;
        axios
          .delete(`http://localhost:3000/api/transactions/${id}`)
          .then((res) => {
              if(res.status==200){
              This.$vToastify.success('transacciones eliminado satisfactoriamente')
              This.buscartransacciones()
              }else{
              This.$vToastify.error("Ha ocurrido un error eliminado transaccion")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      actualizartransaccion() {
        const This= this;
        if(!this.nuevaTransaccion.id_transaccion) return This.$vToastify.error("Ha ocurrido un error inesperado intenta de nuevo")
        axios
          .put(`http://localhost:3000/api/transactions/${this.nuevaTransaccion.id_transaccion}`, this.nuevaTransaccion)
          .then((res) => {
              if(res.status==200){
                This.$vToastify.success('transacciones actualizado satisfactoriamente')
                This.buscartransacciones()
                This.nuevaTransaccion = {
                  descripcion: '',
                  id_categoria: '',
                  monto: '',
                };
                this.openModal= false;
              }else{
                This.$vToastify.error("Ha ocurrido un error actualizado transaccion");
                this.openModal= false;
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      buscarclientes() {
        const This= this;
        axios
          .get('http://localhost:3000/api/clients')
          .then((res) => {
              if(res.status==200){
              This.clientes = res.data;
              This.$vToastify.success('clientes obtenidos satisfactoriamente')
              }else{
              This.$vToastify.error("Ha ocurrido un error obteniendo los clientes")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      buscarservicios() {
      const This= this;
      axios
        .get('http://localhost:3000/api/services')
        .then((res) => {
            if(res.status==200){
            console.log('servicios ',res.data)
            This.servicios = res.data;
            This.$vToastify.success('servicios obtenidos satisfactoriamente')
            }else{
            This.$vToastify.error("Ha ocurrido un error obteniendo los servicios")
            }})
        .catch((error) => {
            This.$vToastify.error(error)
        })
      },
    },
    mounted: function(){
      this.buscartransacciones();
      this.buscarclientes();
      this.buscarservicios();
    }
}
</script>
<style>
body{
  background: #36D1DC;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #5B86E5, #36D1DC);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #5B86E5, #36D1DC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.app-background {
  background-image: url('../assets/svgs/transaction.svg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: -50% 50%;
  background-size: 35rem;
}
</style>