<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const name = useRoute().params.name;
//console.log("in index.vue name:" + name)
const { data: trainers } = await useTrainers();
const trainerinfo = await $fetch(`/api/trainer/${name}`, {
    baseURL: config.public.backendOrigin,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
})
const gotoCatch = () => {
    router.push(`/trainer/${name}/catch`);
}
</script>

<template>
    <div>
      <h1>トレーナー情報</h1>
      <img :src="`/avatar.png`" />
      <p>{{ name }}</p>
      <h1>てもちポケモン</h1>
      <GamifyButton @click="gotoCatch()">ポケモンをつかまえる</GamifyButton>
      <GamifyList>
      <GamifyItem v-for="pokemon in trainerinfo.pokemons" :key="pokemon.id">
        <img :src="pokemon.sprites.front_default" />
        <p>{{ pokemon.name }}</p>
      </GamifyItem>
    </GamifyList>
    </div>

  </template>
  