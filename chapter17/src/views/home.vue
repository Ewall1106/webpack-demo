<template>
  <div class="home">
    <Header />
    <Content />
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Content from "@/components/content.vue";
import Footer from "@/components/footer.vue";

export default {
  name: "Home",
  components: {
    Header,
    Content,
    Footer
  }
};
</script>

