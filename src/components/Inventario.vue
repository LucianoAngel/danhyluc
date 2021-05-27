<template>
   <div id="app" class="container mt-5">
       <div class="alert alert-primary" role="alert">
            <h2 class="d-flex mx-auto text-dark">Inventario</h2>
            </div>
            <div v-if="productos.length">
              <!-- inventario -->
              <b-card class="mt-3">
                  <h4>Inventario</h4>
                  <div class="mt-3" v-for="(item, index) of productosTimeFormated">
                      <div class="alert alert-primary" role="alert">
                          <div class="d-flex justify-content-between align-items-center">
                              <div>
                              <b> Producto: </b>  {{item.nombre}} <b>Precio de Venta:</b> {{item.precioVenta}} Bs. <b>fecha: </b>  {{item.createdAt}}
                              <b> Marca: </b> {{item.marca}}
                              </div>
                              <div>
                                  <button class="btn btn-danger btn-sm" @click="abrirModal(item._id, index)">Edit</button>
                                  <button class="btn btn-danger btn-sm" @click="deleteProduct(item._id)">x</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </b-card>
              <!-- Lista de precios -->
              <b-card class="mt-3 mb-3">
                <h3>Lista de Precios </h3>
                <b-container class="bv-example-row">
                    <b-row>
                        <b-col><b>Nombre del producto</b></b-col>
                        <b-col><b>Marca</b></b-col>
                        <b-col><b>Precio Bs:</b> </b-col>
                    </b-row>
                </b-container>
                <div class="mt-3" v-for="(item, index) of productos">
                    <b-container class="bv-example-row">
                    <b-row>
                        <b-col>{{item.nombre}}</b-col>
                        <b-col>{{item.marca}}</b-col>
                        <b-col>{{item.precioVenta}}</b-col>
                    </b-row>
                </b-container>
                </div>
            </b-card>
            <b-modal
                id="modal-prevent-closing"
                v-model="openModal"
                @ok="handleOk"
                title="Ingresa nuevos datos del producto"  
                header-bg-variant="Black"
              >
                <form @submit.prevent="handleSubmit">
                  <b-form-group
                    label="Nombre:"  
                  >
                    <b-form-input v-model="newProducto.nombre" :placeholder="productos[indexProduct].nombre"></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="Marca:"  
                  >
                    <b-form-input v-model="newProducto.marca" :placeholder="productos[indexProduct].marca"></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="Precio de compra:"  
                  >
                    <b-form-input v-model="newProducto.precioCompra" :placeholder="productos[indexProduct].precioCompra"></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="Precio de venta:"  
                  >
                    <b-form-input v-model="newProducto.precioVenta" :placeholder="productos[indexProduct].precioVenta"></b-form-input>
                  </b-form-group>
                </form>
              </b-modal>
            </div>
        </div>
</template>

<script>
import axios from "axios"

export default {
    name: 'Inventario',
    data(){
        return{
            moreProducts: false,
            countProducts: '',
            productos: [],
            producto: {
                nombre: '',
                marca: '',
                precioCompra: '',
                precioVenta: '',
            },
            newProducto: {
                nombre: '',
                marca: '',
                precioCompra: '',
                precioVenta: '',
            },
            idProduct: '',
            openModal: false,
            indexProduct: 0,
        }
    },
    computed: {
       productosTimeFormated: function(val){
        if(!this.productos){
          return
        }else{
          let productos = this.productos
          productos.forEach(producto => {
          const isoSplit = producto.createdAt.split('T');
          const dateSplit = isoSplit[0].split('-')
          producto.createdAt = `${dateSplit[0]}-${dateSplit[1]}-${dateSplit[2]}`
        })
        return productos
        }
      },
    },
    methods: {
      abrirModal(id, index) {
          this.indexProduct= index;
          this.idProduct = id;
          this.openModal= true;
      },
      handleSubmit() {
        if(!this.newProducto.nombre || !this.newProducto.marca || !this.newProducto.precioCompra || !this.newProducto.precioVenta){
          return this.$vToastify.info('Llena todos los datos para continuar')
        }
          this.$nextTick(()=> {
            this.$bvModal.hide('modal-prevent-closing')
          })
          this.updateProduct();
      },
      handleOk(bvModalEvt) {
          bvModalEvt.preventDefault()
          this.handleSubmit();
      },
      aggProduct() {
        const This = this;
        const arrayDeProductos = [];
        let productoAEnviar = '';
        let rutaCreate = 'http://localhost:4012/api/createproduct';
        if((!this.producto.nombre || !this.producto.marca || !this.producto.precioCompra || !this.producto.precioVenta)
          || (this.moreProducts && this.countProducts == 0)){
          return This.$vToastify.info('Llena todos los datos para continuar')
        }
        if(this.moreProducts && this.countProducts){
             for (let index = 0; index < this.countProducts; index++) {
              arrayDeProductos.push(this.producto)
            }
            productoAEnviar = arrayDeProductos;
            rutaCreate = 'http://localhost:4012/api/createmanyproducts'
          }else {
          productoAEnviar = this.producto
        }
          axios
            .post(rutaCreate, productoAEnviar)
            .then((res) => {
                if(res.status==200){
                This.$vToastify.success('Producto agregado satisfactoriamente')
                This.findProducts();
                This.producto = {
                  nombre: '',
                  marca: '',
                  precioCompra: '',
                  precioVenta: '',
                };
                This.countProducts= '';
                }else{
                This.$vToastify.error("Ha ocurrido un error")
                }})
            .catch((error) => {
                console.log(error)
                This.$vToastify.error(error)
            })
      },
      findProducts() {
        const This= this;
        axios
          .get('http://localhost:4012/api/findproducts')
          .then((res) => {
              if(res.status==200){
              This.productos = res.data;
              This.$vToastify.success('Productos obtenidos satisfactoriamente')
              }else{
              This.$vToastify.error("Ha ocurrido un error obteniendo los productos")
              }})
          .catch((error) => {
              console.log(error)
              This.$vToastify.error(error)
          })
      },
      deleteProduct(id) {
        const This= this;
        axios
          .delete(`http://localhost:4012/api/deleteproduct/${id}`)
          .then((res) => {
              if(res.status==200){
              This.$vToastify.success('Producto eliminado satisfactoriamente')
              This.findProducts()
              }else{
              This.$vToastify.error("Ha ocurrido un error eliminado producto")
              }})
          .catch((error) => {
              console.log(error)
              This.$vToastify.error(error)
          })
      },
      updateProduct() {
        const This= this;
        const id = this.idProduct;
        if(!this.newProducto.nombre || !this.newProducto.marca || !this.newProducto.precioCompra || !this.newProducto.precioVenta){
          return This.$vToastify.info('Llena todos los datos para continuar')
        }
        axios
          .put(`http://localhost:4012/api/updateproduct/${id}`, This.newProducto)
          .then((res) => {
              if(res.status==200){
              This.$vToastify.success('Producto actualizado satisfactoriamente')
              This.findProducts()
              This.newProducto = {
                nombre: '',
                marca: '',
                precioCompra: '',
                precioVenta: '',
              };
              This.idProduct = '';
              }else{
              This.$vToastify.error("Ha ocurrido un error actualizado producto")
              }})
          .catch((error) => {
              console.log(error)
              This.$vToastify.error(error)
          })
      }
    },
    mounted: function(){
      this.findProducts();
    },
}
</script>