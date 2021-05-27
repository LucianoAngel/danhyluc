<template>
  <div class="container mt-5">
    <div class="pt-2">
      <h1 class="text-light">Servicio técnico <span class="text-dark">Dahnyluc</span></h1>
      <p>¡Somos tu mejor aliado!</p>
    </div>
    <div class="pt-4">
      <b-carousel
      id="carousel-1"
      :interval="3000"
      controls
      indicators
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333;"
    >
      <!-- Text slides with image -->
      <b-carousel-slide
        img-src="./../assets/reparacion1.jpg"
      ></b-carousel-slide>

      <!-- Slides with custom text -->
      <b-carousel-slide img-src="./../assets/reparacion2.jpg">
      </b-carousel-slide>

      <!-- Slides with img slot -->
      <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
      <b-carousel-slide>
        <template #img>
          <img
            class="d-block img-fluid w-100"
            width="1024"
            height="480"
            src="./../assets/reparacion4.jpg"
            alt="image slot"
          >
        </template>
      </b-carousel-slide>
    </b-carousel>
    </div>

    <div class="pt-5">
      <h2>Contamos con servicios innovadores <b-badge variant="primary">Nuevo</b-badge></h2>
    </div>
    <div class="mt-5">
      <b-jumbotron>
        <template #header>¿Quienes somos?</template>

        <template #lead>
          Una empresa tecnologica dedicada al mantenimiento de software y hardware de distinticos
          equipos electronicos, contamos con respuesta inmediata al cliente y excelente atención.
        </template>

        <hr class="my-4">

        <p>
          Cuentas con mantenimiento preventido de piezas.
        </p>


        <div>
          <b-badge class="p-3 mr-2">#Atención</b-badge>
          <b-badge class="p-3 mr-2" variant="primary">#Más</b-badge>
          </div>
      </b-jumbotron>
    </div>

    <div >
      <div class="pt-3 mb-3">
        <h3 class="pb-3">Categorias</h3>
        <b-card-group deck>
          <b-card img-src="./../assets/reparacion1.jpg" img-alt="Card image" img-top>
            <b-card-text>
              Revisión de todo el equipo y sus componentes.
            </b-card-text>
          </b-card>

          <b-card img-src="./../assets/reparacion2.jpg" img-alt="Card image" img-top>
            <b-card-text>
              Limpieza de cada componente del equipo.
            </b-card-text>
          </b-card>
        </b-card-group>
      </div>
    </div>
  </div>
</template>

<style>
  body{
    background: #36D1DC;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #5B86E5, #36D1DC);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #5B86E5, #36D1DC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
</style>