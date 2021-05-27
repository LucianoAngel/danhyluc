<template>
  <div class="app-background">
    <div  id="app" class="container">
      <div class="h2 pt-5 mb-0">
        <h2><b-icon icon="list-task"></b-icon> Categorias</h2>
      </div>
    <!-- Ingrese datos de nuevo categoria -->
        <b-card title="Ingrese los datos de la categoria">
            <b-form-group label-cols-lg="1" label="Nombre">
              <b-form-input v-model.trim="categoria.tipo" placeholder="Ingrese el nombre"></b-form-input>
            </b-form-group>
            <b-button @click="validarcategoria(categoria)" variant="primary">Agregar</b-button>
        </b-card>
     <!-- Lista de categorias -->
        <b-card title="Categorias" class="mt-3">
          <b-list-group v-if="categorias && categorias.length">
            <b-list-group-item v-for="(item, index) of categorias" :key="'categoria'+item.id_categoria">
              <b>Nombre:</b> {{item.tipo}}
              <b-button variant="primary" @click="abrirModal(item)">Editar</b-button>
              <b-button variant="danger" @click="eliminarcategoria(item.id_categoria)">x</b-button>
            </b-list-group-item>
          </b-list-group>
          <div v-else>
            <p>No hay categorias registradas</p>
          </div>
        </b-card>
          <b-modal
            v-model="openModal"
            @ok="cancelarEventoModal"
            title="Ingresa los nuevos datos de la categoria"
          >
           <b-form-group label="Nombre">
              <b-form-input v-model.trim="nuevaCategoria.tipo" placeholder="Ingrese el nombre"></b-form-input>
            </b-form-group>
          </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'agregar-categoria',
    data(){
        return{
            categorias: [],
            categoria: {
              tipo: '',
            },
            nuevaCategoria: {
              tipo: '',
            },
            openModal: false,
        }
    },
    methods: {
        abrirModal(categoria) {
          this.nuevaCategoria = JSON.parse(JSON.stringify(categoria));
          this.openModal= true;
        },
        cancelarEventoModal(evento){
          evento.preventDefault();
          this.validarcategoria(this.nuevaCategoria, true)
        },
        validarcategoria(categoria, editar){
          if(!categoria || !categoria.tipo){
            return this.$vToastify.info('Llena todos los datos para continuar')
          }
          if(categoria.tipo.length > 49) return this.$vToastify.info('Ingresa un nombre más corto');
          if(editar) return this.actualizarcategoria()
          return this.aggcategoria();
        },
        aggcategoria() {
        const This = this;
          axios
            .post('http://localhost:3000/api/categories/add', this.categoria)
            .then((res) => {
                if(res.status==200){
                This.$vToastify.success('categoria agregada satisfactoriamente')
                This.buscarcategorias();
                This.categoria = {
                  tipo: '',
                };
                }else{
                This.$vToastify.error("Ha ocurrido un error")
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
      eliminarcategoria(id) {
        if(!id)return
        const This= this;
        axios
          .delete(`http://localhost:3000/api/categories/${id}`)
          .then((res) => {
              if(res.status==200){
              This.$vToastify.success('categorias eliminado satisfactoriamente')
              This.buscarcategorias()
              }else{
              This.$vToastify.error("Ha ocurrido un error eliminado categoria")
              }})
          .catch((error) => {
              This.$vToastify.error(error)
          })
      },
      actualizarcategoria() {
        const This= this;
        if(!this.nuevaCategoria.id_categoria) return This.$vToastify.error("Ha ocurrido un error inesperado intenta de nuevo")
        axios
          .put(`http://localhost:3000/api/categories/${this.nuevaCategoria.id_categoria}`, this.nuevaCategoria)
          .then((res) => {
              if(res.status==200){
                This.$vToastify.success('categorias actualizado satisfactoriamente')
                This.buscarcategorias()
                This.nuevaCategoria = {
                  tipo: '',
                };
                this.openModal= false;
              }else{
                This.$vToastify.error("Ha ocurrido un error actualizado categoria");
                this.openModal= false;
              }})
          .catch((error) => {
              console.log(error)
              This.$vToastify.error(error)
          })
      }
    },
    mounted: function(){
      this.buscarcategorias();
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
  background-image: url('../assets/svgs/list.svg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: -50% 50%;
  background-size: 40rem;
}
</style>