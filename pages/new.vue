<script setup>
const router = useRouter();
const nameinput = defineModel();
const config = useRuntimeConfig();
const nameEntry = async() => {
  console.log("name:" + nameinput.value)
  const response = await $fetch("/api/trainer", {
    baseURL: config.public.backendOrigin,
    //baseURL: "http://localhost:3000",
    method: "POST",
    //method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({name: nameinput.value})
  })
  if(response instanceof Error) return;
  //router.push(`/trainer/${nameinput.value}`);
}
</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>では　はじめに　きみの　なまえを　おしえて　もらおう！</p>
    <form @submit.prevent>
      <p>なまえ<br>とくていの　もじは　とりのぞかれるぞ！</p>
      <input type="name" v-model="nameinput"/>
      <GamifyButton @click="nameEntry()">けってい</GamifyButton>
    </form>
    
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>
