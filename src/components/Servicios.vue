<template>
  <div class="app-background">
    <div  id="app" class="container">
      <div class="h2 pt-5 mb-0">
        <h2><b-icon icon="wrench"></b-icon> Servicios</h2>
      </div>
    <!-- Ingrese datos de nuevo servicio -->
        <b-card title="Ingrese los datos del servicio">
            <b-form-group label-cols-lg="1" label="Nombre">
              <b-form-input v-model.trim="servicio.descripcion" placeholder="Ingrese el nombre"></b-form-input>
            </b-form-group>
            <b-form-group label-cols-lg="1" label="Categoria">
              <b-form-select
                v-model="servicio.id_categoria"
                :options="categorias"
                value-field="id_categoria"
                text-field="tipo"
              >
                <template #first>
                  <b-form-select-option value="" disabled>Selecciona una categoria</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-form-group label-cols-lg="1" label="Monto">
              <b-form-input v-model.number="servicio.monto" placeholder="Ingrese el monto"></b-form-input>
            </b-form-group>
            <b-button @click="validarservicio(servicio)" variant="primary">Agregar</b-button>
        </b-card>
     <!-- Lista de servicios -->
        <b-card title="Servicios" class="mt-3">
          <b-list-group v-if="servicios && servicios.length">
            <b-list-group-item v-for="item of serviciosFormateados" :key="'servicio'+item.id_servicio">
              <b>Nombre:</b> {{item.descripcion}} - <b>Categoria:</b> {{item.nombreCategoria}}
              - <b>Monto:</b> {{item.monto}}
              <b-button variant="primary" @click="abrirModal(item)">Editar</b-button>
              <b-button variant="danger" @click="eliminarservicio(item.id_servicio)">x</b-button>
            </b-list-group-item>
          </b-list-group>
          <div v-else>
            <p>No hay servicios registrados</p>
          </div>
        </b-card>
          <b-modal
            v-model="openModal"
            @ok="cancelarEventoModal"
            title="Ingresa los nuevos datos del servicio"
          >
            <b-form-group label="Nombre">
              <b-form-input v-model.trim="nuevoServicio.descripcion" placeholder="Ingrese el nombre"></b-form-input>
            </b-form-group>
            <b-form-group label="Categoria">
              <b-form-select
                v-model="nuevoServicio.id_categoria"
                :options="categorias"
                value-field="id_categoria"
                text-field="tipo"
              >
                <template #first>
                  <b-form-select-option value="" disabled>Selecciona una categoria</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-form-group label="Monto">
              <b-form-input v-model.number="nuevoServicio.monto" placeholder="Ingrese el monto"></b-form-input>
            </b-form-group>
          </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'agregar-servicio',
    data(){
        return{
            servicios: [],
            categorias: [],
            servicio: {
              descripcion: '',
              id_categoria: '',
              monto: '',
            },
            nuevoServicio: {
              descripcion: '',
              id_categoria: '',
              monto: '',
            },
            openModal: false,
        }
    },
    computed: {
      serviciosFormateados() {
        if(this.servicios){
          const serviciosFormateados = this.servicios.map(t => {
            const categoria = this.categorias.filter(c => c.id_categoria === t.id_categoria)
            const nombreCategoria = categoria[0] ? categoria[0].tipo : 'Sin especificar';
            return ({
              descripcion: t.descripcion,
              id_categoria: t.id_categoria,
              nombreCategoria: nombreCategoria,
              monto: t.monto,
              id_servicio: t.id_servicio
            })
          })
          return serviciosFormateados
        }
      },
    },
    methods: {
        ejemplo(){
          this.categorias.filter((e) => {
            return e.id === item.id_categoria
          })
        },
        abrirModal(servicio) {
          this.nuevoServicio = JSON.parse(JSON.stringify(servicio));
          this.openModal= true;
        },
        cancelarEventoModal(evento){
          evento.preventDefault();
          this.validarservicio(this.nuevoServicio, true)
        },
        validarservicio(servicio, editar){
          if(!servicio || !servicio.descripcion || !servicio.id_categoria
            || !servicio.monto){
            return this.$vToastify.info('Llena todos los datos para continuar')
          }
          if(servicio.descripcion.length > 49) return this.$vToastify.info('Ingresa un nombre más corto');
          if(!parseInt(servicio.monto)) return this.$vToastify.info('El monto debe ser númerico');
          if(editar) return this.actualizarservicio()
          return this.aggservicio();
        },
        aggservicio() {
        const This = this;
          axios
            .post('http://localhost:3000/api/services/add', this.servicio)
            .then((res) => {
                if(res.status==200){
                This.$vToastify.success('servicio agregado satisfactoriamente')
                This.buscarservicios();
                This.servicio = {
                  descripcion: '',
                  id_categoria: '',
                  monto: '',
                };
                }else{
                This.$vToastify.error("Ha ocurrido un error")
                }})
            .catch((error) => {
                console.log(error)
                This.$vToastify.error(error)
            })
      },
      buscarservicios() {
        const This= this;
        axios
          .get('http://localhost:3000/api/services')
          .then((res) => {
              if(res.status==200){
                console.log(res.data)
              This.servicios = res.data;
              This.$vToastify.success('servicios obtenidos satisfactoriamente')
              }else{
              This.$vToastify.error("Ha ocurrido un error obteniendo los servicios")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      eliminarservicio(id) {
        if(!id)return
        const This= this;
        axios
          .delete(`http://localhost:3000/api/services/${id}`)
          .then((res) => {
              if(res.status==200){
              This.$vToastify.success('servicios eliminado satisfactoriamente')
              This.buscarservicios()
              }else{
              This.$vToastify.error("Ha ocurrido un error eliminado servicio")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      actualizarservicio() {
        const This= this;
        if(!this.nuevoServicio.id_servicio) return This.$vToastify.error("Ha ocurrido un error inesperado intenta de nuevo")
        axios
          .put(`http://localhost:3000/api/services/${this.nuevoServicio.id_servicio}`, this.nuevoServicio)
          .then((res) => {
              if(res.status==200){
                This.$vToastify.success('servicios actualizado satisfactoriamente')
                This.buscarservicios()
                This.nuevoServicio = {
                  descripcion: '',
                  id_categoria: '',
                  monto: '',
                };
                this.openModal= false;
              }else{
                This.$vToastify.error("Ha ocurrido un error actualizado servicio");
                this.openModal= false;
              }})
          .catch((error) => {
              console.log(error)
              This.$vToastify.error(error)
          })
      },
      buscarcategorias() {
        const This= this;
        axios
          .get('http://localhost:3000/api/categories')
          .then((res) => {
              if(res.status==200){
                console.log(res.data)
              This.categorias = res.data;
              This.$vToastify.success('categorias obtenidos satisfactoriamente')
              }else{
              This.$vToastify.error("Ha ocurrido un error obteniendo los categorias")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
    },
    mounted: function(){
      this.buscarservicios();
      this.buscarcategorias();
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
  background-image: url('../assets/svgs/technical-support.svg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: -50% 50%;
  background-size: 35rem;
}
</style>