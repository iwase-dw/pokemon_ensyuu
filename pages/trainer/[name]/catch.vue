<script setup>
const config = useRuntimeConfig();
const name = useRoute().params.name;
/* const resonse = await $fetch(`/api/pokemonlist`, {
    baseURL: config.public.backendOrigin,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
}) */
const { dialog, onOpen, onClose } = useDialog(); 
const min_no = 1;
const max_no = 151;
const response = await $fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${min_no}&limit=${max_no}`);
const pokelist = response.results.map(function(pokemon) {
  return pokemon.name;
})
const onSubmit = async (pokemon) => {
  const pokeinfo = await $fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  //const pokeinfo = tmp_pokeinfo.json();
  console.log(pokeinfo.order)
  console.log(pokeinfo.sprites.front_default)
  const response = await $fetch(`/api/trainer/${name}/pokemon`, {
    baseURL: config.public.backendOrigin,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      order: pokeinfo.order,
      name: pokemon,
      image: pokeinfo.sprites.front_default,
    },
  })
}
</script>

<template>
    <div>
      <h1>ポケモンをつかまえる</h1>
      <p>{{ max_no }}しゅるいのポケモン</p>
      <GamifyList>
      <GamifyItem v-for="pokemon in pokelist" :key="pokemon">
        <p>{{ pokemon }}</p>
        <GamifyButton type="button" @click="onOpen(pokemon)">つかまえる</GamifyButton>
      </GamifyItem>
      </GamifyList>
      <GamifyDialog
      v-if="dialog"
      id="confirm-submit"
      title="かくにん"
      :description="`${dialog}をつかまえますか？`"
      @close="onClose"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onClose">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onSubmit(dialog)">はい</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
    </div>
</template>