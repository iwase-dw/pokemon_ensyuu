import { Router } from "express";
import { findTrainers, getTrainer, upsertTrainer } from "~/server/utils/trainer";
import { findPokemon } from "~/server/utils/pokemon";

const router = Router();

router.get("/hello", (_req, res) => {
  res.send("Hello World");
});

/** トレーナー名の一覧の取得 */
router.get("/trainers", async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    // TODO: 期待するレスポンスボディに変更する
    //console.log("trainers:" + JSON.stringify(trainers))
    var keys = trainers.map(item => item.Key);
    keys = keys.map(item => item.replace(".json", ""))
    console.log("keys:" + keys)
    res.send(keys);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
router.post("/trainer", async (req, res, next) => {
  //console.log("call trainer api")
  try {
    // TODO: リクエストボディにトレーナー名が含まれていなければ400を返す
    //console.log("name:" + req.body.name)
    if(req.body.name === "") {
      //console.log("no trainer name error.");
      return res.sendStatus(400);
    }
    // TODO: すでにトレーナー（S3 オブジェクト）が存在していれば409を返す
    const trainers = await findTrainers();
    //console.log("trainers:" + JSON.stringify(trainers))
    if(trainers.some(function({ Key }) {
      //console.log(`Key:${Key}, ${req.body.name}.json`)
      if(Key === `${req.body.name}.json`)
        return true;
      else
        return false;
    })) {
      //console.log(`[error]${req.body.name} is already exist.`)
      return res.sendStatus(409);
    }

    const result = await upsertTrainer(req.body.name, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの取得 */
// TODO: トレーナーを取得する API エンドポイントの実装
router.get("/trainer/:name", async (_req, res, next) => {
  try {
    const { name } = _req.params;
    //console.log("in api/trainer name:" + name)
    const trainerinfo = await getTrainer(name);
    // TODO: 期待するレスポンスボディに変更する
    //console.log("traintrainerinfoers:" + trainerinfo)
    res.send(trainerinfo);
    //res.send("API trainer OK")
  } catch (err) {
    next(err);
  }
});

/** トレーナーの更新 */
router.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: トレーナーが存在していなければ404を返す
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの削除 */
// TODO: トレーナーを削除する API エンドポイントの実装

/** ポケモンの追加 */
router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {
  try {
    //console.log("add pokemon")
    const { trainerName } = req.params;
    const trainer = await getTrainer(trainerName);
    //console.log("getTrainer OK")
    //console.log(trainer)
    //console.log(JSON.stringify(req.body))
    //console.log("trainer.pokemons.length")
    //console.log(trainer.pokemons.length)
    // TODO: リクエストボディにポケモン名が含まれていなければ400を返す
    if(!('name' in req.body))
      return res.sendStatus(400);
    //const pokemon = await findPokemon(req.body.name);
    // idは削除を考慮していない作りなので、削除機能追加の場合は要修正
    const pokemon = {
      id: trainer.pokemons.length + 1,
      nickname: "",
      order: req.body.order,
      name: req.body.name,
      sprites: {
        front_default: req.body.image
      },
    }
    //console.log("pokemon:" + pokemon);
    trainer.pokemons.push(pokemon);
    //console.log("after add trainer")
    //console.log(trainer)
    // TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
    const result = await upsertTrainer(trainerName, trainer);
    res.status(result["$metadata"].httpStatusCode).send(result);
    //res.status(201).send()
  } catch (err) {
    next(err);
  }
});

/** ポケモンの削除 */
// TODO: ポケモンを削除する API エンドポイントの実装

/** ポケモンリストの取得 */
router.get("/pokemonlist", async (_req, res, next) => {
  try {
    const pokelist = [];
    for(var i=1; i <= 1; i++) {
      var pokemon = await findPokemon(i);
      pokelist.push(pokemon);
    }
    //console.log("pokelist:" + pokelist)
    res.send(pokelist);
  } catch (err) {
    next(err);
  }
});

export default router;
